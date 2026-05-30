-- Add support for multiple resumes with primary resume designation
-- Run this query in your Supabase SQL editor

-- Add is_primary column to track which resume is the main one
ALTER TABLE user_resumes 
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;

-- Set the first resume for each user as primary (if they have any)
UPDATE user_resumes 
SET is_primary = TRUE
WHERE id IN (
  SELECT DISTINCT ON (user_id) id
  FROM user_resumes
  ORDER BY user_id, created_at ASC
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id_primary ON user_resumes(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id_created ON user_resumes(user_id, created_at DESC);

-- Verify the changes
SELECT 
  u.email,
  r.file_name,
  r.is_primary,
  r.created_at
FROM users u
JOIN user_resumes r ON u.id = r.user_id
ORDER BY u.email, r.created_at;