-- Fix email subscriber data security vulnerability
-- First drop ALL existing policies to ensure clean state
DROP POLICY IF EXISTS "Anyone can subscribe to email list" ON public.email_subscribers;
DROP POLICY IF EXISTS "Service role can read all subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Service role can update all subscribers" ON public.email_subscribers;  
DROP POLICY IF EXISTS "Service role can delete all subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Admin users can read all subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Admin users can update subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Admin users can delete subscribers" ON public.email_subscribers;

-- Recreate secure policies
-- Allow public subscriptions (this is needed for the subscription form)
CREATE POLICY "Public can subscribe to email list" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Restrict reading to authenticated users only (no more service role access)
CREATE POLICY "Authenticated users can read subscribers" 
ON public.email_subscribers 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Restrict updates to authenticated users only
CREATE POLICY "Authenticated users can update subscribers" 
ON public.email_subscribers 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Restrict deletions to authenticated users only
CREATE POLICY "Authenticated users can delete subscribers" 
ON public.email_subscribers 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);