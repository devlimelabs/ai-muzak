# AI Muzak - Emotionally Intelligent Playlist Generator

An AI-powered playlist generator that understands the emotional context and nuance of life moments, creating personalized Spotify playlists based on your story and listening history.

## The Vision

Transform emotional moments into perfectly curated playlists. Whether you're processing a life change, starting a new chapter, or need motivation for a workout after a tough day, AI Muzak understands context beyond simple mood labels.

## Core Features (MVP)

- **Emotional Context Understanding**: Tell your story in natural language
- **Spotify Integration**: Creates and saves playlists directly to your account
- **Listening History Analysis**: Personalizes based on your music taste
- **In-App Playback**: Listen without leaving the experience
- **Share Your Journey**: Save and share playlists with their stories

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: Firebase (Firestore + Auth)
- **AI**: OpenAI GPT-3.5-turbo
- **Music**: Spotify Web API + Web Playback SDK
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in all required values (see setup instructions below)

# Run development server
npm run dev
```

## Setup Instructions

1. **Create a Spotify App:**
   - Go to https://developer.spotify.com/dashboard
   - Create a new app
   - Add `http://127.0.0.1:3000/api/auth/callback/spotify` as a redirect URI
   - Copy your Client ID and Client Secret

2. **Set up Firebase:**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Get your Firebase configuration

3. **Get an OpenAI API Key:**
   - Sign up at https://platform.openai.com
   - Create an API key

4. **Configure environment variables:**
   - Fill in all the required values in `.env.local`
   - Generate a random NEXTAUTH_SECRET: `openssl rand -base64 32`
   - Generate an ENCRYPTION_KEY: `openssl rand -hex 32`

## Project Structure

```
ai-muzak/
├── README.md
├── TECH_STACK.md         # Detailed technical decisions
├── API_STRATEGY.md       # Spotify API workarounds
├── ROADMAP.md           # 30-day launch plan
├── CLAUDE_CODE_PROMPT.md # Prompt to build the app
└── app/                 # Next.js app (to be created)
```

## Critical Deadline

**Apply for Spotify Extended API Access before May 15, 2025** - After this date, approval becomes significantly harder.

## The Story Behind This

This project was born from a real need - the frustration of not being able to communicate life's emotional complexity to music services. After being laid off, I wanted music that understood both the disappointment and the excitement of finally having time to build my AI apps. Current playlist generators just don't get it.

## MVP Target

Ultra-simple launch focusing on:
1. Authentication (Spotify OAuth)
2. Playlist generation from emotional prompts
3. Basic playback

Everything else comes later.

## Contact

Built with 🎵 by John - turning a career transition into a creative opportunity.
