-- Fix email_subscribers table security vulnerability
-- Remove the overly permissive service role policy and replace with secure policies

-- First, drop the existing unsafe policy
DROP POLICY IF EXISTS "Service role can manage all email subscribers" ON public.email_subscribers;

-- Create secure RLS policies

-- Allow anyone to subscribe (INSERT only) - this is needed for public signup forms
CREATE POLICY "Anyone can subscribe to email list" 
ON public.email_subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only service role can read subscriber data (for admin/management purposes)
CREATE POLICY "Service role can read all subscribers" 
ON public.email_subscribers 
FOR SELECT 
TO service_role
USING (true);

-- Only service role can update subscriber data (for unsubscribes, status changes)
CREATE POLICY "Service role can update all subscribers" 
ON public.email_subscribers 
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);

-- Only service role can delete subscriber data (for GDPR compliance, cleanup)
CREATE POLICY "Service role can delete all subscribers" 
ON public.email_subscribers 
FOR DELETE 
TO service_role
USING (true);

-- Ensure RLS is enabled (it should already be, but let's be explicit)
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;