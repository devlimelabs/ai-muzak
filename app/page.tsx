'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  const handleSpotifyLogin = () => {
    signIn('spotify', { callbackUrl: '/dashboard' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6">
            <span className="text-gradient">AI Muzak</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Transform your emotions into perfectly curated playlists. Tell us what you're feeling, 
            and we'll create the soundtrack to your moment.
          </p>

          <div className="grid gap-8 md:grid-cols-3 mb-12 text-left">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 hover:border-spotify-green transition-colors">
              <div className="text-spotify-green text-2xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Career Changes</h3>
              <p className="text-gray-400 text-sm">
                Starting fresh? We'll craft the perfect motivation soundtrack for your new journey.
              </p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 hover:border-spotify-green transition-colors">
              <div className="text-spotify-green text-2xl mb-3">💪</div>
              <h3 className="text-lg font-semibold mb-2">Workout Motivation</h3>
              <p className="text-gray-400 text-sm">
                Need that extra push? Get energized with music that matches your intensity.
              </p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 hover:border-spotify-green transition-colors">
              <div className="text-spotify-green text-2xl mb-3">🌙</div>
              <h3 className="text-lg font-semibold mb-2">Processing Emotions</h3>
              <p className="text-gray-400 text-sm">
                Let music help you through. We understand nuance and create space for healing.
              </p>
            </div>
          </div>

          <button
            onClick={handleSpotifyLogin}
            className="group relative inline-flex items-center gap-3 bg-spotify-green text-black font-bold py-4 px-8 rounded-full text-lg hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-spotify-green/25"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.808-.87 7.076-.496 9.712 1.115.293.18.387.563.208.856zm1.22-2.717c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.518-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.48.707.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.13-1.016.625-1.166 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.282.325z"/>
            </svg>
            Connect with Spotify
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Your music, your emotions, perfectly synchronized.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-spotify-green to-transparent"></div>
    </main>
  )
}