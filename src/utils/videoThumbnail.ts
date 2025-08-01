function formatVideoUrl(url: string): string {
  if (url.startsWith('http')) return url;
  const SUPABASE_URL = "https://adgcrcfbsuwvegxrrrpf.supabase.co";
  return `${SUPABASE_URL}/storage/v1/object/public/videos/${url}`;
}

export async function generateVideoThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(getPlaceholderImage(videoUrl));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    
    const timeout = setTimeout(() => {
      resolve(getPlaceholderImage(videoUrl));
    }, 5000); // 5 second timeout
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 300;
      video.currentTime = 1; // Try 1 second in
    };

    video.onseeked = () => {
      try {
        clearTimeout(timeout);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (error) {
        console.warn('Failed to draw video frame:', error);
        resolve(getPlaceholderImage(videoUrl));
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      resolve(getPlaceholderImage(videoUrl));
    };

    video.src = formatVideoUrl(videoUrl);
  });
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
  const primaryUrl = localizedUrl || originalUrl;
  const cacheKey = primaryUrl || 'no-url';
  
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  // Try localized URL first, then original URL
  const urlsToTry = [localizedUrl, originalUrl].filter(Boolean) as string[];
  
  if (urlsToTry.length === 0) {
    return getPlaceholderImage('no-url');
  }

  // Try the first available URL
  const url = urlsToTry[0];
  const thumbnail = await generateVideoThumbnail(url);
  thumbnailCache.set(cacheKey, thumbnail);
  return thumbnail;
}