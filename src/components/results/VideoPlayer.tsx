
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, AlertCircle } from "lucide-react";

interface Props {
  title: string;
  videoUrl: string | null;
  isOriginal: boolean;
}

export default function VideoPlayer({ title, videoUrl, isOriginal }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0F1117]">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
          <AlertCircle className="w-12 h-12 mb-2 text-[#6B7280]" />
          <p>Video not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F1117]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-64">
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

        <video
          src={videoUrl}
          controls
          className={`w-full h-full object-contain rounded ${loading ? "opacity-0" : "opacity-100"}`}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </CardContent>
    </Card>
  );
}
