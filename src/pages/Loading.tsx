
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LOADING_STEPS = [
  "Uploading video…",
  "Preparing processing…",
  "Starting localization…",
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
  const [videoId, setVideoId] = useState<string | null>(null);

  // Get data from location state (passed from upload page)
  const { file, targetLang, detectedLanguage, userId } = location.state || {};

  useEffect(() => {
    // If no file data, redirect to upload
    if (!file || !targetLang || !userId) {
      navigate("/upload");
      return;
    }

    // Start the upload and processing workflow
    const startProcessing = async () => {
      try {
        // Step 1: Upload video to Supabase Storage
        setCurrentStep(0);
        setProgress((1 / LOADING_STEPS.length) * 100);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        console.log('Uploading file to storage bucket "videos":', fileName);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Error uploading file to storage:", uploadError);
          setError("Failed to upload video. Please try again.");
          return;
        }

        console.log('File uploaded successfully to storage:', uploadData);

        // Step 2: Create database record
        setCurrentStep(1);
        setProgress((2 / LOADING_STEPS.length) * 100);

        const { data: dbData, error: dbError } = await supabase
          .from("video_processing_results")
          .insert({
            user_id: userId,
            original_filename: file.name,
            original_url: uploadData.path,
            target_language: targetLang,
            status: "processing"
          })
          .select()
          .single();

        if (dbError) {
          console.error("Error creating processing record:", dbError);
          setError("Failed to create processing record. Please try again.");
          return;
        }

        console.log('Database record created successfully:', dbData);
        setVideoId(dbData.id);

        // Step 3: Trigger external processing webhook
        setCurrentStep(2);
        setProgress((3 / LOADING_STEPS.length) * 100);

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(uploadData.path);

        const webhookPayload = {
          video_id: dbData.id,
          original_url: publicUrl,
          target_language: targetLang,
          user_id: userId,
          original_filename: file.name
        };

        console.log('Triggering external webhook with payload:', webhookPayload);

        const webhookResponse = await fetch('https://api.adaptrix.io/webhook/localize-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        if (!webhookResponse.ok) {
          console.error('Webhook failed:', await webhookResponse.text());
          setError("Failed to start video processing. Please try again.");
          return;
        }

        console.log('Webhook triggered successfully');

        // Now start the step progression animation for remaining steps
        const stepInterval = setInterval(() => {
          setCurrentStep(prev => {
            // Don't go past the last step - hold there
            if (prev < LOADING_STEPS.length - 1) {
              const nextStep = prev + 1;
              setProgress(((nextStep + 1) / LOADING_STEPS.length) * 100);
              return nextStep;
            }
            return prev;
          });
        }, 4000);

        // Start polling the database every 5 seconds to check status
        const pollInterval = setInterval(async () => {
          try {
            const { data: statusData, error: statusError } = await supabase
              .from("video_processing_results")
              .select("status")
              .eq("id", dbData.id)
              .single();

            if (statusError) {
              console.error("Error polling video status:", statusError);
              return;
            }

            console.log('Current video status:', statusData.status);

            if (statusData.status === "completed") {
              console.log('Processing completed, navigating to results');
              clearInterval(stepInterval);
              clearInterval(pollInterval);
              navigate(`/results/${dbData.id}`);
            } else if (statusData.status === "error") {
              console.log('Processing failed');
              clearInterval(stepInterval);
              clearInterval(pollInterval);
              setError("Video processing failed. Please try again.");
            }
          } catch (err) {
            console.error("Error during polling:", err);
          }
        }, 5000);

        // Cleanup function
        return () => {
          clearInterval(stepInterval);
          clearInterval(pollInterval);
        };
      } catch (error) {
        console.error("Error during processing:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    startProcessing();
  }, [navigate, file, targetLang, userId]);

  const handleCancel = async () => {
    try {
      // If we have a videoId, update the status to cancelled
      if (videoId) {
        await supabase
          .from("video_processing_results")
          .update({ status: "cancelled" })
          .eq("id", videoId);
      }

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
