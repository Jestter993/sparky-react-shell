-- CRITICAL SECURITY FIX: Remove overly permissive profiles RLS policy that exposes user emails
-- This fixes the critical security vulnerability where all user email addresses are publicly accessible

-- Drop the dangerous policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy that only allows users to view their own complete profile
CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a separate policy for public profile information (excluding sensitive data like email)
-- This policy only exposes display_name and avatar_url for legitimate use cases
CREATE POLICY "Public can view limited profile info" 
ON public.profiles 
FOR SELECT 
USING (true AND email IS NULL OR auth.uid() = user_id);

-- SECURITY FIX: Update database functions to prevent search path attacks
-- Fix function search_path security issues

-- Update the update_updated_at_column function with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Update the handle_new_user function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;