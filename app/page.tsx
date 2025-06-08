'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      emoji: '🎯',
      title: 'Career Moments',
      description: 'From promotions to new beginnings, we create soundtracks for your professional milestones.',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      emoji: '💪',
      title: 'Workout Energy',
      description: 'Unleash your potential with beats that match your intensity and drive.',
      color: 'from-red-400 to-pink-400'
    },
    {
      emoji: '🌙',
      title: 'Emotional Journey',
      description: 'Navigate your feelings with music that understands and supports your emotional state.',
      color: 'from-blue-400 to-purple-400'
    },
    {
      emoji: '💭',
      title: 'Memory Lane',
      description: 'Relive cherished moments with nostalgic playlists that transport you back in time.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      emoji: '🎉',
      title: 'Celebrations',
      description: 'Mark life\'s victories with uplifting music that amplifies your joy.',
      color: 'from-green-400 to-emerald-400'
    },
    {
      emoji: '🧘',
      title: 'Focus & Flow',
      description: 'Enter your zone with carefully curated tracks that enhance concentration.',
      color: 'from-cyan-400 to-blue-400'
    }
  ]

  useEffect(() => {
    setIsAnimated(true)
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const handleSpotifyLogin = () => {
    signIn('spotify', { callbackUrl: '/dashboard' })
  }

  return (
    <main className="min-h-screen gradient-hero overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-spotify-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-muzak-electric-blue/5 rounded-full blur-3xl animate-pulse-slow animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-muzak-purple/3 rounded-full blur-3xl animate-pulse-slow animation-delay-300"></div>
      </div>
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-emerald-400 rounded-2xl flex items-center justify-center animate-bounce-gentle">
                <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.808-.87 7.076-.496 9.712 1.115.293.18.387.563.208.856z"/>
                </svg>
              </div>
              <h1 className="text-hero font-bold text-gradient-primary animate-slide-up animation-delay-100">
                AI Muzak
              </h1>
            </div>
            
            <p className="text-h3 text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              Transform your emotions into perfectly curated playlists
            </p>
            
            <p className="text-body-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up animation-delay-300">
              Tell us what you're feeling, and we'll create the soundtrack to your moment using AI and your unique music taste.
            </p>
          </div>

          {/* Features Showcase */}
          <div className="mb-16 animate-slide-up animation-delay-300">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`card p-8 hover:scale-105 transition-all duration-300 group ${
                    currentFeature === index ? 'ring-2 ring-spotify-green/50' : ''
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{feature.emoji}</span>
                  </div>
                  <h3 className="text-h3 text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="animate-slide-up animation-delay-300">
            <div className="mb-8">
              <button
                onClick={handleSpotifyLogin}
                className="group relative inline-flex items-center gap-4 bg-spotify-green text-black font-bold py-6 px-10 rounded-2xl text-body-lg hover:scale-105 transition-all duration-300 hover:shadow-glow-lg"
              >
                <svg className="w-8 h-8 group-hover:animate-wave" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.808-.87 7.076-.496 9.712 1.115.293.18.387.563.208.856zm1.22-2.717c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.518-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.48.707.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.13-1.016.625-1.166 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.282.325z"/>
                </svg>
                Connect with Spotify
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Secure OAuth
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                No Spotify Premium Required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Free to Use
              </div>
            </div>
            
            <p className="mt-6 text-gray-500 max-w-md mx-auto">
              Your music preferences and emotional state, intelligently synchronized for the perfect listening experience.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-spotify-green/50 to-transparent"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-spotify-green rounded-full animate-ping animation-delay-100"></div>
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-muzak-electric-blue rounded-full animate-ping animation-delay-200"></div>
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-muzak-purple rounded-full animate-ping animation-delay-300"></div>
    </main>
  )
}