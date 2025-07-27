# Hire Sync AI - Job Board Platform

A modern, AI-powered job board platform built with Next.js, featuring intelligent job matching, resume analysis, and streamlined hiring workflows.

## 🚀 Project Overview

**Hire Sync AI** is a completely free job board platform that connects job seekers with employers through intelligent matching and AI-powered features. The platform provides a comprehensive solution for job posting, application management, and candidate evaluation.

## 📋 Project Status & Recent Changes

### ✅ **Completed Features & Fixes**

#### **1. Payment System Removal (Major Update)**
- **Status**: ✅ COMPLETED
- **Description**: Converted from a paid/freemium model to a completely free platform
- **Changes Made**:
  - Removed all payment/plan restrictions from backend logic
  - Eliminated pricing pages and UI components
  - Removed "Change Plan" menu items and upgrade popovers
  - Updated `planFeatures.ts` to always return true (all features free)
  - Updated `planfeatureHelpers.ts` to return unlimited usage
  - Cleaned up plan-related imports and conditional logic
  - Database schema confirmed clean (no plan-related fields)

#### **2. UI Theme Transformation**
- **Status**: ✅ COMPLETED
- **Description**: Converted from dark/light theme system to light theme only
- **Changes Made**:
  - Removed `next-themes` dependency completely
  - Eliminated all dark mode CSS variables and classes
  - Updated color scheme to professional blue-based palette
  - Added subtle dot grid background pattern
  - Enhanced button animations with hover effects
  - Implemented custom card styling with backdrop blur
  - Added gradient sidebar styling
  - Increased border radius for modern appearance

#### **3. Environment Configuration Fixes**
- **Status**: ✅ COMPLETED
- **Description**: Fixed critical deployment issues
- **Changes Made**:
  - Fixed client environment configuration bug in `client.ts`
  - Updated Inngest configuration from port 3002 to 3000
  - Added missing `NEXT_PUBLIC_CLERK_SIGN_UP_URL` environment variable
  - Corrected environment variable mappings

#### **4. Database Schema Updates**
- **Status**: ✅ COMPLETED
- **Description**: Fixed foreign key constraint issues for user deletion
- **Changes Made**:
  - Added `onDelete: "cascade"` to `userResume.ts`
  - Added `onDelete: "cascade"` to `userNotificationSettings.ts`
  - Added `onDelete: "cascade"` to `organizationUserSettings.ts`
  - Fixed user deletion foreign key constraint errors

## 🛠 Technology Stack

- **Frontend**: Next.js 15.3.5, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk with organization support
- **Background Jobs**: Inngest workflow engine
- **File Storage**: UploadThing
- **Email**: Resend
- **AI Services**: Anthropic Claude, Google Gemini
- **Deployment**: Vercel (production), Docker (local development)

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Environment Variables
```bash
# Database Configuration
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hiresyncai

# Clerk Authentication
CLERK_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Services
UPLOADTHING_TOKEN=your_uploadthing_token
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
RESEND_API_KEY=your_resend_key
SERVER_URL=http://localhost:3000

# Inngest
INNGEST_CLIENT_ID=hire-sync-ai
INNGEST_DEV_SERVER_URL=http://localhost:3000/api/inngest
INNGEST_DEV_AUTO_SYNC=true
```

### Installation & Setup
```bash
# Clone repository
git clone <repository-url>
cd hire-sync-ai

# Install dependencies
npm install

# Start database
docker compose up -d

# Push database schema
npm run db:push

# Start development server
npm run dev

# Start Inngest dev server (separate terminal)
npm run inngest

# Optional: Start email dev server
npm run email
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── (clerk)/                 # Clerk authentication pages
│   ├── (job-seeker)/            # Job seeker dashboard
│   ├── employer/                # Employer dashboard
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   └── sidebar/                 # Sidebar components
├── features/                     # Feature-specific modules
│   ├── jobListings/             # Job listing functionality
│   ├── organizations/           # Organization management
│   └── users/                   # User management
├── services/                     # External service integrations
│   ├── clerk/                   # Clerk authentication
│   ├── inngest/                 # Background jobs
│   └── resend/                  # Email services
├── drizzle/                     # Database schema & migrations
└── data/                        # Environment & configuration
```

