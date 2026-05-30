-- Add profile fields to users table
-- Run this query in your Supabase SQL editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR,
ADD COLUMN IF NOT EXISTS location VARCHAR,
ADD COLUMN IF NOT EXISTS website VARCHAR;

-- Update the updated_at column to current timestamp for tracking
-- (This is optional, just to refresh the updated_at field)
UPDATE users SET updated_at = NOW() WHERE phone IS NULL AND location IS NULL AND website IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;