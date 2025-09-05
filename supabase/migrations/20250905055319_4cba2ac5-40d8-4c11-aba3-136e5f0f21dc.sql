-- Add details column to video_feedback table
ALTER TABLE public.video_feedback 
ADD COLUMN details TEXT NULL;