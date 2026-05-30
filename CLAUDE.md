# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hire Sync AI is a completely free job board platform built with Next.js 15, featuring AI-powered job matching, resume analysis, and automated hiring workflows. The platform supports both user-based job seekers and organization-based employers with dual authentication systems via Supabase Auth.

## Development Commands

### Database Operations
```bash
npm run db:push                   # Push schema changes to database (development)
npm run db:generate               # Generate migrations
npm run db:migrate                # Run migrations (production)
npm run db:studio                 # Open Drizzle Studio at localhost:4983
npm run db:setup-supabase         # Setup Supabase database and RLS policies
npm run db:setup-supabase-direct  # Direct Supabase setup (simple)
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

#### Dual Authentication Architecture
**CRITICAL**: The platform supports both user and organization authentication:

**User Authentication**: 
- Individual job seekers with personal profiles and application tracking
- User-owned resumes and notification settings
- Direct application submission to job listings

**Organization Authentication**:
- Company accounts that post and manage job listings
- Organization-owned job postings with company branding
- Application management and candidate tracking
- Separate sign-in/sign-up flows at `/auth/organization/`

**Data Ownership**:
- Job listings are owned by organizations (`organization_id`)
- Applications link users to organization job listings
- All foreign keys use `onDelete: "cascade"` for proper cleanup
- Published jobs are viewable by anonymous users via RLS policies

#### Route Structure
```
src/app/
├── (job-seeker)/       # Main job board interface
│   ├── page.tsx        # Homepage with job listings  
│   ├── ai-search/      # AI-powered job search
│   ├── job-listings/   # Job detail pages
│   └── user-settings/  # User settings (notifications, resume, ai-agent)
├── employer/           # Legacy employer dashboard  
├── organization/       # Organization dashboard (organization-owned jobs)
├── auth/              # User authentication pages (sign-in/sign-up)
│   └── organization/   # Organization authentication pages
├── ai-agent-demo/     # Public demo page (no auth required)
└── api/auth/          # User sync and debug endpoints
```

#### Supabase Authentication & User Sync
**CRITICAL**: The platform has a hybrid authentication approach with dual account types:

**User Authentication**:
- **Supabase Auth**: Handles authentication in `auth.users` table
- **App Users Table**: Stores user profiles in app's `users` table  
- **Automatic Sync**: `SupabaseProvider` automatically syncs users between both tables
- **Access**: Job seeker dashboard, applications, resume management

**Organization Authentication**:
- **App Organizations Table**: Stores company profiles in `organizations` table
- **Email/Password Auth**: Direct authentication without Supabase Auth integration
- **Manual Management**: No automatic sync, managed via `/api/organization/` endpoints
- **Access**: Job posting, application management, company dashboard

This dual approach prevents "User Already Exists" errors and provides separate experiences for job seekers and employers.

## Database Schema Structure

### Current Schema (Dual Model)
```typescript
// src/drizzle/schema.ts - exports all tables
export * from "./schema/user"                    // Users (synced with Supabase Auth)
export * from "./schema/organization"            // Organizations (companies)
export * from "./schema/jobListing"             // Jobs (organization_id owner)  
export * from "./schema/userResume"             // User resumes
export * from "./schema/userNotificationSettings" // User preferences
export * from "./schema/jobListingApplication"   // Applications (user applies to organization job)
```

**Key Schema Details**:
- All tables use `snake_case` field names for Supabase compatibility
- Foreign keys have `onDelete: "cascade"` for proper cleanup
- Organization model supports company accounts and job ownership
- No plan/payment-related fields (completely free platform)
- UUID primary keys throughout
- Organizations table excludes `location` and `phone` columns (not in actual database)

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

### Recent Major Migration & Organization System (January 2025)
**Status**: ✅ COMPLETED - Major architectural changes

**Authentication Migration**:
- **From**: Clerk authentication with organizations
- **To**: Dual Supabase Auth system (users + organizations)
- **Key Changes**: Added organization authentication alongside user authentication

**Organization System Implementation**:
- **Added**: Complete organization authentication system
- **Features**: Organization sign-up, sign-in, dashboard, job management  
- **Database**: Organization table with company profiles and job ownership
- **Routes**: `/auth/organization/`, `/organization/dashboard`, `/api/organization/`
- **Demo Data**: Microsoft organization with 6 sample job listings

**User Sync Implementation**:
- **Problem Solved**: "User Already Exists" error when Supabase Auth and app users table were out of sync
- **Solution**: Automatic user sync in `SupabaseProvider` via `/api/auth/sync-user`
- **Result**: Users are automatically created in app's `users` table when they sign in/up

**Architecture Enhancement**:
- **Added**: Organization model and authentication flows
- **Maintained**: User authentication for job seekers  
- **Updated**: Job listings now owned by organizations, not individual users
- **Schema**: Fixed organization table to match actual database structure

### Key System Features

**Payment System**: Completely removed - platform is entirely free
**Theme System**: Light mode only (dark mode removed)  
**AI Agent Demo**: Added public demo page accessible without authentication with bulk application animation
**User Settings**: Notifications, Resume, and AI Agent configuration tabs
**Demo Data**: Microsoft organization with 6 job listings, demo user account, functional bulk application simulation

### Database Field Naming Convention

**CRITICAL**: All database tables use `snake_case` field names to maintain Supabase compatibility:
- Database Schema: `user_id`, `created_at`, `experience_level`, `location_requirement`
- Form Schemas: Use camelCase (`userId`, `createdAt`, `experienceLevel`, `locationRequirement`)
- Data Transformation: Server actions handle conversion between camelCase (forms) and snake_case (database)

**When working with database fields**:
- Always use snake_case when referencing database columns directly
- Form schemas can use camelCase but must transform to snake_case before database operations
- TypeScript types should match the database schema (snake_case)

## Development Workflow

### Adding New Features
1. Create feature directory in `src/features/` following the established pattern
2. Add database schema in `src/drizzle/schema/[table].ts` using snake_case fields
3. Export new schema from `src/drizzle/schema.ts`
4. Use `npm run db:push` to apply schema changes
5. Add RLS policies in Supabase Dashboard for user data access
6. Implement appropriate ownership queries (filter by `user_id` for users, `organization_id` for organizations)

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

# Organization testing
curl -X POST http://localhost:3000/api/organization/verify # Test organization auth
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
- **`src/app/employer/`** - Legacy employer dashboard  
- **`src/app/organization/`** - Organization dashboard (company job management)
- **`src/app/ai-agent-demo/`** - Public AI Agent showcase (no auth required)
- **`src/features/`** - Feature modules with actions, components, db queries
- **`src/features/organizations/`** - Organization management and authentication

### AI Features
- **`src/app/(job-seeker)/user-settings/ai-agent/`** - AI Agent settings page
- **`src/features/users/components/AIAgentForm.tsx`** - Comprehensive AI configuration form with bulk application animation
- **`src/app/ai-agent-demo/`** - Public demo showcasing AI automation features

## Common Development Issues

### Authentication Issues
- **User sync problems**: Check `SupabaseProvider` auto-sync and debug endpoints
- **Organization login failures**: Check organization table schema matches (no location/phone fields)
- **RLS access denied**: Verify policies exist for anonymous job viewing
- **Session errors**: Ensure proper server client configuration
- **Dual auth confusion**: Verify using correct auth flow (users vs organizations)

### Database Issues  
- **Connection failures**: Check `DATABASE_URL` matches Supabase project
- **Schema conflicts**: Use `npm run db:push` to sync changes
- **User deletion**: Confirmed working with cascade foreign keys
- **Organization schema mismatches**: Ensure organization table excludes location/phone columns
- **Field name errors**: Ensure snake_case field names in database queries
- **Job ownership errors**: Verify jobs are linked to organization_id, not user_id

### Build Issues
- **Import errors**: Check for removed Clerk/organization imports
- **Type errors**: Ensure schema exports match imports and use snake_case field names
- **ESLint warnings**: Non-critical, focus on compilation errors
- **Field name mismatches**: Common error when mixing camelCase and snake_case - always use snake_case for database operations

### TypeScript Best Practices
- Use proper typing for database operations: `typeof TableName.$inferSelect` and `typeof TableName.$inferInsert`
- When creating form defaults from database records, map snake_case to camelCase
- Add null checks for optional database fields before accessing properties
- Import database table types from schema files when defining component props

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
- ✅ Build compiles successfully with working dual authentication
- ✅ User sync prevents "User Already Exists" errors  
- ✅ Organization authentication system fully implemented
- ✅ AI Agent demo ready for showcase with bulk application animation
- ✅ Database schema clean with proper cascade deletion
- ✅ All legacy code removed and replaced with Supabase equivalents
- ✅ All TypeScript compilation errors fixed (January 2025)
- ✅ Database field naming standardized to snake_case throughout application
- ✅ Application stage enums updated to current values: "applied", "phone-screen", "interview", "offer", "rejected"
- ✅ Demo data created: Microsoft organization with 6 job listings, demo user account
- ✅ Organization schema fixed to match actual database structure (no location/phone fields)

## Testing & Validation

### Manual Testing Workflow
```bash
# 1. Build validation
npm run build

