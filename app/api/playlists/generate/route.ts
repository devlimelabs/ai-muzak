import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import SpotifyAPI, { SpotifyTrack } from '@/app/lib/spotify'
import { analyzeMood } from '@/app/lib/openai'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.accessToken || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await request.json()
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }

    const spotify = new SpotifyAPI(session.accessToken)
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', session.user.email))
    const userData = userDoc.data()
    const userGenres = userData?.topGenres || []
    
    // Analyze mood with OpenAI
    const moodAnalysis = await analyzeMood(prompt, userGenres)
    
    // Fetch user's music data
    const [topTracks, recentlyPlayed, spotifyUser] = await Promise.all([
      spotify.getTopTracks(50),
      spotify.getRecentlyPlayed(50),
      spotify.getCurrentUser(),
    ])
    
    // Build track pool
    const tracks: SpotifyTrack[] = []
    const trackIds = new Set<string>()
    
    // 1. Add matching tracks from user's top tracks (40%)
    const targetCount = 25 // Target playlist size
    const userTracksTarget = Math.floor(targetCount * 0.4)
    
    // Filter user's top tracks by energy level
    const energyFilteredTracks = topTracks.items.filter((track: SpotifyTrack) => {
      // Simple energy estimation based on track name and artist
      const trackString = `${track.name} ${track.artists[0].name}`.toLowerCase()
      const highEnergyWords = ['party', 'dance', 'pump', 'hype', 'rock', 'metal']
      const lowEnergyWords = ['sleep', 'calm', 'relax', 'chill', 'ambient', 'quiet']
      
      const hasHighEnergy = highEnergyWords.some(word => trackString.includes(word))
      const hasLowEnergy = lowEnergyWords.some(word => trackString.includes(word))
      
      if (moodAnalysis.energy >= 7 && hasHighEnergy) return true
      if (moodAnalysis.energy <= 3 && hasLowEnergy) return true
      if (moodAnalysis.energy > 3 && moodAnalysis.energy < 7 && !hasHighEnergy && !hasLowEnergy) return true
      
      return Math.random() < 0.3 // 30% chance to include anyway
    })
    
    energyFilteredTracks.slice(0, userTracksTarget).forEach((track: SpotifyTrack) => {
      if (!trackIds.has(track.id)) {
        tracks.push(track)
        trackIds.add(track.id)
      }
    })
    
    // 2. Search for tracks based on mood analysis (30%)
    const searchTracksTarget = Math.floor(targetCount * 0.3)
    const searchPromises = moodAnalysis.searchTerms.slice(0, 3).map(term => 
      spotify.searchTracks(term, 10)
    )
    
    const searchResults = await Promise.all(searchPromises)
    const searchTracks: SpotifyTrack[] = []
    
    searchResults.forEach(result => {
      result.tracks.items.forEach((track: SpotifyTrack) => {
        if (!trackIds.has(track.id)) {
          searchTracks.push(track)
          trackIds.add(track.id)
        }
      })
    })
    
    // Randomly select from search results
    const shuffledSearchTracks = searchTracks.sort(() => Math.random() - 0.5)
    tracks.push(...shuffledSearchTracks.slice(0, searchTracksTarget))
    
    // 3. Add discovery tracks from related artists (30%)
    const discoveryTarget = targetCount - tracks.length
    
    if (topTracks.items.length > 0) {
      // Get unique artist IDs from top tracks
      const artistIds = Array.from(new Set(
        topTracks.items.slice(0, 5).map((track: SpotifyTrack) => track.artists[0].id)
      )).filter((id): id is string => typeof id === 'string')
      
      const relatedArtistsPromises = artistIds.map(id => 
        spotify.getRelatedArtists(id).catch(() => ({ artists: [] }))
      )
      
      const relatedArtistsResults = await Promise.all(relatedArtistsPromises)
      const relatedArtists: any[] = []
      
      relatedArtistsResults.forEach(result => {
        relatedArtists.push(...result.artists.slice(0, 3))
      })
      
      // Get top tracks from related artists
      const relatedTracksPromises = relatedArtists.slice(0, 5).map(artist =>
        spotify.getArtistTopTracks(artist.id).catch(() => ({ tracks: [] }))
      )
      
      const relatedTracksResults = await Promise.all(relatedTracksPromises)
      const discoveryTracks: SpotifyTrack[] = []
      
      relatedTracksResults.forEach(result => {
        result.tracks.forEach((track: SpotifyTrack) => {
          if (!trackIds.has(track.id)) {
            discoveryTracks.push(track)
          }
        })
      })
      
      // Randomly select discovery tracks
      const shuffledDiscoveryTracks = discoveryTracks.sort(() => Math.random() - 0.5)
      tracks.push(...shuffledDiscoveryTracks.slice(0, discoveryTarget))
    }
    
    // Shuffle final playlist
    const finalTracks = tracks.sort(() => Math.random() - 0.5).slice(0, targetCount)
    
    // Create playlist on Spotify
    const playlistName = `${moodAnalysis.primaryMood} vibes - ${new Date().toLocaleDateString()}`
    const playlistDescription = `Generated from: "${prompt.slice(0, 100)}..." | Energy: ${moodAnalysis.energy}/10`
    
    const playlist = await spotify.createPlaylist(
      spotifyUser.id,
      playlistName,
      playlistDescription
    )
    
    // Add tracks to playlist
    const trackUris = finalTracks.map(track => track.uri)
    await spotify.addTracksToPlaylist(playlist.id, trackUris)
    
    // Save to Firestore
    const playlistData = {
      userId: session.user.email,
      spotifyPlaylistId: playlist.id,
      name: playlistName,
      prompt,
      moodAnalysis,
      trackIds: finalTracks.map(t => t.id),
      createdAt: new Date().toISOString(),
    }
    
    const docRef = await addDoc(collection(db, 'playlists'), playlistData)
    
    // Get full playlist data to return
    const fullPlaylist = await spotify.getPlaylist(playlist.id)
    
    return NextResponse.json({
      id: docRef.id,
      ...playlistData,
      ...fullPlaylist,
    })
  } catch (error) {
    console.error('Error generating playlist:', error)
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    )
  }
}