'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PlaylistCardProps {
  playlist: {
    id: string
    name: string
    description: string
    images?: Array<{ url: string }>
    tracks?: { total: number }
    prompt?: string
    moodAnalysis?: {
      primaryMood: string
      energy: number
    }
  }
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = playlist.images?.[0]?.url || '/playlist-placeholder.png'
  
  const moodEmoji = {
    happy: '😊',
    sad: '😢',
    energetic: '⚡',
    calm: '🌊',
    angry: '🔥',
    nostalgic: '💭',
    confident: '💪',
    anxious: '😰',
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors group cursor-pointer">
      <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
        {!imageError && imageUrl !== '/playlist-placeholder.png' ? (
          <Image
            src={imageUrl}
            alt={playlist.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-spotify-green to-green-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"/>
            </svg>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
      
      {playlist.moodAnalysis && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">
            {moodEmoji[(playlist.moodAnalysis?.primaryMood as keyof typeof moodEmoji) || 'calm']}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">Energy:</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-3 rounded-full ${
                    i < Math.floor((playlist.moodAnalysis?.energy || 5) / 2)
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-400 line-clamp-2">
        {playlist.prompt || playlist.description || 'Custom playlist'}
      </p>
      
      {playlist.tracks && (
        <p className="text-xs text-gray-500 mt-2">
          {playlist.tracks.total} tracks
        </p>
      )}
    </div>
  )
}