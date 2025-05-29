
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const LOADING_STEPS = [
  "Uploading video…",
  "Transcribing audio…", 
  "Translating & adapting content…",
  "Generating localized video…"
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate processing steps - in real app this would listen to backend events
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < LOADING_STEPS.length - 1) {
          const nextStep = prev + 1;
          setProgress((nextStep / LOADING_STEPS.length) * 100);
          return nextStep;
        } else {
          // Processing complete - redirect to results or upload page
          clearInterval(stepInterval);
          setTimeout(() => {
            navigate("/upload"); // Replace with results page when available
          }, 2000);
          return prev;
        }
      });
    }, 3000); // Each step takes 3 seconds for demo

    // Set initial progress
    setProgress((1 / LOADING_STEPS.length) * 100);

    // Cleanup
    return () => clearInterval(stepInterval);
  }, [navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  if (error) {
    return (
      <main className="min-h-screen bg-[#F5F8FA] flex flex-col items-center justify-center font-inter px-4">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          <div className="text-destructive text-lg font-medium">
            Something went wrong. Please try again.
          </div>
          <Button 
            onClick={() => navigate("/")}
            className="bg-[#5A5CFF] hover:bg-[#4A4CFF] text-white font-semibold px-8 py-2"
          >
            Go back home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F8FA] flex flex-col items-center justify-center font-inter px-4">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">
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

        {/* Progress Bar */}
        <div className="w-full max-w-sm">
          <Progress 
            value={progress} 
            className="h-2 bg-[#E5E7EB]"
          />
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center gap-2">
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
