-- Fix RLS policies to allow public access to user information for published job listings

-- Add policy to allow anyone to view basic user info for job listing authors
CREATE POLICY "Anyone can view job listing authors" ON users
    FOR SELECT USING (
        id IN (
            SELECT user_id FROM job_listings 
            WHERE status = 'published'
        )
    );