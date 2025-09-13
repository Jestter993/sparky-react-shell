
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

const LandingDemo = () => (
  <section className="max-w-4xl w-full mx-auto flex flex-col items-center mb-14 -mt-8">
    <Card className="relative w-full bg-[linear-gradient(135deg,#5A5CFF_0%,#00C9A7_100%)] rounded-2xl p-1 animate-fade-in shadow-xl">
      <div className="overflow-hidden rounded-[1rem] w-full bg-[#0F1117]">
        <div className="relative pt-[56.25%] w-full">
          <video
            title="Product Capabilities Demo"
            src="/lovable-uploads/Hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full rounded-[1rem] object-cover"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Subtle overlay play button hint */}
            <div className="bg-white/10 p-3 rounded-full shadow-lg animate-pulse">
              <Play size={48} className="text-white drop-shadow" />
            </div>
          </div>
        </div>
      </div>
    </Card>
    <div className="mt-3 text-center text-xs text-muted-foreground">Product demo — see nuance in action</div>
  </section>
);

export default LandingDemo;
