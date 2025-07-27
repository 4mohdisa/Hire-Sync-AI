# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hire Sync AI is a completely free job board platform built with Next.js 15, featuring AI-powered job matching, resume analysis, and automated hiring workflows. The platform was recently converted from a paid/freemium model to completely free with unlimited features.

## Development Commands

### Database Operations
```bash
docker compose up -d              # Start PostgreSQL database
npm run db:push                   # Push schema changes to database (development)
npm run db:generate               # Generate migrations
npm run db:migrate                # Run migrations (production)
npm run db:studio                 # Open Drizzle Studio at localhost:4983
```

### Development Servers
```bash
npm run dev                       # Next.js dev server with Turbopack
npm run inngest                   # Inngest dev server (webhook processing)
npm run email                     # Email dev server at localhost:3001
```

### Build & Deploy
```bash
npm run lint                      # ESLint check
npm run build                     # Production build
npm start                        # Start production server
```

## Architecture Overview

### Core Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: PostgreSQL with Drizzle ORM (no migrations - schema push only)
- **Authentication**: Clerk with organization support
- **Background Jobs**: Inngest workflow engine with webhook automation
- **AI Services**: Anthropic Claude for resume analysis and job matching
- **File Storage**: UploadThing for resume/document handling
- **Email**: Resend for transactional emails
- **Styling**: Tailwind CSS 4 with shadcn/ui components (light theme only)

### Key Architectural Patterns

#### Feature-Based Organization
```
src/features/
├── jobListings/        # Job posting, search, management
├── organizations/      # Company/employer management
├── users/             # User profiles and settings
└── jobListingApplications/  # Application tracking
```

Each feature follows the pattern:
- `actions/` - Server actions with Zod validation
- `components/` - React components
- `db/` - Database queries and cache tags
- `lib/` - Feature-specific utilities

#### Hybrid Webhook Architecture
The platform uses a hybrid approach for optimal performance and simplicity:

**Direct Clerk Webhooks** (Simple CRUD operations):
- `user.created`, `user.updated`, `user.deleted` - Direct database sync
- `organization.created`, `organization.updated`, `organization.deleted` - Immediate processing
- `organizationMembership.created`, `organizationMembership.deleted` - Direct settings management
- Endpoint: `/api/clerk/webhooks` - No tunnel required for development

**Inngest for Complex Processing**:
- `app/resume.uploaded` - Resume upload → AI analysis
- `app/jobListingApplication.created` - Application → AI ranking
- Daily email notifications and cron jobs
- Endpoint: `/api/inngest` - Only for AI/background tasks

#### Database Schema Key Points
- All foreign keys use `onDelete: "cascade"` for proper user/org deletion
- No plan/payment related fields (completely free platform)
- Schema changes use `npm run db:push` (no migrations in development)

### Multi-Tenant Organization Structure
- Users can belong to multiple organizations
- Organizations have role-based permissions via Clerk
- Job listings and applications are scoped to organizations
- User settings are per-organization (organizationUserSettings)

## Environment Configuration

### Required Environment Variables
```bash
# Database (Docker)
DB_USER=postgres
DB_PASSWORD=password  
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hiresyncai

# Clerk Authentication
CLERK_WEBHOOK_SECRET=whsec_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Services
ANTHROPIC_API_KEY=sk-ant-api03-...
UPLOADTHING_TOKEN=eyJhcGlLZXk...
RESEND_API_KEY=re_...

# Inngest (varies by environment)
INNGEST_CLIENT_ID=hire-sync-ai
INNGEST_SIGNING_KEY=signkey-...
INNGEST_EVENT_KEY=...
INNGEST_DEV_SERVER_URL=http://localhost:3000/api/inngest
```

### Environment Validation
Environment variables are validated using `@t3-oss/env-nextjs` in:
- `src/data/env/server.ts` - Server-side variables
- `src/data/env/client.ts` - Client-side variables

## Critical Development Context

### Payment System Removal
**Important**: All plan/payment logic has been removed. The following always return true/unlimited:
- `src/services/clerk/lib/planFeatures.ts` - Feature access
- `src/features/jobListings/lib/planfeatureHelpers.ts` - Usage limits

### Theme System
**Important**: Dark mode has been completely removed. The platform uses light theme only with a professional blue color scheme.

### Webhook Setup (Simplified)

**For Development**:
1. **Direct Clerk Webhooks**: Set Clerk webhook URL to `http://localhost:3000/api/clerk/webhooks` (no tunnel needed)
2. **AI Processing**: Run `npm run inngest` for background tasks
3. **Database**: `docker compose up -d`

**For Production**:
1. **Direct Clerk Webhooks**: Set Clerk webhook URL to `https://yourdomain.com/api/clerk/webhooks`
2. **AI Processing**: Configure Inngest Cloud integration

### AI Integration Points
- **Resume Analysis**: `src/services/inngest/functions/resume.ts` - Processes uploaded PDFs with Claude
- **Job Matching**: `src/services/inngest/ai/getMatchingJobListings.ts` - AI-powered job recommendations
- **Content Processing**: Uses Anthropic Claude API for text analysis

## Development Workflow

