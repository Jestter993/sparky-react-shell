-- Phase 1: Fix Rate Limiting System
-- Drop the conflicting policy blocking all inserts
DROP POLICY IF EXISTS "Only backend can insert rate limits" ON feedback_rate_limits;

-- Create cleanup function to auto-delete old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.feedback_rate_limits 
  WHERE submitted_at < NOW() - INTERVAL '1 hour';
  
  RAISE NOTICE 'Cleaned up rate limit records older than 1 hour';
END;
$$;

-- Phase 2: Secure Email Subscriptions
-- Create index for performance (do this first)
CREATE INDEX IF NOT EXISTS idx_email_subscribers_rate_limit 
ON email_subscribers(email, created_at DESC);

-- Add unique constraint to prevent duplicate active subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_subscribers_unique_active
ON email_subscribers(email)
WHERE subscription_status = 'active';

-- Phase 3: Strengthen Profile RLS
-- Drop old policy with redundant NULL check
DROP POLICY IF EXISTS "Users can view own profile only" ON profiles;

-- Create cleaner policy
CREATE POLICY "Users can view own profile only" 
ON profiles
FOR SELECT
USING (auth.uid() = user_id);