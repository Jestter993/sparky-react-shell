
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { supabase } from "@/integrations/supabase/client";
import LandingNav from "@/components/Landing/LandingNav";
import ResultsContent from "@/components/results/ResultsContent";
import ResultsError from "@/components/results/ResultsError";
import ResultsLoading from "@/components/results/ResultsLoading";

interface VideoResult {
  id: string;
  original_filename: string;
  original_url: string | null;
  localized_url: string | null;
  target_language: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

export default function ResultsPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthStatus();
  
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth?mode=login");
      return;
    }

    if (!videoId) {
      setError("Video ID not found");
      setLoading(false);
      return;
    }

    fetchVideoResult();
  }, [videoId, isAuthenticated, authLoading, navigate]);

  const fetchVideoResult = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("video_processing_results")
        .select("*")
        .eq("id", videoId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching video result:", fetchError);
        setError("Failed to fetch video details");
        return;
      }

      if (!data) {
        setError("Video not found");
        return;
      }

      setVideoResult(data);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <ResultsLoading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <ResultsLoading />;
  }

  if (error || !videoResult) {
    return <ResultsError error={error || "Video not found"} />;
  }

  return (
    <main className="min-h-screen bg-[#F5F8FA] font-inter">
      <LandingNav />
      <ResultsContent 
        videoResult={videoResult} 
        onRefresh={fetchVideoResult}
      />
    </main>
  );
}
