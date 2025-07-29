
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LOADING_STEPS = [
  "Uploading video…",
  "Transcribing audio…", 
  "Translating & adapting content…",
  "Generating localized video…",
  "Finalizing your video…"
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Get videoId from location state (passed from upload page)
  const videoId = location.state?.videoId;

  useEffect(() => {
    // If no videoId, redirect to upload
    if (!videoId) {
      navigate("/upload");
      return;
    }

    // Start step progression animation - hold at final step when reached
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        // Don't go past the last step - hold there
        if (prev < LOADING_STEPS.length - 1) {
          const nextStep = prev + 1;
          setProgress(((nextStep + 1) / LOADING_STEPS.length) * 100);
          return nextStep;
        }
        // Stay at final step and keep progress at 100%
        return prev;
      });
    }, 4000); // Each step takes 4 seconds for better readability

    // Start polling the database every 5 seconds to check status
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("video_processing_results")
          .select("status")
          .eq("id", videoId)
          .single();

        if (error) {
          console.error("Error polling video status:", error);
          return;
        }

        console.log('Current video status:', data.status);

        if (data.status === "completed") {
          console.log('Processing completed, navigating to results');
          clearInterval(stepInterval);
          clearInterval(pollInterval);
          navigate(`/results/${videoId}`);
        } else if (data.status === "error") {
          console.log('Processing failed');
          clearInterval(stepInterval);
          clearInterval(pollInterval);
          setError("Video processing failed. Please try again.");
        }
      } catch (err) {
        console.error("Error during polling:", err);
      }
    }, 5000); // Poll every 5 seconds

    // Set initial progress
    setProgress((1 / LOADING_STEPS.length) * 100);

    // Cleanup intervals
    return () => {
      clearInterval(stepInterval);
      clearInterval(pollInterval);
    };
  }, [navigate, videoId]);

  const handleCancel = async () => {
    if (!videoId) {
      navigate("/upload");
      return;
    }

    try {
      // Update the processing status to cancelled in the database
      await supabase
        .from("video_processing_results")
        .update({ status: "cancelled" })
        .eq("id", videoId);

      // Show toast notification
      toast({
        title: "Localization cancelled",
        description: "The localization process has been stopped.",
      });

      // Navigate back to upload page
      navigate("/upload");
    } catch (error) {
      console.error("Error cancelling localization:", error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to cancel localization. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-[#F5F8FA] flex flex-col items-center justify-center font-inter px-4">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          <div className="text-destructive text-lg font-medium">
            {error}
          </div>
          <Button 
            onClick={() => navigate("/upload")}
            className="bg-[#5A5CFF] hover:bg-[#4A4CFF] text-white font-semibold px-8 py-2"
          >
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F8FA] flex flex-col items-center justify-center font-inter px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Adaptrix Logo */}
        <div className="mb-4">
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
            Adaptrix
          </span>
        </div>

        {/* Animated Loader */}
        <div className="relative">
          <Loader2 
            className="h-16 w-16 animate-spin text-[#5A5CFF]" 
            strokeWidth={2}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] opacity-20 animate-pulse"></div>
        </div>

        {/* Progress Bar - Fixed width container */}
        <div className="w-full">
          <Progress 
            value={progress} 
            className="h-2 bg-[#E5E7EB] w-full"
          />
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-[#0F1117] text-lg font-medium animate-fade-in">
            {LOADING_STEPS[currentStep]}
          </div>
          <div className="text-[#6B7280] text-sm">
            Step {currentStep + 1} of {LOADING_STEPS.length}
          </div>
        </div>

        {/* Cancel Button */}
        <Button
          variant="outline"
          onClick={handleCancel}
          className="border-[#0F1117] text-[#0F1117] hover:bg-[#0F1117]/10 font-medium px-6 py-2 mt-4"
        >
          Cancel
        </Button>
      </div>
    </main>
  );
}
