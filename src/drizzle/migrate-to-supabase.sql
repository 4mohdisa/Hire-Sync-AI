-- Supabase Migration Script
-- This creates the simplified user-based schema without organizations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE wage_interval AS ENUM ('hourly', 'yearly');
CREATE TYPE location_requirement AS ENUM ('in-office', 'hybrid', 'remote');
CREATE TYPE experience_level AS ENUM ('junior', 'mid-level', 'senior');
CREATE TYPE job_listing_status AS ENUM ('draft', 'published', 'delisted');
CREATE TYPE job_listing_type AS ENUM ('internship', 'part-time', 'full-time');
CREATE TYPE application_stage AS ENUM ('applied', 'phone-screen', 'interview', 'offer', 'rejected');

-- Users table (simplified from organization-based to user-based)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR,
    image_url VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job listings table (now owned by users instead of organizations)
CREATE TABLE job_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    wage INTEGER,
    wage_interval wage_interval,
    state_abbreviation VARCHAR,
    city VARCHAR,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    location_requirement location_requirement NOT NULL,
    experience_level experience_level NOT NULL,
    status job_listing_status NOT NULL DEFAULT 'draft',
    type job_listing_type NOT NULL,
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job applications table (simplified)
CREATE TABLE job_listing_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_listing_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    applicant_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage application_stage NOT NULL DEFAULT 'applied',
    rating INTEGER,
    notes TEXT,
    resume_text TEXT,
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User resumes table
CREATE TABLE user_resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    text TEXT,
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User notification settings table
CREATE TABLE user_notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    application_updates BOOLEAN NOT NULL DEFAULT TRUE,
    new_job_alerts BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_job_listings_user_id ON job_listings(user_id);
CREATE INDEX idx_job_listings_state ON job_listings(state_abbreviation);
CREATE INDEX idx_job_listings_status ON job_listings(status);
CREATE INDEX idx_applications_job_listing_id ON job_listing_applications(job_listing_id);
CREATE INDEX idx_applications_applicant_user_id ON job_listing_applications(applicant_user_id);
CREATE INDEX idx_user_resumes_user_id ON user_resumes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Job listings: Users can CRUD their own listings, everyone can view published ones
CREATE POLICY "Anyone can view published job listings" ON job_listings
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view own job listings" ON job_listings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create job listings" ON job_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job listings" ON job_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job listings" ON job_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Job applications: Users can apply to jobs and view their applications
-- Job listing owners can view applications to their jobs
CREATE POLICY "Users can view own applications" ON job_listing_applications
    FOR SELECT USING (auth.uid() = applicant_user_id);

CREATE POLICY "Job owners can view applications to their jobs" ON job_listing_applications
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM job_listings WHERE id = job_listing_id
        )
    );

CREATE POLICY "Users can create applications" ON job_listing_applications
    FOR INSERT WITH CHECK (auth.uid() = applicant_user_id);

CREATE POLICY "Job owners can update applications to their jobs" ON job_listing_applications
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM job_listings WHERE id = job_listing_id
        )
    );

-- User resumes: Users can only access their own resumes
CREATE POLICY "Users can view own resumes" ON user_resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes" ON user_resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON user_resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON user_resumes
    FOR DELETE USING (auth.uid() = user_id);

-- User notification settings: Users can only access their own settings
CREATE POLICY "Users can view own notification settings" ON user_notification_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notification settings" ON user_notification_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings" ON user_notification_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, image_url)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
    
    -- Create default notification settings
    INSERT INTO public.user_notification_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();