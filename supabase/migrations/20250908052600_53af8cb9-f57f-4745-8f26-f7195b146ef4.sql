-- Implement admin-only security for email subscribers
-- Step 1: Add is_admin field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Step 3: Drop existing problematic policies
DROP POLICY IF EXISTS "Authenticated users can read subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Authenticated users can delete subscribers" ON public.email_subscribers;

-- Step 4: Create admin-only policies for sensitive operations
CREATE POLICY "Admins can read all subscribers" 
ON public.email_subscribers 
FOR SELECT 
TO authenticated
USING (public.is_current_user_admin());

CREATE POLICY "Admins can update subscribers" 
ON public.email_subscribers 
FOR UPDATE 
TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can delete subscribers" 
ON public.email_subscribers 
FOR DELETE 
TO authenticated
USING (public.is_current_user_admin());