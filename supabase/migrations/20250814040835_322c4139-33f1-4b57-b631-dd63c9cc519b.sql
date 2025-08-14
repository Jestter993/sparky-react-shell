-- Fix the RLS policies for profiles table to properly secure email addresses

-- First, drop the problematic policy with incorrect syntax
DROP POLICY IF EXISTS "Public can view display names and avatars" ON public.profiles;

-- The policy "Users can view their own profile" should already exist from previous migration
-- But let's ensure it's correctly implemented
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a secure policy that only allows users to view their own complete profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- If we need public access to display names for features like user mentions,
-- we should create a separate view or function that only exposes non-sensitive data
-- For now, we'll keep all profile data private to the user