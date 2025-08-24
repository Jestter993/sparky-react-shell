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
  { value: "he", label: "Hebrew" },
  { value: "ru", label: "Russian" },
];

const ALLOWED_TYPES = ["video/mp4", "video/quicktime"];
const MAX_SIZE_MB = 200; // 200MB

// Utility functions for file size handling
const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const getFileSizeStatus = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  if (mb > MAX_SIZE_MB) {
    return { 
      status: 'error' as const, 
      color: 'text-destructive', 
      message: `Video file too large. Maximum size is ${MAX_SIZE_MB}MB. Please compress your video or use a shorter version.` 
    };
  }
  if (mb > 150) {
    return { 
      status: 'warning-high' as const, 
      color: 'text-orange-600', 
      message: 'Very large file - processing may take 3-5 minutes' 
    };
  }
  if (mb > 50) {
    return { 
      status: 'warning' as const, 
      color: 'text-yellow-600', 
      message: 'Large file - processing may take 2-3 minutes' 
    };
  }
  return { 
    status: 'good' as const, 
    color: 'text-green-600', 
    message: null 
  };
};

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
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError("Only MP4 and MOV videos are supported.");
      return;
    }
    
    // Validate file size with detailed feedback
    const sizeStatus = getFileSizeStatus(f.size);
    if (sizeStatus.status === 'error') {
      setFileError(`${sizeStatus.message} File size: ${formatFileSize(f.size)}`);
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

      // Extract audio sample (8 seconds) for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const videoElement = document.createElement('video');
      const audioBuffer = await extractAudioFromVideo(videoFile, audioContext, videoElement);
      
      if (!audioBuffer) {
        console.error('Failed to extract audio from video');
        setIsDetecting(false);
        return;
      }

      // Convert audio buffer to WAV format
      const wavBuffer = audioBufferToWav(audioBuffer, 16000); // 16kHz sample rate
      const base64Audio = arrayBufferToBase64(wavBuffer);

      // Call edge function for language detection
      const { data, error } = await supabase.functions.invoke('detect-language', {
        body: { 
          audio: base64Audio
        }
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
          // Limit to first 8 seconds for much faster processing
          const duration = Math.min(videoElement.duration, 8);
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

  // Convert AudioBuffer to WAV format with optional sample rate reduction
  function audioBufferToWav(buffer: AudioBuffer, targetSampleRate?: number): ArrayBuffer {
    // Downsample if target sample rate is specified and lower
    let processedBuffer = buffer;
    if (targetSampleRate && targetSampleRate < buffer.sampleRate) {
      processedBuffer = downsampleBuffer(buffer, targetSampleRate);
    }
    
    const length = processedBuffer.length;
    const numberOfChannels = Math.min(processedBuffer.numberOfChannels, 1); // Mono for speed
    const sampleRate = processedBuffer.sampleRate;
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

    // Convert float samples to 16-bit PCM (mono for faster processing)
    let offset = 44;
    for (let i = 0; i < length; i++) {
      // Use only first channel (mono) for language detection speed
      const sample = Math.max(-1, Math.min(1, processedBuffer.getChannelData(0)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
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

  // Downsample audio buffer for faster processing
  function downsampleBuffer(buffer: AudioBuffer, targetSampleRate: number): AudioBuffer {
    if (targetSampleRate === buffer.sampleRate) {
      return buffer;
    }

    const ratio = buffer.sampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const newBuffer = audioContext.createBuffer(1, newLength, targetSampleRate);
    const oldData = buffer.getChannelData(0);
    const newData = newBuffer.getChannelData(0);

    for (let i = 0; i < newLength; i++) {
      const oldIndex = Math.round(i * ratio);
      newData[i] = oldData[oldIndex] || 0;
    }

    return newBuffer;
  }

  // Language change
  function handleSelectTargetLang(val: string) {
    setTargetLang(val);
  }

  const handleLocalize = async () => {
    if (!file || !user) return;

    // Basic validation
    if (!targetLang) {
      toast({
        title: "Please select a target language",
        description: "Choose the language you want to localize your video to.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Navigate immediately to loading page with file data
      navigate("/loading", { 
        state: { 
          file,
          targetLang,
          detectedLanguage,
          userId: user.id
        } 
      });
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
              formatFileSize={formatFileSize}
              getFileSizeStatus={getFileSizeStatus}
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
