-- Drop RLS policies first
DROP POLICY IF EXISTS "Allow users to insert their own videos" ON public.processed_videos;
DROP POLICY IF EXISTS "Allow users to read their own videos" ON public.processed_videos;

-- Drop the unused table
DROP TABLE IF EXISTS public.processed_videos;