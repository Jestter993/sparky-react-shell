-- Add explicit INSERT policy for feedback_rate_limits table
-- This prevents client-side bypass attempts while allowing edge functions (service role) to insert
CREATE POLICY "Only backend can insert rate limits"
ON public.feedback_rate_limits
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Add a comment to document the security model
COMMENT ON TABLE public.feedback_rate_limits IS 'Rate limiting table - only accessible by service role (edge functions). Client applications cannot insert or modify records directly.';