-- Add optional columns to video_processing_results table for enhanced analytics

-- Add processing time tracking column
ALTER TABLE public.video_processing_results 
ADD COLUMN IF NOT EXISTS processing_time_seconds NUMERIC;

-- Add segment count tracking column  
ALTER TABLE public.video_processing_results 
ADD COLUMN IF NOT EXISTS segment_count INTEGER;

-- Add file size tracking column
ALTER TABLE public.video_processing_results 
ADD COLUMN IF NOT EXISTS file_size_mb NUMERIC;