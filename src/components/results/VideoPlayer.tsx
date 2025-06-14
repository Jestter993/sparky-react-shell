
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  videoUrl: string | null;
  isOriginal: boolean;
}

export default function VideoPlayer({ videoUrl, isOriginal }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  React.useEffect(() => {
    const getVideoUrl = async () => {
      if (!videoUrl) {
        setFinalVideoUrl(null);
        setLoading(false);
        return;
      }

      // If it's already a full URL, use it directly
      if (videoUrl.startsWith('http')) {
        setFinalVideoUrl(videoUrl);
        setLoading(false);
        return;
      }

      // If it's a storage path, get the public URL
      try {
        const { data } = supabase.storage
          .from('videos')
          .getPublicUrl(videoUrl);
        
        setFinalVideoUrl(data.publicUrl);
      } catch (err) {
        console.error('Error getting video URL:', err);
        setError(true);
      }
      setLoading(false);
    };

    getVideoUrl();
  }, [videoUrl]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (!videoUrl) {
    return (
      <Card className="h-80">
        <CardContent className="flex flex-col items-center justify-center h-80 text-[#6B7280]">
          <AlertCircle className="w-12 h-12 mb-2 text-[#6B7280]" />
          <p>Video not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-80">
      <CardContent className="relative h-80 p-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
            <Skeleton className="w-full h-full" />
            <div className="absolute flex items-center gap-2 text-[#6B7280]">
              <Play className="w-6 h-6" />
              <span>Loading video...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded text-[#6B7280]">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>Failed to load video</p>
          </div>
        )}

        {finalVideoUrl && (
          <video
            src={finalVideoUrl}
            controls
            className={`w-full h-full object-contain rounded ${loading ? "opacity-0" : "opacity-100"}`}
            onLoadStart={handleLoadStart}
            onCanPlay={handleCanPlay}
            onError={handleError}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </CardContent>
    </Card>
  );
}
