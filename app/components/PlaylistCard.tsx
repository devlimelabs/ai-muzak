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
    createdAt?: string
  }
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
    excited: '🎉',
    focused: '🎯',
    romantic: '💕',
    melancholy: '🌧️',
  }

  const moodColors = {
    happy: 'from-yellow-400 to-orange-400',
    sad: 'from-blue-400 to-indigo-400',
    energetic: 'from-red-400 to-pink-400',
    calm: 'from-blue-300 to-cyan-300',
    angry: 'from-red-500 to-orange-500',
    nostalgic: 'from-purple-400 to-pink-400',
    confident: 'from-green-400 to-emerald-400',
    anxious: 'from-gray-400 to-slate-400',
    excited: 'from-pink-400 to-purple-400',
    focused: 'from-blue-400 to-purple-400',
    romantic: 'from-pink-300 to-rose-300',
    melancholy: 'from-slate-400 to-gray-400',
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const primaryMood = playlist.moodAnalysis?.primaryMood as keyof typeof moodEmoji
  const energy = playlist.moodAnalysis?.energy || 5

  return (
    <div 
      className="card-interactive group p-0 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Album Art / Cover */}
      <div className="aspect-square relative overflow-hidden">
        {!imageError && imageUrl !== '/playlist-placeholder.png' ? (
          <Image
            src={imageUrl}
            alt={playlist.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${
            primaryMood ? moodColors[primaryMood] : 'from-spotify-green to-emerald-500'
          } flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black/20" />
            <svg className="w-20 h-20 text-white/30 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"/>
            </svg>
          </div>
        )}
        
        {/* Play overlay */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Energy indicator */}
        {playlist.moodAnalysis && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-1 rounded-full transition-colors ${
                      i < Math.floor(energy / 2)
                        ? 'bg-spotify-green'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Header with mood */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-lg leading-tight truncate group-hover:text-spotify-green transition-colors">
              {playlist.name}
            </h3>
            {playlist.moodAnalysis && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl animate-bounce-gentle">
                  {moodEmoji[primaryMood] || '🎵'}
                </span>
                <span className={`text-sm font-medium bg-gradient-to-r ${
                  primaryMood ? moodColors[primaryMood] : 'from-spotify-green to-emerald-400'
                } bg-clip-text text-transparent capitalize`}>
                  {primaryMood || 'vibes'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Description/Prompt */}
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
          {playlist.prompt || playlist.description || 'Custom playlist for your mood'}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {playlist.tracks && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                {playlist.tracks.total} tracks
              </span>
            )}
            {playlist.createdAt && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(playlist.createdAt)}
              </span>
            )}
          </div>
          
          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded-full">
            <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}