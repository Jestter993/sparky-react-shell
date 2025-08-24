export const formatVideoUrl = (url: string): string => {
  console.log('[formatVideoUrl] Input URL:', url);
  
  // If it's already a full URL, use it directly
  if (url.startsWith('http')) {
    console.log('[formatVideoUrl] Already full URL, returning as-is:', url);
    return url;
  }

  // Use the exact database value to construct the storage URL
  const baseUrl = `https://adgcrcfbsuwvegxrrrpf.supabase.co/storage/v1/object/public/videos`;
  const finalUrl = `${baseUrl}/${url}`;
  
  console.log('[formatVideoUrl] Constructed URL:', finalUrl);
  // Use the database value exactly as stored (filename)
  return finalUrl;
};