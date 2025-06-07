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

  const initializePlayer = useCallback(() => {
    if (!window.Spotify || !session?.accessToken) return

    const spotifyPlayer = new window.Spotify.Player({
      name: 'AI Muzak Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(session.accessToken!)
      },
      volume: 0.5,
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
  }, [session?.accessToken])

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

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!currentTrack || !isReady) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
      <div className="container mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          {currentTrack.album.images[0] && (
            <Image
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              width={56}
              height={56}
              className="rounded"
            />
          )}
          <div className="min-w-0">
            <p className="font-semibold truncate">{currentTrack.name}</p>
            <p className="text-sm text-gray-400 truncate">
              {currentTrack.artists.map((a: any) => a.name).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={skipToPrevious}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Previous track"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button
              onClick={togglePlay}
              className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? (
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={skipToNext}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Next track"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{formatTime(position)}</span>
            <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white"
                style={{ width: `${(position / duration) * 100}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  )
}