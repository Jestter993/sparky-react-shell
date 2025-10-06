-- Verify and strengthen profiles table security
-- Ensures user emails and personal data are protected from public access

-- 1. Ensure RLS is enabled (idempotent - safe to run multiple times)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop and recreate all SELECT policies to ensure clean state
DROP POLICY IF EXISTS "Users can view own profile only" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 3. Create the correct SELECT policy: users see only their own profile
CREATE POLICY "Users can view own profile only"
ON profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 4. Add admin view policy so admins can manage user profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (is_current_user_admin());

-- 5. Add table comment to document security model
COMMENT ON TABLE profiles IS 
'Stores user profile data including emails. RLS enforced: Users can only view/edit their own profile, admins can view all profiles. Emails are protected from public harvesting.';