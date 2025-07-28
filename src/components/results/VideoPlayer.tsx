
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, AlertCircle, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  videoUrl: string | null;
  isOriginal: boolean;
}

export default function VideoPlayer({ videoUrl, isOriginal }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const formatVideoUrl = (url: string): string => {
    // If it's already a full URL, use it directly
    if (url.startsWith('http')) {
      return url;
    }

    // If it's a storage path, format it properly
    const baseUrl = `https://adgcrcfbsuwvegxrrrpf.supabase.co/storage/v1/object/public/videos`;
    
    // Remove leading slash if present and ensure no double slashes
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    
    // Construct URL with single slash, ensuring no double slashes
    return `${baseUrl}/${cleanPath}`;
  };

  const checkVideoAvailability = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const getVideoUrl = async () => {
      if (!videoUrl) {
        setFinalVideoUrl(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);
      setIsProcessing(false);

      try {
        let formattedUrl = formatVideoUrl(videoUrl);
        
        // Check if video is available
        const isAvailable = await checkVideoAvailability(formattedUrl);
        
        if (isAvailable) {
          setFinalVideoUrl(formattedUrl);
          setLoading(false);
        } else if (!isOriginal) {
          // For localized videos, it might still be processing
          setIsProcessing(true);
          setLoading(false);
        } else {
          // For original videos, show error if not available
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error processing video URL:', err);
        setError(true);
        setLoading(false);
      }
    };

    getVideoUrl();
  }, [videoUrl, isOriginal, retryCount]);

  // Auto-refresh for processing videos
  useEffect(() => {
    if (isProcessing && !isOriginal) {
      const interval = setInterval(() => {
        setRetryCount(prev => prev + 1);
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isProcessing, isOriginal]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleCanPlay = () => {
    setLoading(false);
    setIsProcessing(false);
  };

  const handleError = () => {
    setLoading(false);
    if (!isOriginal) {
      setIsProcessing(true);
    } else {
      setError(true);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
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
        
        {isProcessing && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded text-[#6B7280]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A5CFF] mb-4"></div>
            <p className="text-center mb-2">Video processing...</p>
            <p className="text-sm text-center mb-4">
              Your localized video is being generated. This may take a few minutes.
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 text-[#5A5CFF] hover:text-[#4A4CFF] text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Check again
            </button>
          </div>
        )}
        
        {error && !loading && !isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded text-[#6B7280]">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-center mb-2">Failed to load video</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 text-[#5A5CFF] hover:text-[#4A4CFF] text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
          </div>
        )}

        {finalVideoUrl && !loading && !isProcessing && (
          <video
            src={finalVideoUrl}
            controls
            className="w-full h-full object-contain rounded"
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
