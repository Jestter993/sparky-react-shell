import { formatVideoUrl } from './videoUrl';

function generateUrlVariants(url: string): string[] {
  if (url.startsWith('http')) return [url];
  
  const SUPABASE_URL = "https://adgcrcfbsuwvegxrrrpf.supabase.co";
  const variants = [];
  
  // Clean the URL from any videos/ prefix
  const cleanUrl = url.replace(/^videos\//, '');
  
  // Check if URL contains UUID pattern (original videos have UUID folder structure)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;
  const hasUuidFolder = uuidPattern.test(cleanUrl);
  
  if (hasUuidFolder) {
    // Original video with UUID folder structure
    console.log(`🗂️ Detected UUID folder structure: ${cleanUrl}`);
    variants.push(`${SUPABASE_URL}/storage/v1/object/public/videos/${cleanUrl}`);
    // Also try without the videos/ prefix in case storage structure changed
    variants.push(`${SUPABASE_URL}/storage/v1/object/public/${cleanUrl}`);
  } else {
    // Localized video with direct filename
    console.log(`📄 Detected direct filename: ${cleanUrl}`);
    // Try standard videos folder first
    variants.push(`${SUPABASE_URL}/storage/v1/object/public/videos/${cleanUrl}`);
    // Try root storage path
    variants.push(`${SUPABASE_URL}/storage/v1/object/public/${cleanUrl}`);
    // Try with videos/ prefix if not already present
    if (!url.startsWith('videos/')) {
      variants.push(`${SUPABASE_URL}/storage/v1/object/public/videos/${url}`);
    }
  }
  
  return variants;
}

async function attemptThumbnailAtTime(videoUrl: string, timePosition: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('No canvas context'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout at ${timePosition}s`));
    }, 3000);
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 300;
      const seekTime = Math.min(timePosition, video.duration - 0.1);
      video.currentTime = Math.max(0, seekTime);
    };

    video.onseeked = () => {
      try {
        clearTimeout(timeout);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Video load error'));
    };

    video.src = videoUrl;
  });
}

export async function generateVideoThumbnail(videoUrl: string): Promise<string> {
  const urlVariants = generateUrlVariants(videoUrl);
  const timePositions = [0.1, 0.5, 1.0];
  
  console.log('🎬 Generating thumbnail for:', videoUrl);
  console.log('📍 URL variants:', urlVariants);
  
  for (const url of urlVariants) {
    console.log(`🔍 Trying URL: ${url}`);
    
    for (const time of timePositions) {
      try {
        const thumbnail = await attemptThumbnailAtTime(url, time);
        console.log(`✅ Success at ${time}s with URL: ${url}`);
        return thumbnail;
      } catch (error) {
        console.log(`❌ Failed at ${time}s: ${error.message}`);
      }
    }
  }
  
  console.log('🖼️ All attempts failed, using placeholder');
  return getPlaceholderImage(videoUrl);
}

function getPlaceholderImage(url: string): string {
  const placeholders = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
  ];
  const hash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return placeholders[Math.abs(hash) % placeholders.length];
}

const thumbnailCache = new Map<string, string>();

export async function getCachedThumbnail(localizedUrl: string | null, originalUrl: string | null): Promise<string> {
  try {
    const primaryUrl = localizedUrl || originalUrl;
    const cacheKey = primaryUrl || 'no-url';
    
    if (thumbnailCache.has(cacheKey)) {
      return thumbnailCache.get(cacheKey)!;
    }

    // Try localized URL first, then original URL
    const urlsToTry = [localizedUrl, originalUrl].filter(Boolean) as string[];
    
    if (urlsToTry.length === 0) {
      console.log('📭 No URLs available for thumbnail generation');
      const placeholder = getPlaceholderImage('no-url');
      thumbnailCache.set(cacheKey, placeholder);
      return placeholder;
    }

    console.log('🎯 Attempting thumbnail generation for URLs:', urlsToTry);

    // Try each URL until one succeeds
    for (const url of urlsToTry) {
      try {
        console.log(`🎬 Trying thumbnail for: ${url}`);
        const formattedUrl = formatVideoUrl(url);
        console.log(`📝 Formatted URL: ${formattedUrl}`);
        const thumbnail = await generateVideoThumbnail(formattedUrl);
        
        // Check if we got a real thumbnail (not a placeholder)
        if (!thumbnail.startsWith('https://images.unsplash.com/')) {
          console.log(`✅ Successfully generated thumbnail for: ${url}`);
          thumbnailCache.set(cacheKey, thumbnail);
          return thumbnail;
        }
      } catch (error) {
        console.log(`❌ Failed to generate thumbnail for: ${url}`, error);
      }
    }

    // All URLs failed, return placeholder
    console.log('🖼️ All URLs failed, caching placeholder');
    const placeholder = getPlaceholderImage(cacheKey);
    thumbnailCache.set(cacheKey, placeholder);
    return placeholder;
  } catch (error) {
    // Ultimate fallback - this should never throw
    console.error('🚨 Unexpected error in getCachedThumbnail:', error);
    return getPlaceholderImage('error-fallback');
  }
}