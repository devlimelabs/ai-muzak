# Claude Code Prompt - Build AI Muzak MVP

Use this prompt with Claude Code to build the initial AI Muzak application:

---

## Project: AI Muzak - Emotionally Intelligent Playlist Generator

I need you to build an MVP for AI Muzak, an AI-powered Spotify playlist generator that creates playlists based on emotional context and life moments. The app should understand nuanced emotional states and create personalized playlists combining the user's taste with contextually appropriate music.

### Core Requirements

1. **Authentication**: Spotify OAuth login using NextAuth.js
2. **Playlist Generation**: Accept natural language prompts about life moments/emotions and generate 20-30 track playlists
3. **Playback**: In-app music player using Spotify Web Playback SDK

### Technical Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **Database**: Firebase (Firestore for data, Firebase Auth for users)
- **Styling**: Tailwind CSS with a modern, minimal design
- **AI**: OpenAI GPT-3.5-turbo for emotional analysis
- **Deployment**: Optimized for Vercel

### Key Features to Implement

1. **Landing Page** (`app/page.tsx`)
   - Hero section explaining the concept
   - Example use cases (career change, workout motivation, processing emotions)
   - Spotify login button
   - Modern gradient design with music-themed animations

2. **Authentication Flow** (`app/api/auth/[...nextauth]/route.ts`)
   - Spotify OAuth with NextAuth.js
   - Store refresh tokens encrypted in Firestore
   - Permissions: user-read-private, user-read-email, user-top-read, user-read-recently-played, playlist-modify-public, playlist-modify-private, streaming, user-library-read

3. **Dashboard** (`app/dashboard/page.tsx`)
   - Prompt input with placeholder: "Tell me what's on your mind..."
   - Recent playlists grid
   - User's music taste summary
   - Clean, focused interface

4. **Playlist Generation** (`app/api/playlists/generate/route.ts`)
   - Accept emotional context prompt
   - Fetch user's top tracks, artists, and recent plays
   - Use GPT-3.5 to analyze emotional context and extract:
     - Mood (happy, sad, energetic, calm, etc.)
     - Energy level (1-10)
     - Genre preferences for this context
     - Tempo preference
   - Generate playlist using available Spotify APIs:
     - 40% from user's top tracks matching mood
     - 30% from searches based on preferred genres/moods
     - 30% discovery tracks from related artists
   - Save playlist to user's Spotify account

5. **Playback Interface** (`app/components/Player.tsx`)
   - Spotify Web Playback SDK integration
   - Minimal player: play/pause, skip, track info, progress bar
   - Auto-play generated playlists
   - Mobile-responsive design

6. **Database Schema** (Firestore)
```
users/{userId}
  - spotifyId: string
  - email: string
  - displayName: string
  - refreshToken: string (encrypted)
  - topGenres: string[]
  - lastSync: timestamp

playlists/{playlistId}
  - userId: string
  - spotifyPlaylistId: string
  - prompt: string
  - moodAnalysis: {
      primaryMood: string
      energy: number
      genres: string[]
    }
  - trackIds: string[]
  - createdAt: timestamp
```

### Environment Variables Structure

```env
# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI
OPENAI_API_KEY=

# Encryption
ENCRYPTION_KEY=
```

### UI/UX Guidelines

- Dark mode by default with option to switch
- Spotify green (#1DB954) as accent color
- Smooth transitions and loading states
- Mobile-first responsive design
- Accessibility: proper ARIA labels, keyboard navigation

### Working Around Spotify Limitations

Since we don't have access to Audio Features or Recommendations API:
1. Use track/artist names and genres for mood matching
2. Leverage user's listening history heavily
3. Use GPT to understand context and suggest search queries
4. Build our own simple recommendation logic

### File Structure

```
ai-muzak/
├── app/
│   ├── page.tsx (landing page)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── playlists/
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   └── save/
│   │   │       └── route.ts
│   │   └── user/
│   │       └── sync/
│   │           └── route.ts
│   ├── components/
│   │   ├── Player.tsx
│   │   ├── PromptInput.tsx
│   │   ├── PlaylistCard.tsx
│   │   └── Navigation.tsx
│   └── lib/
│       ├── spotify.ts
│       ├── firebase.ts
│       ├── openai.ts
│       └── encryption.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local
```

### Initial Implementation Priority

1. Set up Next.js project with TypeScript and Tailwind
2. Configure Firebase and create security rules
3. Implement Spotify OAuth
4. Create dashboard UI with prompt input
5. Build playlist generation logic
6. Add Spotify Web Playback SDK
7. Implement playlist saving and history

### Example Prompts to Test

1. "Today I was laid off, while disappointing and unexpected at the end of the day I have been trying to get my ai apps businesses going, and now I can spend the next few weeks 100% focused on it. I need some music to process this event and motivate me for this workout I'm doing to reset my body for the start of a new chapter tomorrow."

2. "It's 3am and I can't sleep. My mind is racing with ideas for my startup but also anxiety about making it work. Need something to calm my thoughts without putting me to sleep."

3. "Just closed my first major client! Feeling on top of the world and need music to match this energy while I celebrate with my team."

### Important Notes

- Keep the MVP simple - just auth, generate, and play
- Ensure mobile responsiveness from the start
- Handle Spotify API rate limits gracefully
- Show clear loading states during playlist generation
- Save user preferences to reduce API calls
- Use Firebase security rules to protect user data

### Success Criteria

- User can log in with Spotify
- User can describe their emotional state
- App generates a contextually appropriate playlist in <5 seconds
- Playlist saves to user's Spotify account
- Music plays directly in the app
- Works on mobile devices

Start by creating the Next.js project structure and setting up the authentication flow. Focus on getting a working MVP rather than perfect code - we can refine later.

---

End of prompt. Copy everything above and use with Claude Code to start building AI Muzak.
