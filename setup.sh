#!/bin/bash

# AI Muzak - Quick Setup Script

echo "🎵 Setting up AI Muzak..."

# Create Next.js app with TypeScript
echo "📦 Creating Next.js project..."
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install dependencies
echo "📚 Installing dependencies..."
npm install next-auth firebase firebase-admin openai
npm install @spotify/web-playback-sdk
npm install --save-dev @types/spotify-web-playback-sdk

# Create environment file
echo "🔐 Creating .env.local file..."
cat > .env.local << EOL
# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# OpenAI
OPENAI_API_KEY=

# Encryption
ENCRYPTION_KEY=$(openssl rand -base64 32)

# App
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
EOL

# Create lib directory
echo "📁 Creating project structure..."
mkdir -p app/api/auth/\[...nextauth\]
mkdir -p app/api/playlists/generate
mkdir -p app/api/playlists/save
mkdir -p app/api/user/sync
mkdir -p app/dashboard
mkdir -p app/components
mkdir -p app/lib

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Fill in your environment variables in .env.local"
echo "2. Create a Spotify app at https://developer.spotify.com/dashboard"
echo "3. Create a Firebase project at https://console.firebase.google.com"
echo "4. Get your OpenAI API key at https://platform.openai.com"
echo "5. Run 'npm run dev' to start developing!"
echo ""
echo "🚀 Ready to build AI Muzak!"
