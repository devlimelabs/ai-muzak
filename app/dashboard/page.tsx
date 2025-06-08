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
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.accessToken && isFirstLoad) {
      fetchUserData()
      setIsFirstLoad(false)
    }
  }, [session, isFirstLoad])

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
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spotify-green/20 border-t-spotify-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-body-lg text-gray-300">Tuning your experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navigation />
      
      <main className="container mx-auto px-6 py-12 max-w-7xl pb-32">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="animate-fade-in">
            <h1 className="text-h1 mb-4 text-gradient-primary">
              Welcome back, {session?.user?.name || 'Music Lover'}
            </h1>
            
            {userGenres.length > 0 && (
              <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up animation-delay-200">
                <span className="text-body-lg text-gray-300">Your sonic DNA:</span>
                <div className="flex gap-2">
                  {userGenres.slice(0, 4).map((genre, index) => (
                    <span 
                      key={genre}
                      className="px-3 py-1 bg-muzak-electric-blue/20 text-muzak-electric-blue border border-muzak-electric-blue/30 rounded-full text-sm font-medium animate-slide-in-right"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-body-lg text-gray-400 max-w-2xl mx-auto animate-slide-up animation-delay-300">
              Ready to discover your next favorite playlist? Tell us what's on your mind, and we'll create the perfect soundtrack for your moment.
            </p>
          </div>
        </div>

        {/* Prompt Input Section */}
        <div className="mb-16 animate-slide-up animation-delay-300">
          <PromptInput onSubmit={handleGeneratePlaylist} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center gap-4 px-8 py-6 bg-muzak-rich-black/80 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <div className="relative">
                <div className="w-8 h-8 border-3 border-spotify-green/20 border-t-spotify-green rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-r-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div>
                <p className="text-white font-medium">Creating your playlist...</p>
                <p className="text-gray-400 text-sm">Analyzing your mood and curating the perfect tracks</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Playlists */}
        {recentPlaylists.length > 0 && !isLoading && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-h2 text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-spotify-green to-emerald-400 rounded-full"></span>
                Recent Creations
              </h2>
              <p className="text-gray-400 text-sm">
                {recentPlaylists.length} playlist{recentPlaylists.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPlaylists.map((playlist: any, index: number) => (
                <div 
                  key={playlist.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setCurrentPlaylistUri(`spotify:playlist:${playlist.spotifyPlaylistId}`)}
                >
                  <PlaylistCard playlist={playlist} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {recentPlaylists.length === 0 && !isLoading && (
          <div className="text-center py-20 animate-fade-in">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-muzak-electric-blue to-muzak-purple rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              
              <h3 className="text-h3 text-white mb-4">Your musical journey begins here</h3>
              <p className="text-body-lg text-gray-300 mb-8 max-w-lg mx-auto">
                Share what's on your mind, and we'll create the perfect playlist to match your vibe.
              </p>
              
              <div className="grid gap-3 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 text-left px-6 py-4 bg-muzak-warm-gray/30 rounded-xl border border-gray-700/30">
                  <span className="text-2xl">🎉</span>
                  <span className="text-gray-300">"I just got promoted and want to celebrate!"</span>
                </div>
                <div className="flex items-center gap-3 text-left px-6 py-4 bg-muzak-warm-gray/30 rounded-xl border border-gray-700/30">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-300">"Need focus music for deep work"</span>
                </div>
                <div className="flex items-center gap-3 text-left px-6 py-4 bg-muzak-warm-gray/30 rounded-xl border border-gray-700/30">
                  <span className="text-2xl">💭</span>
                  <span className="text-gray-300">"Feeling nostalgic about college days"</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Player playlistUri={currentPlaylistUri} />
    </div>
  )
}