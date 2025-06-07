# Spotify OAuth with HTTPS Local Development Setup

## Problem
Spotify OAuth doesn't support certain localhost configurations and requires HTTPS for security. The error "Invalid URL" occurs when NextAuth can't construct proper redirect URIs.

## Solution: Use Network IP with HTTPS

### Step 1: Generate Self-Signed SSL Certificate

```bash
# Create certificates directory
mkdir -p certificates

# Generate self-signed certificate
openssl req -x509 -out certificates/localhost.crt -keyout certificates/localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=192.168.1.207' -extensions EXT -config <( \
   printf "[dn]\nCN=192.168.1.207\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:192.168.1.207,IP:192.168.1.207\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### Step 2: Update Next.js to Use HTTPS

Create or update `next.config.js`:

```javascript
import fs from 'fs';
import https from 'https';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
};

// For development with HTTPS
if (process.env.NODE_ENV === 'development') {
  nextConfig.server = {
    https: {
      key: fs.readFileSync('./certificates/localhost.key'),
      cert: fs.readFileSync('./certificates/localhost.crt'),
    },
  };
}

export default nextConfig;
```

### Step 3: Update Environment Variables

Update `.env.local`:

```env
# Use your network IP instead of localhost
NEXTAUTH_URL=https://192.168.1.207:3000
NEXT_PUBLIC_APP_URL=https://192.168.1.207:3000

# Ensure these are set
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

### Step 4: Update Spotify App Settings

1. Go to [Spotify Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Go to Settings
4. Add redirect URI: `https://192.168.1.207:3000/api/auth/callback/spotify`
5. Save changes

### Step 5: Update NextAuth Configuration

Ensure your NextAuth config handles URLs properly:

```typescript
// app/api/auth/[...nextauth]/route.ts or similar
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user-read-email user-read-private playlist-read-private playlist-modify-public playlist-modify-private',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  // Trust the proxy headers
  trustHost: true,
};
```

### Step 6: Custom Server Script (Alternative)

If Next.js config doesn't work, create `server.js`:

```javascript
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Ready on https://192.168.1.207:3000');
  });
});
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "node server.js",
    "dev:next": "next dev"
  }
}
```

### Step 7: Browser Configuration

When you first visit `https://192.168.1.207:3000`, your browser will warn about the self-signed certificate. You need to:

1. Click "Advanced" or similar
2. Click "Proceed to 192.168.1.207 (unsafe)" or similar
3. The browser will remember this exception

### Alternative: Using ngrok

If HTTPS setup is problematic, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js app normally
npm run dev

# In another terminal, tunnel to your app
ngrok http 3000
```

Then use the ngrok HTTPS URL in Spotify settings and environment variables.

### Troubleshooting

1. **"Invalid URL" error**: Ensure NEXTAUTH_URL is set correctly with https://
2. **Certificate errors**: Make sure the certificate is trusted in your browser
3. **Redirect mismatch**: Verify the exact URL in Spotify settings matches your callback
4. **Port conflicts**: Ensure port 3000 is available

### Security Note

This setup is for **local development only**. Never use self-signed certificates in production. For production, use proper SSL certificates from a certificate authority.