# 2. Development server test
npm run dev

# 3. Database inspection
npm run db:studio

# 4. Authentication flow test
# - Visit /auth/sign-up (user registration, should work without email confirmation)
# - Visit /auth/sign-in (user login, should redirect to home after login)
# - Visit /auth/organization/sign-up (organization registration)
# - Visit /auth/organization/sign-in (organization login, should redirect to dashboard)
# - Visit /ai-agent-demo (should work without authentication)
```

### Key Testing Areas
- **Authentication Flow**: User and organization sign-up/sign-in, user sync between Supabase Auth and app database
- **Database Operations**: CRUD operations with proper field naming (snake_case) for both users and organizations
- **Job Management**: Organization job posting, editing, publishing, user job applications
- **File Uploads**: Resume uploads via UploadThing integration
- **Form Submissions**: Job listings, user settings, applications with field name transformations
- **Anonymous Access**: Public job listings and AI agent demo page
- **Demo Features**: Bulk application animation, Microsoft organization demo data

### Demo Account Credentials
```bash
# Organization Account
Email: microsoft@demo.com
Password: Demo123!
Access: /organization/dashboard

# User Account  
Email: mohammed.isa@demo.com
Password: Demo123!
Name: Mohammed Isa
Access: / (job seeker dashboard)
```