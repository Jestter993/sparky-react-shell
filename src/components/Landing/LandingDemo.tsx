
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { formatVideoUrl } from "@/utils/videoUrl";
import { generateVideoThumbnail } from "@/services/thumbnailService";
import { useState, useRef, useEffect } from "react";

const LandingDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const thumbnail = await generateVideoThumbnail(formatVideoUrl("Hero video (1).mp4"));
        setThumbnailUrl(thumbnail);
      } catch (error) {
        console.error("Failed to generate video thumbnail:", error);
      }
    };
    
    generateThumbnail();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(true);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="max-w-4xl w-full mx-auto flex flex-col items-center mb-14 -mt-8">
      <Card className="relative w-full bg-[linear-gradient(135deg,#5A5CFF_0%,#00C9A7_100%)] rounded-2xl p-1 animate-fade-in shadow-xl">
        <div className="overflow-hidden rounded-[1rem] w-full bg-[#0F1117]">
          <div 
            className="relative pt-[56.25%] w-full"
            style={{
              backgroundImage: !isPlaying && thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <video
              ref={videoRef}
              title="Product Capabilities Demo"
              src={formatVideoUrl("Hero video (1).mp4")}
              playsInline
              preload="metadata"
              controls={showControls}
              onEnded={handleVideoEnd}
              onPause={handleVideoPause}
              onPlay={handleVideoPlay}
              className={`absolute top-0 left-0 w-full h-full rounded-[1rem] object-cover ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={handlePlay}
              >
                <div className="bg-white/10 p-3 rounded-full shadow-lg hover:bg-white/20 transition-colors duration-200">
                  <Play size={48} className="text-white drop-shadow" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="mt-3 text-center text-xs text-muted-foreground">Product demo — see nuance in action</div>
    </section>
  );
};

export default LandingDemo;
