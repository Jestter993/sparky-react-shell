
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, AlertCircle, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatVideoUrl } from "@/utils/videoUrl";

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
  const [videoLoading, setVideoLoading] = useState(false);


  const checkVideoAvailability = async (url: string): Promise<boolean> => {
    try {
      console.log(`[VideoPlayer] HEAD request to:`, url);
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`[VideoPlayer] HEAD response status:`, response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error(`[VideoPlayer] HEAD request failed:`, error);
      return false;
    }
  };

  useEffect(() => {
    const getVideoUrl = async () => {
      console.log(`[VideoPlayer] Processing ${isOriginal ? 'original' : 'localized'} video URL:`, videoUrl);
      
      if (!videoUrl) {
        console.log('[VideoPlayer] No video URL provided');
        setFinalVideoUrl(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);
      setIsProcessing(false);

      try {
        let formattedUrl = formatVideoUrl(videoUrl);
        console.log(`[VideoPlayer] Formatted URL:`, formattedUrl);
        
        // Check if video is available
        console.log(`[VideoPlayer] Checking availability of:`, formattedUrl);
        const isAvailable = await checkVideoAvailability(formattedUrl);
        console.log(`[VideoPlayer] Video available:`, isAvailable);
        
        if (isAvailable) {
          console.log(`[VideoPlayer] Setting final URL:`, formattedUrl);
          setFinalVideoUrl(formattedUrl);
          setLoading(false);
        } else if (!isOriginal) {
          // For localized videos, it might still be processing
          console.log('[VideoPlayer] Localized video not available, setting processing state');
          setIsProcessing(true);
          setLoading(false);
        } else {
          // For original videos, show error if not available
          console.log('[VideoPlayer] Original video not available, setting error state');
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('[VideoPlayer] Error processing video URL:', err);
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
    console.log(`[VideoPlayer] Load start for ${isOriginal ? 'original' : 'localized'} video:`, finalVideoUrl);
    setVideoLoading(true);
    setError(false);
  };

  const handleCanPlay = () => {
    console.log(`[VideoPlayer] Can play ${isOriginal ? 'original' : 'localized'} video:`, finalVideoUrl);
    setVideoLoading(false);
    setIsProcessing(false);
  };

  const handleError = (e: any) => {
    console.error(`[VideoPlayer] Video error for ${isOriginal ? 'original' : 'localized'} video:`, finalVideoUrl, e);
    setVideoLoading(false);
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
          <>
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
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                <div className="flex items-center gap-2 text-white">
                  <Play className="w-6 h-6" />
                  <span>Loading video...</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
