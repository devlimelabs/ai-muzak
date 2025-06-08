'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <nav className="glassmorphism sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-spotify-green to-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg 
                className="w-5 h-5 text-black" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.808-.87 7.076-.496 9.712 1.115.293.18.387.563.208.856zm1.22-2.717c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.518-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.48.707.256 1.072z"/>
              </svg>
            </div>
            <span className="text-h3 font-bold text-gradient-primary">
              AI Muzak
            </span>
          </Link>
        
          <div className="flex items-center gap-6">
            {session?.user && (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      Welcome back
                    </p>
                    <p className="text-xs text-gray-400">
                      {session.user.name || session.user.email}
                    </p>
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-br from-muzak-electric-blue to-muzak-purple rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="md:hidden w-10 h-10 bg-gradient-to-br from-muzak-electric-blue to-muzak-purple rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <span className="text-sm font-semibold text-white">
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-12 bg-muzak-rich-black border border-gray-700 rounded-xl shadow-lg p-4 min-w-48 animate-scale-in">
                      <div className="mb-3 pb-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">
                          {session.user.name || 'Music Lover'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {session.user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group"
                >
                  <svg 
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}