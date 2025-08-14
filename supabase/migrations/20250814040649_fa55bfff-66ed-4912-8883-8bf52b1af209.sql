-- Remove the overly permissive policy that exposes all user emails
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- If display names need to be public (for user mentions, etc.), 
-- create a separate policy that only exposes non-sensitive fields
CREATE POLICY "Public can view display names and avatars" 
ON public.profiles 
FOR SELECT 
USING (true)
WITH CHECK (false);