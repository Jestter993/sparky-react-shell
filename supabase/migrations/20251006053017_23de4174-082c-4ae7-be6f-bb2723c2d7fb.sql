-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view own profile only" ON profiles;

-- Create a new SELECT policy with explicit authentication check
CREATE POLICY "Users can view own profile only" ON profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Add a comment explaining the security reasoning
COMMENT ON POLICY "Users can view own profile only" ON profiles IS 
'Explicitly requires authentication and restricts users to viewing only their own profile. The auth.uid() IS NOT NULL check provides defense-in-depth against anonymous access.';