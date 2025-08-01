export async function generateVideoThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 1 second for better frame quality
      video.currentTime = 1;
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

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = videoUrl;
  });
}

const thumbnailCache = new Map<string, string>();

export async function getCachedThumbnail(videoUrl: string): Promise<string> {
  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl)!;
  }

  try {
    const thumbnail = await generateVideoThumbnail(videoUrl);
    thumbnailCache.set(videoUrl, thumbnail);
    return thumbnail;
  } catch (error) {
    console.warn('Failed to generate thumbnail for:', videoUrl, error);
    // Fallback to placeholder
    const placeholders = [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    ];
    const hash = videoUrl.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return placeholders[Math.abs(hash) % placeholders.length];
  }
}