function formatVideoUrl(url: string): string {
  if (url.startsWith('http')) return url;
  const SUPABASE_URL = "https://adgcrcfbsuwvegxrrrpf.supabase.co";
  return `${SUPABASE_URL}/storage/v1/object/public/videos/${url}`;
}

async function attemptThumbnailGeneration(videoUrl: string, withCors: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }

    if (withCors) {
      video.crossOrigin = 'anonymous';
    }
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = (e) => {
      const errorType = withCors ? 'CORS' : 'LOAD';
      reject(new Error(`${errorType}: Failed to load video - ${e}`));
    };

    video.src = formatVideoUrl(videoUrl);
  });
}

export async function generateVideoThumbnail(videoUrl: string): Promise<string> {
  const formattedUrl = formatVideoUrl(videoUrl);
  
  // Try without CORS first
  try {
    return await attemptThumbnailGeneration(videoUrl, false);
  } catch (error) {
    console.warn('Failed without CORS, trying with CORS:', error);
    
    // Retry with CORS
    try {
      return await attemptThumbnailGeneration(videoUrl, true);
    } catch (corsError) {
      console.warn('Failed with CORS:', corsError);
      throw corsError;
    }
  }
}

const thumbnailCache = new Map<string, string>();

export async function getCachedThumbnail(localizedUrl: string | null, originalUrl: string | null): Promise<string> {
  const primaryUrl = localizedUrl || originalUrl;
  const cacheKey = primaryUrl || 'no-url';
  
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  // Try localized URL first, then original URL
  const urlsToTry = [localizedUrl, originalUrl].filter(Boolean) as string[];
  
  for (const url of urlsToTry) {
    try {
      console.log('Attempting thumbnail generation for:', url);
      const thumbnail = await generateVideoThumbnail(url);
      thumbnailCache.set(cacheKey, thumbnail);
      return thumbnail;
    } catch (error) {
      console.warn('Failed to generate thumbnail for:', url, error);
    }
  }

  // All URLs failed, return placeholder
  console.warn('All URLs failed, using placeholder');
  const placeholders = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
  ];
  const hash = cacheKey.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return placeholders[Math.abs(hash) % placeholders.length];
}