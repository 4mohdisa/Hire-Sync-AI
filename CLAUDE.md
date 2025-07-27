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