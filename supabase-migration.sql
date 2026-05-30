-- HireSync AI Database Migration: Add Organizations System
-- Run this in Supabase SQL Editor

-- 1. Create the organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar NOT NULL UNIQUE,
    company_name varchar NOT NULL,
    logo_url varchar,
    website_url varchar,
    description text,
    industry varchar,
    company_size varchar,
    is_verified boolean NOT NULL DEFAULT false,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp DEFAULT now() NOT NULL
);

-- 2. Add organization_id column to job_listings table
ALTER TABLE job_listings 
ADD COLUMN IF NOT EXISTS organization_id uuid;

-- 3. Add foreign key constraint from job_listings to organizations
ALTER TABLE job_listings 
ADD CONSTRAINT job_listings_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
CREATE INDEX IF NOT EXISTS idx_organizations_company_name ON organizations(company_name);
CREATE INDEX IF NOT EXISTS idx_job_listings_organization_id ON job_listings(organization_id);

-- 5. Enable Row Level Security (RLS) for organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for organizations
-- Organizations can only see and modify their own data
CREATE POLICY "Organizations can view own data" ON organizations
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Organizations can update own data" ON organizations
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- 7. Update RLS policies for job_listings to use organization_id
-- First drop existing policies that use user_id
DROP POLICY IF EXISTS "Users can view own job listings" ON job_listings;
DROP POLICY IF EXISTS "Users can create job listings" ON job_listings;
DROP POLICY IF EXISTS "Users can update own job listings" ON job_listings;
DROP POLICY IF EXISTS "Users can delete own job listings" ON job_listings;

-- Create new policies for organizations
CREATE POLICY "Organizations can view own job listings" ON job_listings
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Organizations can create job listings" ON job_listings
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Organizations can update own job listings" ON job_listings
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Organizations can delete own job listings" ON job_listings
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- 8. Allow anonymous users to view published job listings (no change needed)
-- This policy should already exist from previous setup

-- 9. Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create trigger for organizations updated_at
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration Complete!
-- You can now test organization registration and job posting