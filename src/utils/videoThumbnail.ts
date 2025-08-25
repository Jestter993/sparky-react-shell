import { supabase } from "@/integrations/supabase/client";
import { 
  generateAndStoreThumbnail, 
  generatePlaceholderThumbnail 
} from "@/services/thumbnailService";
import { formatVideoUrl } from "./videoUrl";

// Get or generate thumbnail for a video
export async function getVideoThumbnail(
  videoId: string,
  existingThumbnailUrl: string | null,
  videoUrl: string | null,
  userId: string
): Promise<string> {
  // If we already have a stored thumbnail, return it
  if (existingThumbnailUrl) {
    console.log(`[Thumbnail] Using stored thumbnail for ${videoId}:`, existingThumbnailUrl);
    return existingThumbnailUrl;
  }

  // If no video URL available, return placeholder
  if (!videoUrl) {
    console.log(`[Thumbnail] No video URL for ${videoId}, using placeholder`);
    return generatePlaceholderThumbnail(videoId);
  }

  // Format the video URL for access
  const formattedVideoUrl = formatVideoUrl(videoUrl);
  
  // Try to generate and store actual thumbnail
  try {
    console.log(`[Thumbnail] Attempting to generate thumbnail for ${videoId}`);
    const result = await generateAndStoreThumbnail(videoId, formattedVideoUrl, userId);
    
    if (result.success && result.thumbnailUrl) {
      return result.thumbnailUrl;
    } else {
      console.warn(`[Thumbnail] Generation failed for ${videoId}:`, result.error);
      return generatePlaceholderThumbnail(videoId);
    }
  } catch (error) {
    console.error(`[Thumbnail] Error generating thumbnail for ${videoId}:`, error);
    return generatePlaceholderThumbnail(videoId);
  }
}

// Legacy function for backwards compatibility
export async function generateVideoThumbnail(videoUrl: string): Promise<string> {
  // This now just returns a placeholder based on URL
  return generatePlaceholderThumbnail(videoUrl);
}

// Updated function for getting cached thumbnails with proper persistence
export async function getCachedThumbnail(
  videoId: string,
  storedThumbnailUrl: string | null,
  localizedUrl: string | null, 
  originalUrl: string | null,
  userId: string
): Promise<string> {
  // Use the primary video URL (prefer localized)
  const primaryUrl = localizedUrl || originalUrl;
  
  return await getVideoThumbnail(videoId, storedThumbnailUrl, primaryUrl, userId);
}