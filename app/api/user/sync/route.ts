import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import SpotifyAPI from '@/app/lib/spotify'
import { db, isFirebaseConfigured } from '@/app/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.accessToken || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const spotify = new SpotifyAPI(session.accessToken)
    
    // Fetch user's top artists to extract genres
    const topArtists = await spotify.getTopArtists(50)
    
    // Extract and count genres
    const genreCount: Record<string, number> = {}
    topArtists.items.forEach((artist: any) => {
      artist.genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    })
    
    // Sort genres by frequency and get top genres
    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([genre]) => genre)
    
    // Get Spotify user data
    const spotifyUser = await spotify.getCurrentUser()
    
    // Prepare user data
    const userData = {
      spotifyId: spotifyUser.id,
      email: session.user.email,
      displayName: spotifyUser.display_name || session.user.name,
      topGenres,
      lastSync: new Date().toISOString(),
    }
    
    // Save to Firestore if configured
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'users', session.user.email), userData, { merge: true })
    } else {
      console.warn('Firebase not configured - user data not persisted')
    }
    
    return NextResponse.json({ topGenres, user: userData })
  } catch (error) {
    console.error('Error syncing user data:', error)
    return NextResponse.json(
      { error: 'Failed to sync user data' },
      { status: 500 }
    )
  }
}