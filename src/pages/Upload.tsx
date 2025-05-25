import React, { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [targetLang, setTargetLang] = useState("es"); // Default to "Spanish" as in screenshot
  const [subtitles, setSubtitles] = useState(true); // Checked as in screenshot

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

  return (
    <main className="min-h-screen bg-[#faf9fb] relative flex flex-col font-inter">
      <UploadAlphaBanner />
      <LandingNav />
      <div className="w-full mx-auto px-4 xl:px-[200px] flex-1 flex flex-col items-center justify-start">
        <div className="flex flex-col items-center justify-center w-full mt-16">
          <UploadTitleSection />
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
                onClick={() => {
                  // Add submit logic here later if needed
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <UploadProjectsSection />
    </main>
  );
}
