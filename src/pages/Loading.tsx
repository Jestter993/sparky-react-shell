
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStatus } from "@/hooks/useAuthStatus";

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
  const { user, isAuthenticated, loading: authLoading } = useAuthStatus();
  const hasStartedProcessingRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Get data from location state (passed from upload page)
  const { file, targetLang, detectedLanguage, userId } = location.state || {};

  // Enhanced authentication validation
  const validateUserAuth = (user: any) => {
    if (!user) return { valid: false, error: "You must be logged in to upload videos" };
    if (!user.id) return { valid: false, error: "Invalid user session. Please log in again." };
    if (!user.email_confirmed_at) return { valid: false, error: "Please confirm your email before uploading videos" };
    return { valid: true, error: null };
  };

  useEffect(() => {
    // Guard against multiple executions
    if (hasStartedProcessingRef.current) {
      return;
    }

    // Wait for auth to load
    if (authLoading) return;

    // Enhanced authentication checks
    if (!isAuthenticated) {
      setError("You must be logged in to process videos");
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      navigate("/auth?mode=login");
      return;
    }

    const authValidation = validateUserAuth(user);
    if (!authValidation.valid) {
      setError(authValidation.error);
      toast({
        title: "Authentication Error",
        description: authValidation.error,
        variant: "destructive",
      });
      navigate("/auth?mode=login");
      return;
    }

    // If no file data, redirect to upload
    if (!file || !targetLang || !userId) {
      navigate("/upload");
      return;
    }

    // Additional userId validation
    if (!userId) {
      setError("You must be logged in to upload videos");
      navigate("/auth?mode=login");
      return;
    }

    // Start the upload and processing workflow
    const startProcessing = async () => {
      // Set guard flag HERE - after all validation passes
      hasStartedProcessingRef.current = true;
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

        const downloadUrl = `https://adgcrcfbsuwvegxrrrpf.supabase.co/storage/v1/object/videos/${uploadData.path}`;

const webhookPayload = {
  video_id: dbData.id,
  original_url: downloadUrl,
  target_language: targetLang,
  user_id: userId,
  original_filename: file.name
};

        console.log('Triggering external webhook with payload:', webhookPayload);

        // Use your working webhook URL (replace with your actual working endpoint)
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
              .select("status, error_message")
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
              console.log('Processing failed:', statusData.error_message);
              clearInterval(stepInterval);
              clearInterval(pollInterval);
              setError(statusData.error_message || "Video processing failed. Please try again.");
            }
          } catch (err) {
            console.error("Error during polling:", err);
          }
        }, 5000);

        // Add timeout after 10 minutes to prevent infinite loading
        const timeoutInterval = setTimeout(() => {
          console.log('Processing timeout reached');
          clearInterval(stepInterval);
          clearInterval(pollInterval);
          setError("Processing is taking longer than expected. The backend service may be experiencing issues. Please try again later.");
        }, 10 * 60 * 1000); // 10 minutes

        // Cleanup function
        return () => {
          clearInterval(stepInterval);
          clearInterval(pollInterval);
          clearTimeout(timeoutInterval);
        };
      } catch (error) {
        console.error("Error during processing:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    startProcessing();
  }, [navigate, file, targetLang, userId, isAuthenticated, user, authLoading, toast]);

  const handleCancel = async () => {
    try {
      // If we have a videoId, delete the record and associated storage files
      if (videoId) {
        // First, get the record to find the original_url for storage cleanup
        const { data: videoRecord } = await supabase
          .from("video_processing_results")
          .select("original_url")
          .eq("id", videoId)
          .single();

        // Delete the database record
        await supabase
          .from("video_processing_results")
          .delete()
          .eq("id", videoId);

        // Clean up storage file if it exists
        if (videoRecord?.original_url) {
          await supabase.storage
            .from('videos')
            .remove([videoRecord.original_url]);
        }
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
