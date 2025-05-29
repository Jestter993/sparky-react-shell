import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
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
  { value: "ja", label: "Japanese" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
];

const ALLOWED_TYPES = ["video/mp4", "video/quicktime"];
const MAX_SIZE_MB = 1000; // 1GB

export default function VideoUploadPage() {
  const { isAuthenticated, loading } = useAuthStatus();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [targetLang, setTargetLang] = useState("es"); // Default to "Spanish" as in screenshot
  const [subtitles, setSubtitles] = useState(true); // Checked as in screenshot

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
  }

  // Language change
  function handleSelectTargetLang(val: string) {
    setTargetLang(val);
  }

  // Subtitles switch
  function handleSubtitlesChange(checked: boolean) {
    setSubtitles(!!checked);
  }

  const handleLocalize = async () => {
    if (!file) return;

    try {
      setUploading(true);

      // Create a processing record in the database
      const { data, error } = await supabase
        .from("video_processing_results")
        .insert({
          original_filename: file.name,
          target_language: targetLang,
          status: "processing"
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating processing record:", error);
        setUploading(false);
        return;
      }

      // Navigate to loading page with the video ID
      navigate("/loading", { state: { videoId: data.id } });
    } catch (error) {
      console.error("Error starting localization:", error);
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
              setFile={setFile}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5 mt-2">
            <div className="w-full md:w-2/3">
              <UploadFormControls
                targetLang={targetLang}
                onTargetLangChange={handleSelectTargetLang}
                subtitles={subtitles}
                onSubtitlesChange={handleSubtitlesChange}
                languages={LANGUAGES}
              />
            </div>
            <div className="w-full md:w-1/3 flex justify-end mt-6 md:mt-0">
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
