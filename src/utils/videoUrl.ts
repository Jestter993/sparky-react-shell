export const formatVideoUrl = (url: string): string => {
  // If it's already a full URL, use it directly
  if (url.startsWith('http')) {
    return url;
  }

  // Use the exact database value to construct the storage URL
  const baseUrl = `https://adgcrcfbsuwvegxrrrpf.supabase.co/storage/v1/object/public/videos`;
  
  // Use the database value exactly as stored (filename)
  return `${baseUrl}/${url}`;
};