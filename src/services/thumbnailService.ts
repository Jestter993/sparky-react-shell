import { supabase } from "@/integrations/supabase/client";

export interface ThumbnailGenerationResult {
  thumbnailUrl: string;
  success: boolean;
  error?: string;
}

// Generate thumbnail from video element using canvas
export async function generateVideoThumbnail(videoUrl: string, timeInSeconds?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Set canvas dimensions to video dimensions (max 1200px wide for high quality)
      const aspectRatio = video.videoHeight / video.videoWidth;
      canvas.width = Math.min(video.videoWidth, 1200);
      canvas.height = canvas.width * aspectRatio;
      
      // Enable high-quality canvas rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Seek to specified time or 10% of video duration for a good thumbnail frame
      video.currentTime = timeInSeconds !== undefined ? timeInSeconds : video.duration * 0.1;
    };
    
    video.onseeked = () => {
      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read thumbnail'));
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to create thumbnail blob'));
        }
      }, 'image/jpeg', 0.95);
    };
    
    video.onerror = () => reject(new Error('Failed to load video for thumbnail'));
    video.src = videoUrl;
  });
}

// Upload thumbnail to Supabase storage
export async function uploadThumbnail(
  userId: string, 
  videoId: string, 
  thumbnailDataUrl: string
): Promise<string> {
  try {
    // Convert data URL to blob
    const response = await fetch(thumbnailDataUrl);
    const blob = await response.blob();
    
    // Create file path: userId/videoId.jpg
    const filePath = `${userId}/${videoId}.jpg`;
    
    // Upload to thumbnails bucket
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true // Overwrite if exists
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Return the public URL
    const { data: publicUrlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    throw error;
  }
}

// Generate and store thumbnail for a video
export async function generateAndStoreThumbnail(
  videoId: string,
  videoUrl: string,
  userId: string
): Promise<ThumbnailGenerationResult> {
  try {
    console.log(`[Thumbnail] Generating thumbnail for video ${videoId}`);
    
    // Generate thumbnail from video
    const thumbnailDataUrl = await generateVideoThumbnail(videoUrl);
    console.log(`[Thumbnail] Generated thumbnail data URL`);
    
    // Upload to Supabase storage
    const thumbnailUrl = await uploadThumbnail(userId, videoId, thumbnailDataUrl);
    console.log(`[Thumbnail] Uploaded thumbnail to:`, thumbnailUrl);
    
    // Update the database record
    const { error: updateError } = await supabase
      .from('video_processing_results')
      .update({ thumbnail_url: thumbnailUrl })
      .eq('id', videoId);

    if (updateError) {
      console.error('[Thumbnail] Database update error:', updateError);
      return {
        thumbnailUrl: '',
        success: false,
        error: `Database update failed: ${updateError.message}`
      };
    }

    console.log(`[Thumbnail] Successfully stored thumbnail for video ${videoId}`);
    
    return {
      thumbnailUrl,
      success: true
    };
  } catch (error) {
    console.error(`[Thumbnail] Generation failed for video ${videoId}:`, error);
    return {
      thumbnailUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fallback placeholder generation (consistent based on video ID)
export function generatePlaceholderThumbnail(videoId: string): string {
  const placeholders = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80", 
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
  ];
  
  // Use video ID for consistent placeholder selection
  const hash = videoId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return placeholders[Math.abs(hash) % placeholders.length];
}