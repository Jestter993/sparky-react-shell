-- Fix the storage policy for uploads - restrict to videos bucket only
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'videos');