export const formatVideoUrl = (url: string): string => {
  console.log('[formatVideoUrl] Input URL:', url);
  
  // If it's already a full URL, use it directly
  if (url.startsWith('http')) {
    console.log('[formatVideoUrl] Already full URL, returning as-is:', url);
    return url;
  }

  // Use the exact database value to construct the storage URL
  const baseUrl = `https://adgcrcfbsuwvegxrrrpf.supabase.co/storage/v1/object/public/videos`;
  
  // CRITICAL FIX: Handle both folder structure and direct filenames
  // If URL contains a slash, it's a folder structure (original videos)
  // If no slash, it's a direct filename (localized videos) that needs encoding
  let finalUrl: string;
  
  if (url.includes('/')) {
    // Original video with folder structure - don't encode the slash
    const parts = url.split('/');
    const encodedParts = parts.map(part => encodeURIComponent(part));
    finalUrl = `${baseUrl}/${encodedParts.join('/')}`;
  } else {
    // Localized video filename - encode the entire filename
    const encodedUrl = encodeURIComponent(url);
    finalUrl = `${baseUrl}/${encodedUrl}`;
  }
  
  console.log('[formatVideoUrl] Final URL:', finalUrl);
  
  return finalUrl;
};