### Adding New Features
1. Create feature directory in `src/features/`
2. Add database schema in `src/drizzle/schema/`
3. Create server actions with Zod validation
4. Add Inngest events if background processing needed
5. Use `npm run db:push` to apply schema changes

### Database Changes
- **Development**: Use `npm run db:push` (no migrations)
- **Production**: Generate migrations with `npm run db:generate`
- Always include `onDelete: "cascade"` for foreign keys

### Testing Webhooks
1. **User/Org CRUD**: Register user → Check database directly (immediate sync)
2. **AI Processing**: Upload resume → Check Inngest dashboard for event processing
3. **Database**: Use Drizzle Studio to verify changes
4. **Logs**: Monitor Next.js logs for webhook processing status

### Common Issues
- **Port conflicts**: App may run on 3002 if 3000 is occupied
- **Webhook failures**: Check Clerk dashboard webhook delivery logs
- **Database connection**: Verify Docker container is running
- **AI processing**: Only requires Inngest for resume analysis and ranking
- **Direct webhooks**: Much more reliable than tunnel-based setup

### File Structure Notes
- Route handlers in `src/app/api/`
- Page components in `src/app/(group)/page.tsx`
- Shared UI components in `src/components/ui/`
- Feature-specific components in `src/features/[feature]/components/`
- Database schemas in `src/drizzle/schema/`
- External service integrations in `src/services/`

This platform is production-ready with real-time webhook automation, AI-powered features, and a complete job board workflow.

## Recent Session Context (July 2025)

### Webhook Migration Completed
**Migration from Inngest Cloud to Direct Clerk Webhooks** - Successfully implemented hybrid architecture:

**What Was Done**:
- ✅ Created direct webhook handlers in `src/app/api/clerk/webhooks/route.ts`
- ✅ Removed Clerk events from Inngest, kept only AI processing events
- ✅ Fixed TypeScript lint errors in webhook handlers
- ✅ Updated webhook verification using `svix` library
- ✅ Eliminated manual "Send event to dev server" clicks in Inngest Cloud
- ✅ Successfully built and deployed webhook migration

**Architecture After Migration**:
- **Direct Clerk Webhooks**: Handle user/org CRUD operations immediately
- **Inngest for AI Only**: Resume analysis, job ranking, email notifications
- **Real-time Processing**: No manual intervention required
- **Simplified Development**: No tunnel needed for Clerk webhooks

### Production Deployment Issues & Solutions

**Current Production Status**: Site deployed at `hire-sync-ai.vercel.app` but showing errors

**Critical Issues Identified**:
1. **Development Clerk Keys**: Using `pk_test_` and `sk_test_` keys in production
2. **Missing Environment Variables**: Vercel not configured with all required env vars
3. **Database Connection**: Production database not properly configured
4. **Server Error**: `Application error: a server-side exception has occurred` (Digest: 265885447)

**Fixes Implemented**:
- ✅ Created `PRODUCTION_DEPLOYMENT.md` with complete deployment guide
- ✅ Added `favicon.ico` to fix 404 errors
- ✅ Documented all required Vercel environment variables
- ✅ Provided steps for Clerk production instance setup
- ✅ Added database configuration options (Railway, Supabase, Neon)

**Immediate Actions Required**:
1. Set up Clerk production instance with `pk_live_` and `sk_live_` keys
2. Configure all environment variables in Vercel dashboard
3. Set up production PostgreSQL database with proper connection URL
4. Update webhook URLs to production endpoints
5. Run database migrations in production environment

### Security Improvements
**Environment Security** - Fixed exposed secrets:
- ✅ Removed `.env` from git tracking
- ✅ Updated `.gitignore` to properly ignore env files
- ✅ Updated `.env.example` with all current variables
- ✅ Sanitized API keys from repository history

### Files Modified in Recent Session
- `src/app/api/clerk/webhooks/route.ts` - Direct webhook handlers
- `src/lib/webhooks/verification.ts` - Webhook verification utility
- `src/lib/webhooks/clerk-types.ts` - TypeScript schemas for Clerk events
- `src/services/inngest/client.ts` - Removed Clerk events, kept AI processing
- `src/app/api/inngest/route.ts` - Simplified to AI functions only
- `.env` - Removed from tracking, secrets sanitized
- `.gitignore` - Updated to ignore .env files
- `.env.example` - Updated with all current environment variables
- `PRODUCTION_DEPLOYMENT.md` - Complete production deployment guide
- `src/app/favicon.ico` - Added to fix production 404 errors

### Development Context Notes
- **Webhook Processing**: Fully automated, no manual intervention required
- **Build Status**: All TypeScript lint errors fixed, production build successful
- **Architecture**: Hybrid approach optimizes for both simplicity and performance
- **Security**: All secrets properly secured and excluded from repository
- **Production Ready**: Infrastructure complete, requires environment configuration

### Current Development State
- ✅ Webhook migration complete and tested
- ✅ Build process optimized and working
- ✅ Security issues resolved
- 🔄 Production deployment pending environment configuration
- 🔄 Database migration to production pending
- 🔄 Clerk production keys configuration pending

This session successfully eliminated the need for manual webhook intervention and prepared the platform for production deployment.