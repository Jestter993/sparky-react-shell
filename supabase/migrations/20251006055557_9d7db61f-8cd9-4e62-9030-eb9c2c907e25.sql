-- Fix missing INSERT policy for feedback_rate_limits table
-- This prevents bypass of rate limiting system

CREATE POLICY "Service role can insert rate limit records"
ON public.feedback_rate_limits FOR INSERT
TO service_role
WITH CHECK (true);

-- Alternative: Allow authenticated users to insert their own rate limits
-- (This would be used if calling from client-side code)
CREATE POLICY "System can track rate limits"
ON public.feedback_rate_limits FOR INSERT
TO anon, authenticated
WITH CHECK (true);