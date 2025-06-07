import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Muzak - Emotionally Intelligent Playlists',
  description: 'Generate personalized Spotify playlists based on your emotional state and life moments',
}

import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-spotify-black text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}