# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hire Sync AI is a completely free job board platform built with Next.js 15, featuring AI-powered job matching, resume analysis, and automated hiring workflows. The platform was recently migrated from Clerk to Supabase authentication with a simplified user-centric architecture.

## Development Commands

### Database Operations
```bash
npm run db:push                   # Push schema changes to database (development)
npm run db:generate               # Generate migrations
npm run db:migrate                # Run migrations (production)
npm run db:studio                 # Open Drizzle Studio at localhost:4983
npm run db:setup-supabase         # Setup Supabase database and RLS policies
npm run db:migrate-data           # Migrate data from backup (migration helper)
npm run db:verify-migration       # Verify migrated data integrity
```

### Development Servers
```bash
npm run dev                       # Next.js dev server with Turbopack
npm run email                     # Email dev server at localhost:3001
```

### Build & Deploy
```bash
npm run lint                      # ESLint check
npm run build                     # Production build
npm run start                     # Start production server
```

## Architecture Overview

### Core Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: Supabase PostgreSQL with Drizzle ORM (cloud-hosted)
- **Authentication**: Supabase Auth with email/password (no email confirmation)
- **AI Services**: Anthropic Claude for resume analysis and job matching
- **File Storage**: UploadThing for resume/document handling
- **Email**: Resend for transactional emails
- **Styling**: Tailwind CSS 4 with shadcn/ui components (light theme only)

### Key Architectural Patterns

#### Feature-Based Organization
```
src/features/
├── jobListings/        # Job posting, search, management
├── users/             # User profiles and settings  
└── jobListingApplications/  # Application tracking
```

Each feature follows the pattern:
- `actions/` - Server actions with Zod validation
- `components/` - React components
- `db/` - Database queries and cache tags
- `lib/` - Feature-specific utilities

#### User-Centric Data Architecture
**CRITICAL**: The platform uses a simplified user-centric model (no organizations):
- Users directly own job listings and applications
- No multi-tenant/organization structure
- All foreign keys use `onDelete: "cascade"` for proper user deletion
- Published jobs are viewable by anonymous users via RLS policies

#### Route Structure
```
src/app/
├── (job-seeker)/       # Main job board interface
│   ├── page.tsx        # Homepage with job listings  
│   ├── ai-search/      # AI-powered job search
│   ├── job-listings/   # Job detail pages
│   └── user-settings/  # User settings (notifications, resume, ai-agent)
├── employer/           # Employer dashboard (user-owned jobs)
├── auth/              # Supabase Auth pages (sign-in/sign-up)
├── ai-agent-demo/     # Public demo page (no auth required)
└── api/auth/          # User sync and debug endpoints
```

#### Supabase Authentication & User Sync
**CRITICAL**: The platform has a hybrid authentication approach:

**Supabase Auth**: Handles authentication in `auth.users` table
**App Users Table**: Stores user profiles in app's `users` table  
**Automatic Sync**: `SupabaseProvider` automatically syncs users between both tables

This prevents "User Already Exists" errors by ensuring users exist in both Supabase Auth and the app's database.

## Database Schema Structure

### Current Schema (User-Centric)
```typescript
// src/drizzle/schema.ts - exports all tables
export * from "./schema/user"                    // Users (synced with Supabase Auth)
export * from "./schema/jobListing"             // Jobs (user_id owner)  
export * from "./schema/userResume"             // User resumes
export * from "./schema/userNotificationSettings" // User preferences
export * from "./schema/jobListingApplication"   // Applications
```

**Key Schema Details**:
- All tables use `snake_case` field names for Supabase compatibility
- Foreign keys have `onDelete: "cascade"` for proper cleanup
- No organization/plan-related fields (completely free platform)
- UUID primary keys throughout

## Environment Configuration

### Required Environment Variables
```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres

# Optional: Additional settings
JWT_SECRET=your_jwt_secret
PROJECT_URL=http://localhost:3000
SERVER_URL=http://localhost:3000

# External Services (Optional)
UPLOADTHING_TOKEN=your_uploadthing_token
ANTHROPIC_API_KEY=your_anthropic_api_key
RESEND_API_KEY=your_resend_api_key
```

### Environment Validation
Environment variables are validated using `@t3-oss/env-nextjs` in:
- `src/data/env/server.ts` - Server-side variables
- `src/data/env/client.ts` - Client-side variables

## Critical Development Context

### Recent Major Migration (January 2025)
**Status**: ✅ COMPLETED - Major architectural changes

**Authentication Migration**:
- **From**: Clerk authentication with organizations
- **To**: Supabase Auth with user-centric model
- **Key Changes**: Removed all organization dependencies, simplified to user ownership

**User Sync Implementation**:
- **Problem Solved**: "User Already Exists" error when Supabase Auth and app users table were out of sync
- **Solution**: Automatic user sync in `SupabaseProvider` via `/api/auth/sync-user`
- **Result**: Users are automatically created in app's `users` table when they sign in/up

