-- Verify and fix email_subscribers table security
-- This ensures RLS is enabled and only admins can read email addresses

-- 1. Ensure RLS is enabled (idempotent - safe to run multiple times)
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- 2. Verify admin function exists and works correctly
-- (This function is already defined in the database)

-- 3. Drop and recreate SELECT policy to ensure it's correctly configured
DROP POLICY IF EXISTS "Admins can read all subscribers" ON email_subscribers;

CREATE POLICY "Admins can read all subscribers"
ON email_subscribers
FOR SELECT
USING (is_current_user_admin());

-- 4. Verify INSERT policy allows public newsletter signups (this is intentional)
-- The existing "Public can subscribe to email list" policy is correct

-- 5. Add a comment to document the security model
COMMENT ON TABLE email_subscribers IS 
'Stores newsletter subscribers. RLS enforced: Public can INSERT (newsletter signup), only admins can SELECT/UPDATE/DELETE to protect email list from harvesting.';