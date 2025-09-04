-- Add performance indexes to video_processing_results table

-- Index on status column for filtering by processing status
CREATE INDEX IF NOT EXISTS idx_video_processing_results_status 
ON public.video_processing_results (status);

-- Index on user_id column for user-specific queries and RLS performance
CREATE INDEX IF NOT EXISTS idx_video_processing_results_user_id 
ON public.video_processing_results (user_id);

-- Index on created_at column (descending) for chronological sorting
CREATE INDEX IF NOT EXISTS idx_video_processing_results_created_at 
ON public.video_processing_results (created_at DESC);

-- Composite index for the most common query pattern: user's videos ordered by date
CREATE INDEX IF NOT EXISTS idx_video_processing_results_user_created 
ON public.video_processing_results (user_id, created_at DESC);