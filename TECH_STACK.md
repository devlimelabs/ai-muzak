# Technical Stack Deep Dive

## Why These Technologies?

Every choice is optimized for rapid MVP development while maintaining scalability.

### Next.js 14 (App Router)

**Why Next.js over alternatives:**
- Single codebase for frontend + API
- Built-in serverless functions eliminate backend complexity
- App Router provides superior data fetching patterns
- Vercel deployment is literally one command
- Server Components reduce client bundle size

**Key features we'll use:**
- API routes for Spotify OAuth callbacks
- Server Actions for playlist creation
- Streaming SSR for better perceived performance
- Built-in image optimization for album art

### Firebase Suite

**Why Firebase over Supabase:**
- Better free tier limits (50K reads/day vs 50K/month)
- More mature, battle-tested infrastructure
- Superior real-time capabilities
- Integrated auth with better OAuth token handling
- Lower latency globally
- Firebase Functions if we need complex backend logic later

**Firebase services we'll use:**
1. **Firestore**: NoSQL database for user data and playlists
2. **Firebase Auth**: Handle Spotify OAuth and user sessions
3. **Firebase Storage**: Cache album artwork and user avatars
4. **Firebase Analytics**: Track usage patterns (optional for MVP)

### OpenAI API (GPT-3.5-turbo)

**Why GPT-3.5 over GPT-4:**
- 10x cheaper ($0.002 vs $0.02 per request)
- Sub-second response times
- Sufficient for emotional analysis and music matching
- Can upgrade to GPT-4 for premium users later

**Our AI approach:**
- Analyze emotional context from user prompts
- Extract mood, energy, and thematic elements
- Match against user's listening history patterns
- Generate diverse, contextually appropriate playlists

### Tailwind CSS

**Why Tailwind:**
- Rapid prototyping with utility classes
- Built-in dark mode support
- Consistent design system out of the box
- Tree-shaking keeps CSS bundle tiny
- Works perfectly with Next.js

### Spotify Web API + SDK

**Available endpoints (with basic access):**
- User profile and top tracks/artists
- Recently played tracks
- Saved tracks/albums
- Playlist creation and modification
- Search functionality
- Web Playback SDK for in-app player

**Restricted endpoints (need extended access):**
- Audio features (danceability, energy, etc.)
- Recommendations engine
- Track analysis

## Architecture Decisions

### Database Schema (Firestore)

```javascript
// Collections structure
users/{userId}
  - spotifyId: string
  - email: string
  - displayName: string
  - refreshToken: encrypted string
  - lastSync: timestamp
  
playlists/{playlistId}
  - userId: string
  - spotifyPlaylistId: string
  - prompt: string
  - emotionalContext: object
  - tracks: array
  - createdAt: timestamp
  - sharedCount: number
  
sessions/{sessionId}
  - userId: string
  - emotionalAnalysis: object
  - timestamp: timestamp
```

### API Structure

```
/api/auth/spotify/callback - OAuth callback
/api/auth/spotify/refresh - Token refresh
/api/playlists/generate - AI playlist generation
/api/playlists/save - Save to Spotify
/api/user/history - Get listening history
/api/user/analysis - Analyze music taste
```

### Security Considerations

1. **Token Storage**: Encrypt Spotify refresh tokens before storing
2. **API Keys**: All sensitive keys in environment variables
3. **CORS**: Strict origin policies for API routes
4. **Rate Limiting**: Implement per-user limits to prevent abuse
5. **Input Sanitization**: Clean all user prompts before AI processing

## Development Environment

### Required Environment Variables

```env
# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/spotify/callback

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (for server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
ENCRYPTION_KEY= # For token encryption
```

### VS Code Extensions

- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Firebase Explorer
- GitHub Copilot (optional but helpful)

## Performance Optimizations

1. **Static Generation**: Landing page and marketing content
2. **Edge Functions**: API routes that don't need Node.js
3. **Incremental Static Regeneration**: For shared playlists
4. **Image Optimization**: Next.js Image for album art
5. **Code Splitting**: Dynamic imports for Spotify SDK

## Monitoring & Analytics

- **Vercel Analytics**: Core Web Vitals and performance
- **Firebase Performance**: Client-side performance tracking
- **Sentry**: Error tracking (post-MVP)
- **LogRocket**: Session replay for debugging (post-MVP)

## Cost Analysis

### Monthly Costs at Scale

**At 1,000 users:**
- Firebase: $0 (well within free tier)
- OpenAI: ~$20 (10K playlist generations)
- Vercel: $0 (Hobby plan)
- **Total: $20/month**

**At 10,000 users:**
- Firebase: ~$25 (Blaze plan, pay-as-you-go)
- OpenAI: ~$200
- Vercel: $20 (Pro plan)
- **Total: $245/month**

## Future Scaling Considerations

1. **Database**: Firestore scales automatically
2. **Authentication**: Firebase Auth handles millions of users
3. **AI Costs**: Implement caching for similar prompts
4. **API Limits**: Redis for rate limiting at scale
5. **CDN**: Vercel Edge Network included

## Alternative Services Evaluation

### Why not AWS/Azure/GCP?
- Overkill for MVP
- Longer setup time
- More complex pricing
- Less integrated services

### Why not Planetscale/Neon?
- SQL not needed for our use case
- More complex setup than Firestore
- Less real-time capability

### Why not Anthropic Claude API?
- More expensive than GPT-3.5
- Overkill for music recommendations
- Can migrate later if needed
