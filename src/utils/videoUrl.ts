export const formatVideoUrl = (url: string): string => {
  console.log('[formatVideoUrl] Input URL:', url);
  
  // If it's already a full URL, use it directly
  if (url.startsWith('http')) {
    console.log('[formatVideoUrl] Already full URL, returning as-is:', url);
    return url;
  }

  // Use the exact database value to construct the storage URL
  const baseUrl = `https://adgcrcfbsuwvegxrrrpf.supabase.co/storage/v1/object/public/videos`;
  
  // CRITICAL FIX: Properly encode the URL to handle spaces and special characters
  const encodedUrl = encodeURIComponent(url);
  const finalUrl = `${baseUrl}/${encodedUrl}`;
  
  console.log('[formatVideoUrl] Encoded URL:', encodedUrl);
  console.log('[formatVideoUrl] Final URL:', finalUrl);
  
  return finalUrl;
};