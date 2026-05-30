-- Disable email confirmation requirement in Supabase Auth
-- Run this in your Supabase SQL Editor

-- Update auth config to disable email confirmation
UPDATE auth.config 
SET email_confirm_change = false, 
    email_double_confirm_changes = false;

-- If the above doesn't work, you can also try updating the auth schema directly
-- This will mark all existing unconfirmed users as confirmed
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;