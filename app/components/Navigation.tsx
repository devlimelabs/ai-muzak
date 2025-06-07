'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-800 bg-spotify-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-gradient">
          AI Muzak
        </Link>
        
        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <span className="text-gray-400 text-sm hidden sm:inline">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}