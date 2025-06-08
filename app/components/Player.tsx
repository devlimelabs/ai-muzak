'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}

interface PlayerProps {
  playlistUri?: string
}

export default function Player({ playlistUri }: PlayerProps) {
  const { data: session } = useSession()
  const [player, setPlayer] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isExpanded, setIsExpanded] = useState(false)

  const initializePlayer = useCallback(() => {
    if (!window.Spotify || !session?.accessToken) return

    const spotifyPlayer = new window.Spotify.Player({
      name: 'AI Muzak Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(session.accessToken!)
      },
      volume: volume,
    })

    spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id)
      setIsReady(true)
      
      // Transfer playback to this device
      if (session?.accessToken) {
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        })
      }
    })

    spotifyPlayer.addListener('player_state_changed', (state: any) => {
      if (!state) return
      
      setCurrentTrack(state.track_window.current_track)
      setIsPaused(state.paused)
      setPosition(state.position)
      setDuration(state.duration)
    })

    spotifyPlayer.connect()
    setPlayer(spotifyPlayer)

    return () => {
      spotifyPlayer.disconnect()
    }
  }, [session?.accessToken, volume])

  useEffect(() => {
    if (!window.Spotify) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)

      window.onSpotifyWebPlaybackSDKReady = () => {
        initializePlayer()
      }
    } else {
      initializePlayer()
    }
  }, [initializePlayer])

  useEffect(() => {
    if (playlistUri && isReady && session?.accessToken) {
      // Play the playlist
      fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context_uri: playlistUri,
        }),
      })
    }
  }, [playlistUri, isReady, session?.accessToken])

  const togglePlay = () => {
    if (!player) return
    player.togglePlay()
  }

  const skipToNext = () => {
    if (!player) return
    player.nextTrack()
  }

  const skipToPrevious = () => {
    if (!player) return
    player.previousTrack()
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (player) {
      player.setVolume(newVolume)
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0

  if (!currentTrack || !isReady) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="glassmorphism border-t border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative group">
                {currentTrack.album.images[0] && (
                  <Image
                    src={currentTrack.album.images[0].url}
                    alt={currentTrack.album.name}
                    width={64}
                    height={64}
                    className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
              
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white truncate text-body-lg leading-tight">
                  {currentTrack.name}
                </h4>
                <p className="text-gray-300 truncate text-sm">
                  {currentTrack.artists.map((a: any) => a.name).join(', ')}
                </p>
                <p className="text-gray-400 truncate text-xs">
                  {currentTrack.album.name}
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-6">
                <button
                  onClick={skipToPrevious}
                  className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform duration-150"
                  aria-label="Previous track"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>
                
                <button
                  onClick={togglePlay}
                  className="bg-white rounded-full p-3 hover:scale-110 transition-all duration-150 shadow-lg hover:shadow-xl"
                  aria-label={isPaused ? 'Play' : 'Pause'}
                >
                  {isPaused ? (
                    <svg className="w-7 h-7 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={skipToNext}
                  className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform duration-150"
                  aria-label="Next track"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-96 max-w-full">
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatTime(position)}
                </span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden group cursor-pointer">
                  <div 
                    className="h-full bg-gradient-to-r from-spotify-green to-emerald-400 rounded-full transition-all duration-100 group-hover:h-1.5"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume & Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 group">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}