## 🌟 Key Features

### For Job Seekers
- **AI-Powered Job Search**: Intelligent matching based on skills and preferences
- **Resume Management**: Upload and AI-powered resume analysis
- **Application Tracking**: Track application status and ratings
- **Email Notifications**: Customizable job alert system

### For Employers
- **Unlimited Job Posting**: Post unlimited job listings (completely free)
- **Featured Listings**: Highlight important job postings
- **Application Management**: Comprehensive applicant tracking system
- **AI Resume Analysis**: Automated resume summarization
- **Team Collaboration**: Organization-based user management

### Platform Features
- **Responsive Design**: Mobile-first, professional light theme
- **Real-time Updates**: Inngest-powered background processing
- **File Management**: Secure resume and document storage
- **Email System**: Automated notifications and communications

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Professional blue-based scheme
- **Typography**: Geist Sans & Mono fonts
- **Components**: shadcn/ui with custom enhancements
- **Animations**: Subtle hover effects and transitions
- **Layout**: Clean, card-based design with proper spacing

### Custom Styling Classes
```css
.custom-card          /* Enhanced card with backdrop blur */
.gradient-bg          /* Subtle gradient backgrounds */
.enhanced-button      /* Buttons with hover animations */
```

## 🔧 Current Status & Next Steps

### Recently Completed
1. ✅ Removed all payment/plan restrictions
2. ✅ Converted to light theme only
3. ✅ Fixed deployment environment issues
4. ✅ Fixed database foreign key constraints
5. ✅ Reset database for clean slate

### Immediate Next Steps
1. 🔄 Test user deletion functionality
2. 🔄 Verify all features work without restrictions
3. 🔄 Complete production deployment
4. 🔄 Add hero section to landing page (optional)

### Future Enhancements
- Enhanced AI matching algorithms
- Advanced filtering and search capabilities
- Integration with job boards APIs
- Analytics and reporting features
- Mobile app development

## 🚨 Important Notes

### Database Management
- Database is completely reset with clean schema
- All foreign key constraints fixed for proper user deletion
- No plan-related fields exist in database
- Migration system in place for future schema changes

### Deployment Configuration
- Vercel deployment configured
- Environment variables mapped correctly
- Build process optimized for production
- Inngest configured for both development and production

### Authentication & Security
- Clerk authentication with organization support
- Secure file upload with UploadThing
- Webhook handling for user lifecycle events
- Proper error handling and validation

## 🧑‍💻 Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration active
- Consistent component structure
- Proper error handling throughout

### Database Operations
```bash
npm run db:push      # Push schema changes
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database studio
```

### Testing & Building
```bash
npm run lint         # Run ESLint
npm run build        # Build for production
npm start           # Start production server
```

## 📞 Support & Maintenance

### Common Issues & Solutions
1. **Inngest Sync Issues**: Ensure correct port configuration (3000)
2. **Database Connection**: Verify Docker containers are running
3. **Environment Variables**: Check all required variables are set
4. **User Deletion**: Fixed with cascade deletion constraints

### Monitoring
- Check Inngest dashboard for background job status
- Monitor database connections via Drizzle Studio
- Review application logs for errors
- Verify webhook deliveries in Clerk dashboard

---

## 🔄 Resuming Development

When continuing work on this project, use this prompt to provide full context:

**"I'm resuming work on the Hire Sync AI project. This is a Next.js job board platform that we've recently converted to be completely free (removed all payment/plan restrictions) and changed to light theme only. The project uses Drizzle ORM with PostgreSQL, Clerk authentication, Inngest for background jobs, and is deployed on Vercel. We've fixed database foreign key constraints for user deletion and reset the database. The current status is that the platform is fully functional as a free service with unlimited job postings and features. Please review the README.md file for complete context and let me know what specific aspect you'd like to work on next."**

This README serves as the complete project documentation and development continuation guide.