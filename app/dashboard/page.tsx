'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PromptInput from '@/app/components/PromptInput'
import PlaylistCard from '@/app/components/PlaylistCard'
import Navigation from '@/app/components/Navigation'
import Player from '@/app/components/Player'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentPlaylists, setRecentPlaylists] = useState<any[]>([])
  const [userGenres, setUserGenres] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlaylistUri, setCurrentPlaylistUri] = useState<string | undefined>()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
      })
      const data = await response.json()
      setUserGenres(data.topGenres || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleGeneratePlaylist = async (prompt: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/playlists/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      
      if (!response.ok) throw new Error('Failed to generate playlist')
      
      const playlist = await response.json()
      setRecentPlaylists(prev => [playlist, ...prev].slice(0, 6))
      setCurrentPlaylistUri(`spotify:playlist:${playlist.spotifyPlaylistId}`)
    } catch (error) {
      console.error('Error generating playlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <div className="animate-pulse text-spotify-green">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-spotify-black">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {session?.user?.name || 'Music Lover'}
          </h1>
          {userGenres.length > 0 && (
            <p className="text-gray-400">
              Your vibe: {userGenres.slice(0, 3).join(', ')}
            </p>
          )}
        </div>

        <div className="mb-12">
          <PromptInput onSubmit={handleGeneratePlaylist} isLoading={isLoading} />
        </div>

        {recentPlaylists.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Recent Playlists</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentPlaylists.map((playlist: any) => (
                <div 
                  key={playlist.id} 
                  onClick={() => setCurrentPlaylistUri(`spotify:playlist:${playlist.spotifyPlaylistId}`)}
                >
                  <PlaylistCard playlist={playlist} />
                </div>
              ))}
            </div>
          </section>
        )}

        {recentPlaylists.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">
              No playlists yet. Share what's on your mind to get started!
            </p>
            <p className="text-gray-500">
              Try: "I just got promoted and want to celebrate!" or "Need focus music for deep work"
            </p>
          </div>
        )}
      </main>
      
      <Player playlistUri={currentPlaylistUri} />
    </div>
  )
}