import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LandingNav from "@/components/Landing/LandingNav";
import UploadTitleSection from "@/components/upload/UploadTitleSection";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadFormControls from "@/components/upload/UploadFormControls";
import UploadActionButton from "@/components/upload/UploadActionButton";
import UploadAlphaBanner from "@/components/upload/UploadAlphaBanner";
import UploadProjectsSection from "@/components/upload/UploadProjectsSection";

// Supported language options (keep in main page for now, as they're required across form controls and dropzone)
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "zh", label: "Chinese" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
];

const ALLOWED_TYPES = ["video/mp4", "video/quicktime"];
const MAX_SIZE_MB = 1000; // 1GB

export default function VideoUploadPage() {
  const { isAuthenticated, user, loading } = useAuthStatus();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [targetLang, setTargetLang] = useState("es"); // Default to "Spanish" as in screenshot
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>(undefined);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?mode=login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9fb] relative flex flex-col justify-center items-center font-inter">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5A5CFF]"></div>
      </main>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Handle file input, validate and set errors
  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    validateAndProcessFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    const f = e.dataTransfer.files?.[0];
    validateAndProcessFile(f);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function validateAndProcessFile(f?: File) {
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError("Only MP4 and MOV videos are supported.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`Video must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFileError(null);
    setFile(f);
    setUploading(false);
    
    // Start background language detection
    detectLanguage(f);
  }

  // Wrapper function to clear both file and language detection states
  function clearFile() {
    setFile(null);
    setDetectedLanguage(undefined);
    setIsDetecting(false);
  }

  // Background language detection function
  async function detectLanguage(videoFile: File) {
    try {
      setIsDetecting(true);
      setDetectedLanguage(undefined);

      // Extract audio from video using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const videoElement = document.createElement('video');
      const audioBuffer = await extractAudioFromVideo(videoFile, audioContext, videoElement);
      
      if (!audioBuffer) {
        console.error('Failed to extract audio from video');
        setIsDetecting(false);
        return;
      }

      // Convert audio buffer to WAV format
      const wavBuffer = audioBufferToWav(audioBuffer);
      const base64Audio = arrayBufferToBase64(wavBuffer);

      // Call edge function
      const { data, error } = await supabase.functions.invoke('detect-language', {
        body: { audio: base64Audio }
      });

      if (data && !error) {
        console.log('Language detection result:', data);
        setDetectedLanguage(data.detectedLanguage);
      } else {
        console.error('Language detection error:', error);
      }
    } catch (error) {
      console.error('Error in language detection:', error);
    } finally {
      setIsDetecting(false);
    }
  }

  // Extract audio from video file
  async function extractAudioFromVideo(videoFile: File, audioContext: AudioContext, videoElement: HTMLVideoElement): Promise<AudioBuffer | null> {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(videoFile);
      videoElement.src = objectUrl;
      videoElement.crossOrigin = 'anonymous';
      
      videoElement.addEventListener('loadedmetadata', async () => {
        try {
          // Limit to first 30 seconds for faster processing
          const duration = Math.min(videoElement.duration, 30);
          videoElement.currentTime = 0;
          
          await new Promise(resolve => {
            videoElement.addEventListener('seeked', resolve, { once: true });
          });

          // Create audio source from video
          const source = audioContext.createMediaElementSource(videoElement);
          const destination = audioContext.createMediaStreamDestination();
          source.connect(destination);

          // Record audio stream
          const mediaRecorder = new MediaRecorder(destination.stream, { 
            mimeType: 'audio/webm;codecs=opus' 
          });
          const audioChunks: Blob[] = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            try {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              const arrayBuffer = await audioBlob.arrayBuffer();
              const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
              URL.revokeObjectURL(objectUrl);
              resolve(audioBuffer);
            } catch (error) {
              console.error('Error processing recorded audio:', error);
              URL.revokeObjectURL(objectUrl);
              resolve(null);
            }
          };

          // Start recording and play video
          mediaRecorder.start();
          videoElement.play();
          
          // Stop recording after duration
          setTimeout(() => {
            mediaRecorder.stop();
            videoElement.pause();
          }, duration * 1000);

        } catch (error) {
          console.error('Error setting up audio extraction:', error);
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        }
      });

      videoElement.addEventListener('error', () => {
        console.error('Error loading video for audio extraction');
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      });
    });
  }

  // Convert AudioBuffer to WAV format
  function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  // Convert ArrayBuffer to base64
  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binaryString = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binaryString);
  }

  // Language change
  function handleSelectTargetLang(val: string) {
    setTargetLang(val);
  }

  const handleLocalize = async () => {
    if (!file || !user) return;

    try {
      setUploading(true);

      // Step 1: Upload video to Supabase Storage "videos" bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading file to storage bucket "videos":', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading file to storage:", uploadError);
        toast({
          title: "Upload Error",
          description: "Failed to upload video. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      console.log('File uploaded successfully to storage:', uploadData);

      // Step 2: Insert record into video_processing_results with storage path
      const { data, error } = await supabase
        .from("video_processing_results")
        .insert({
          user_id: user.id,
          original_filename: file.name,
          original_url: uploadData.path, // This is the storage path like "user-id/timestamp.mp4"
          target_language: targetLang,
          status: "processing"
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating processing record:", error);
        toast({
          title: "Database Error",
          description: "Failed to create processing record. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      console.log('Database record created successfully:', data);

      // Step 3: Trigger external processing webhook
      try {
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(uploadData.path);

        const webhookPayload = {
          video_id: data.id,
          original_url: publicUrl,
          target_language: targetLang,
          user_id: user.id,
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
          toast({
            title: "Processing Error",
            description: "Failed to start video processing. Please try again.",
            variant: "destructive",
          });
          setUploading(false);
          return;
        }

        console.log('Webhook triggered successfully');
      } catch (webhookError) {
        console.error('Error triggering webhook:', webhookError);
        toast({
          title: "Processing Error",
          description: "Failed to start video processing. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Step 4: Navigate to loading page with the video ID
      navigate("/loading", { state: { videoId: data.id } });
    } catch (error) {
      console.error("Error starting localization:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9fb] relative flex flex-col font-inter">
      <LandingNav />
      <UploadAlphaBanner />
      <div className="flex-1 flex flex-col w-full h-full px-4 xl:px-[200px] items-center justify-start min-h-0">
        <div className="flex flex-col flex-1 w-full h-full items-center justify-center mt-16 min-h-0">
          <UploadTitleSection />
          <div className="flex-1 w-full flex flex-col min-h-0">
            <UploadDropzone
              file={file}
              fileError={fileError}
              uploading={uploading}
              fileInputRef={fileInputRef}
              handleBrowseClick={handleBrowseClick}
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              setFile={clearFile}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row items-end justify-between gap-4 mt-2">
            <div className="w-full md:w-2/3">
              <UploadFormControls
                targetLang={targetLang}
                onTargetLangChange={handleSelectTargetLang}
                languages={LANGUAGES}
                detectedLanguage={detectedLanguage}
                isDetecting={isDetecting}
              />
            </div>
            <div className="w-full md:w-1/3 flex justify-end">
              <UploadActionButton
                disabled={!file || uploading}
                onClick={handleLocalize}
              />
            </div>
          </div>
        </div>
      </div>
      <UploadProjectsSection />
    </main>
  );
}
