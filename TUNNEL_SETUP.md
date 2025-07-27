# Tunnel Setup Guide - Hire Sync AI

## Running Cloudflare Tunnel Manually

### Start New Tunnel
```bash
# Kill any existing tunnels
pkill -f cloudflared

# Start new tunnel and save URL
cloudflared tunnel --url http://localhost:3000
```

### Extract Tunnel URL
The tunnel will show output like:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://your-unique-url.trycloudflare.com                                                |
+--------------------------------------------------------------------------------------------+
```

### Update Clerk Webhook URL
1. Copy the tunnel URL from terminal output
2. Go to [Clerk Dashboard](https://dashboard.clerk.com)
3. Navigate to: Your Project → Webhooks
4. Update endpoint URL to: `https://your-unique-url.trycloudflare.com/api/clerk/webhooks`

## Team Development Solutions

### Option 1: Localhost Development (Recommended for Teams)

**For team development, use localhost instead of tunnels:**

1. **Update Clerk Webhook URL to:**
   ```
   http://localhost:3000/api/clerk/webhooks
   ```

2. **Each team member runs:**
   ```bash
   npm run dev  # Starts Next.js on localhost:3000
   ```

3. **Benefits:**
   - No tunnel setup required
   - Same URL for all team members
   - Faster development
   - No external dependencies

**Note:** This works because Clerk can deliver webhooks to localhost during development.

### Option 2: Shared Development Environment

**Use a shared tunnel for the whole team:**

1. **One person starts a tunnel and shares the URL**
2. **Everyone uses the same webhook URL in Clerk**
3. **All webhook events go to one person's machine**

### Option 3: Individual Tunnels (Advanced)

**Each team member has their own tunnel:**

1. **Each person runs their own tunnel**
2. **Each person creates their own Clerk development project**
3. **Each person configures their own webhook URL**

## Recommended Team Workflow

### Setup for Class/Team Development

1. **Use Localhost Webhooks (Easiest):**
   ```bash
   # Each team member runs this
   npm run dev
   
   # Set Clerk webhook URL to:
   # http://localhost:3000/api/clerk/webhooks
   ```

2. **Share Environment Variables:**
   ```bash
   # Create team .env file with shared credentials
   cp .env.example .env
   # Fill in shared API keys
   ```

3. **Use Shared Database:**
   ```bash
   # Option A: Shared PostgreSQL (Railway/Supabase)
   DATABASE_URL=postgres://shared-db-url
   
   # Option B: Each person runs their own local database
   docker compose up -d
   npm run db:push
   ```

## Quick Start Commands

### For Individual Development
```bash
# Start tunnel
cloudflared tunnel --url http://localhost:3000

# Copy the URL and update Clerk webhook
# Then start development
npm run dev
```

### For Team Development (Recommended)
```bash
# No tunnel needed - use localhost
npm run dev

# Set Clerk webhook URL to: http://localhost:3000/api/clerk/webhooks
```

## Environment Variables for Teams

### Shared Development Environment
```bash
# Use same API keys for all team members
ANTHROPIC_API_KEY=shared_key
CLERK_SECRET_KEY=shared_key
CLERK_WEBHOOK_SECRET=shared_secret
RESEND_API_KEY=shared_key
UPLOADTHING_TOKEN=shared_token

# Use shared database
DATABASE_URL=postgres://shared-db-url

# Each person uses localhost
SERVER_URL=http://localhost:3000
```

### Individual Development Environment
```bash
# Each person has their own Clerk project
CLERK_SECRET_KEY=individual_key
CLERK_WEBHOOK_SECRET=individual_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=individual_key

# Each person runs their own database
DATABASE_URL=postgres://localhost:5432/hiresyncai

# Each person has their own tunnel URL
SERVER_URL=https://their-unique-tunnel.trycloudflare.com
```

## Troubleshooting

### Tunnel Issues
```bash
# If tunnel stops working
pkill -f cloudflared
cloudflared tunnel --url http://localhost:3000

# Update Clerk webhook URL with new tunnel URL
```

### Team Synchronization
```bash
# If webhooks not working for team members
# 1. Verify everyone is using the same Clerk webhook URL
# 2. Check that the tunnel owner's computer is running
# 3. Consider switching to localhost development
```

## Best Practices for Team Development

1. **Use localhost for development** (no tunnels needed)
2. **Share API keys** in team chat or shared doc
3. **Use shared database** for consistent data
4. **Document any environment changes** in team chat
5. **Test webhooks** after any URL changes

This approach eliminates tunnel complexity for team development while maintaining full functionality.