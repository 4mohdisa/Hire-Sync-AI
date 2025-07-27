# Production Deployment Guide - Hire Sync AI

## 🚨 Current Issues & Fixes

### 1. Clerk Production Keys (CRITICAL)
**Error:** `Clerk has been loaded with development keys`

**Fix Required:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a **Production** instance (not Development)
3. Get production keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)
   - `CLERK_WEBHOOK_SECRET` (new webhook secret for production)

### 2. Vercel Environment Variables Setup

**Required Environment Variables for Vercel:**

```bash
# Database (Use production PostgreSQL - Railway/Supabase/Neon)
DATABASE_URL=postgres://user:password@host:port/database

# Or individual DB components:
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=your_production_db_name

# Clerk (PRODUCTION KEYS)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret
CLERK_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# File Storage
UPLOADTHING_TOKEN=your_uploadthing_token

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# Server
SERVER_URL=https://hire-sync-ai.vercel.app

# Inngest (Production)
INNGEST_CLIENT_ID=hire-sync-ai
INNGEST_SIGNING_KEY=your_production_inngest_signing_key
INNGEST_EVENT_KEY=your_production_inngest_event_key
```

### 3. Database Setup for Production

**Options:**
- **Railway**: Easy PostgreSQL hosting
- **Supabase**: Free tier available
- **Neon**: Serverless PostgreSQL
- **Vercel Postgres**: Native integration

**Steps:**
1. Create production database
2. Get connection URL
3. Run database migrations: `npm run db:push`
4. Update `DATABASE_URL` in Vercel

### 4. Clerk Webhook Configuration

**Important:** Update Clerk webhook URL to:
```
https://hire-sync-ai.vercel.app/api/clerk/webhooks
```

### 5. Inngest Production Setup

1. Go to [Inngest Dashboard](https://app.inngest.com)
2. Create production environment
3. Get production signing key and event key
4. Update Inngest webhook URL to: `https://hire-sync-ai.vercel.app/api/inngest`

## 🔧 Immediate Action Steps

### Step 1: Set Vercel Environment Variables
```bash
# In Vercel dashboard, go to:
# Project Settings → Environment Variables

# Add all variables from the list above
# Make sure to use PRODUCTION values, not development
```

### Step 2: Update Clerk Production Instance
```bash
# 1. Create production Clerk instance
# 2. Update webhook URL to: https://hire-sync-ai.vercel.app/api/clerk/webhooks
# 3. Copy production keys to Vercel
```

### Step 3: Database Migration
```bash
# After setting up production database:
npm run db:push
# This will create all tables in production
```

### Step 4: Test Production Deployment
```bash
# Check these URLs after deployment:
# https://hire-sync-ai.vercel.app - Should load without errors
# https://hire-sync-ai.vercel.app/api/clerk/webhooks - Should return 405 Method Not Allowed
# https://hire-sync-ai.vercel.app/api/inngest - Should return Inngest response
```

## 🚨 Critical Notes

1. **Never use development keys in production**
2. **Database must be accessible from Vercel**
3. **All webhook URLs must use HTTPS production URLs**
4. **Environment variables are case-sensitive**
5. **Redeploy after setting environment variables**

## 🔍 Debugging Production Issues

### Check Vercel Function Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Check logs for errors

### Common Production Errors:
- Missing environment variables
- Database connection failures
- Invalid API keys
- Webhook URL mismatches
- CORS issues

## 📋 Deployment Checklist

- [ ] Production Clerk instance created
- [ ] Production database set up
- [ ] All environment variables set in Vercel
- [ ] Webhook URLs updated to production
- [ ] Database schema pushed to production
- [ ] Test user registration/login
- [ ] Test job posting functionality
- [ ] Test file uploads
- [ ] Test AI resume processing
- [ ] Monitor error logs

## 🆘 If Still Getting Errors

1. Check Vercel function logs for specific errors
2. Verify all environment variables are set
3. Test database connection
4. Verify Clerk webhook delivery
5. Check Inngest sync status

The server-side error (Digest: 265885447) indicates environment/database issues. Fix environment variables first, then database connection.