**Architecture Simplification**:
- **Removed**: Multi-tenant organization structure
- **Added**: Direct user ownership of all data
- **Updated**: All queries and permissions to use `user_id` instead of `organizationId`

### Key System Features

**Payment System**: Completely removed - platform is entirely free
**Theme System**: Light mode only (dark mode removed)  
**AI Agent Demo**: Added public demo page accessible without authentication
**User Settings**: Notifications, Resume, and AI Agent configuration tabs

## Development Workflow

### Adding New Features
1. Create feature directory in `src/features/` following the established pattern
2. Add database schema in `src/drizzle/schema/[table].ts` using snake_case fields
3. Export new schema from `src/drizzle/schema.ts`
4. Use `npm run db:push` to apply schema changes
5. Add RLS policies in Supabase Dashboard for user data access
6. Implement user-centric queries (always filter by `user_id`)

### Database Development
- **Schema Changes**: Use `npm run db:push` (development)
- **RLS Policies**: Essential for user data security in Supabase
- **Foreign Keys**: Always include `onDelete: "cascade"` for proper cleanup
- **Testing**: Use `npm run db:studio` to inspect data

### Authentication Testing
1. **Anonymous Browsing**: Visit `/` - should show job listings without errors
2. **Sign Up**: Use `/auth/sign-up` - immediate account creation (no email confirmation)
3. **User Sync**: Verify users appear in both Supabase Auth and app's `users` table
4. **AI Agent Demo**: Test `/ai-agent-demo` page (accessible without auth)

### Debug and Maintenance Tools
```bash
# User sync debugging
curl http://localhost:3000/api/auth/debug-users        # Shows sync status
curl -X POST http://localhost:3000/api/auth/sync-users # Manual bulk sync
curl -X POST http://localhost:3000/api/auth/sync-user  # Single user sync
```

## Key Implementation Files

### Authentication & User Management
- **`src/services/supabase/server.ts`** - Server-side Supabase client for SSR
- **`src/services/supabase/client.ts`** - Client-side Supabase client
- **`src/services/supabase/auth.ts`** - Authentication utilities with error handling
- **`src/services/supabase/components/SupabaseProvider.tsx`** - Auto user sync logic
- **`src/app/auth/`** - Sign-in/sign-up pages with proper SSR handling

### Database & Schema
- **`src/drizzle/db.ts`** - Pure Supabase database connection (no Docker fallbacks)
- **`src/drizzle/schema.ts`** - Schema exports (simplified user-centric model)
- **`src/drizzle/schema/*.ts`** - Individual table definitions with snake_case fields

### Core Features
- **`src/app/(job-seeker)/`** - Main job board with sidebar navigation
- **`src/app/employer/`** - Employer dashboard (user-owned jobs)
- **`src/app/ai-agent-demo/`** - Public AI Agent showcase (no auth required)
- **`src/features/`** - Feature modules with actions, components, db queries

### AI Features
- **`src/app/(job-seeker)/user-settings/ai-agent/`** - AI Agent settings page
- **`src/features/users/components/AIAgentForm.tsx`** - Comprehensive AI configuration form
- **`src/app/ai-agent-demo/`** - Public demo showcasing AI automation features

## Common Development Issues

### Authentication Issues
- **User sync problems**: Check `SupabaseProvider` auto-sync and debug endpoints
- **RLS access denied**: Verify policies exist for anonymous job viewing
- **Session errors**: Ensure proper server client configuration

### Database Issues  
- **Connection failures**: Check `DATABASE_URL` matches Supabase project
- **Schema conflicts**: Use `npm run db:push` to sync changes
- **User deletion**: Confirmed working with cascade foreign keys

### Build Issues
- **Import errors**: Check for removed Clerk/organization imports
- **Type errors**: Ensure schema exports match imports
- **ESLint warnings**: Non-critical, focus on compilation errors

## Recent Development Sessions

### January 2025: Complete Architecture Migration ✅

**User Authentication Fix**:
- **Problem**: "User Already Exists" error due to Supabase Auth/app user table mismatch
- **Solution**: Implemented automatic user sync in `SupabaseProvider`
- **Result**: Seamless user creation in both Supabase Auth and app database

**AI Agent Feature Addition**:
- **Added**: Comprehensive AI Agent settings page for job application automation
- **Features**: Job preferences, agent behavior settings, pre-filled answers
- **Demo Page**: Public showcase at `/ai-agent-demo` (no authentication required)
- **Integration**: Added to user settings navigation with brain icon

**Architecture Simplification**:
- **Removed**: All Clerk dependencies and organization structure
- **Migrated**: To user-centric data ownership model
- **Cleaned**: Removed payment system and dark mode (free platform, light theme only)
- **Database**: Pure Supabase connection with proper RLS policies

**Current Status**:
- ✅ Build compiles successfully with working authentication
- ✅ User sync prevents "User Already Exists" errors  
- ✅ AI Agent demo ready for showcase without authentication
- ✅ Database schema clean with proper cascade deletion
- ✅ All legacy code removed and replaced with Supabase equivalents