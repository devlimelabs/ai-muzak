export { auth as middleware } from '@/app/lib/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/api/playlists/:path*', '/api/user/:path*'],
}