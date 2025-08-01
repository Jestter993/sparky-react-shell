import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export interface UserVideo {
  id: string;
  title: string;
  language: string;
  timeAgo: string;
  status: "Complete" | "Pending" | "Error";
  thumb: string;
  original_url: string | null;
  localized_url: string | null;
  created_at: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

function mapStatusToUI(dbStatus: string): "Complete" | "Pending" | "Error" {
  switch (dbStatus.toLowerCase()) {
    case "completed":
      return "Complete";
    case "error":
    case "failed":
      return "Error";
    default:
      return "Pending";
  }
}

function generateThumbnail(filename: string): string {
  // Use placeholder images for now - could be enhanced to extract actual video thumbnails
  const placeholders = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1498050108023-4542c06a5843?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=400&q=80"
  ];
  
  // Use filename hash to consistently pick the same thumbnail for the same file
  const hash = filename.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return placeholders[Math.abs(hash) % placeholders.length];
}

export function useUserVideos() {
  const { isAuthenticated, user, loading: authLoading } = useAuthStatus();
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated || !user) {
      setVideos([]);
      setLoading(false);
      return;
    }

    fetchUserVideos();
  }, [isAuthenticated, user, authLoading]);

  const fetchUserVideos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("video_processing_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching user videos:", fetchError);
        setError("Failed to load videos");
        return;
      }

      const transformedVideos: UserVideo[] = (data || []).map(video => ({
        id: video.id,
        title: video.original_filename.replace(/\.[^/.]+$/, ""), // Remove file extension
        language: video.target_language,
        timeAgo: formatTimeAgo(video.created_at),
        status: mapStatusToUI(video.status),
        thumb: generateThumbnail(video.original_filename),
        original_url: video.original_url,
        localized_url: video.localized_url,
        created_at: video.created_at
      }));

      setVideos(transformedVideos);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    videos,
    loading,
    error,
    refetch: fetchUserVideos
  };
}