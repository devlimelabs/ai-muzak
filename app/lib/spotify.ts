export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string; id: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  uri: string
  duration_ms: number
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: Array<{ url: string }>
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
}

class SpotifyAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async fetchSpotify(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCurrentUser() {
    return this.fetchSpotify('/me')
  }

  async getTopTracks(limit = 50, timeRange = 'medium_term') {
    return this.fetchSpotify(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`)
  }

  async getTopArtists(limit = 50, timeRange = 'medium_term') {
    return this.fetchSpotify(`/me/top/artists?limit=${limit}&time_range=${timeRange}`)
  }

  async getRecentlyPlayed(limit = 50) {
    return this.fetchSpotify(`/me/player/recently-played?limit=${limit}`)
  }

  async searchTracks(query: string, limit = 20) {
    const encodedQuery = encodeURIComponent(query)
    return this.fetchSpotify(`/search?q=${encodedQuery}&type=track&limit=${limit}`)
  }

  async getRelatedArtists(artistId: string) {
    return this.fetchSpotify(`/artists/${artistId}/related-artists`)
  }

  async getArtistTopTracks(artistId: string, market = 'US') {
    return this.fetchSpotify(`/artists/${artistId}/top-tracks?market=${market}`)
  }

  async createPlaylist(userId: string, name: string, description: string) {
    return this.fetchSpotify(`/users/${userId}/playlists`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    })
  }

  async addTracksToPlaylist(playlistId: string, trackUris: string[]) {
    return this.fetchSpotify(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({
        uris: trackUris,
      }),
    })
  }

  async getPlaylist(playlistId: string) {
    return this.fetchSpotify(`/playlists/${playlistId}`)
  }
}

export default SpotifyAPI