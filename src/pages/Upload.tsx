import React, { useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon } from "lucide-react";
import clsx from "clsx";

// Supported language options
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
];

const ALLOWED_TYPES = ["video/mp4", "video/quicktime"];
const MAX_SIZE_MB = 1000; // Based on your UI (shows 1GB max)

function getLangLabel(value: string) {
  return LANGUAGES.find((l) => l.value === value)?.label || value;
}

export default function VideoUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const [subtitles, setSubtitles] = useState(false);

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

  function handleSelectTargetLang(val: string) {
    setTargetLang(val);
  }

  function handleSubtitlesChange(checked: boolean) {
    setSubtitles(!!checked);
  }

  // Main UI design based on the image reference
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#FAFCFF] font-inter overflow-x-hidden">
      {/* Alpha warning bar */}
      <div className="w-full flex justify-center bg-[#FFEFE0] border-b border-[#FFE1C3] text-[#784B18] py-2 text-[15px] font-medium">
        <span className="flex items-center gap-1">
          <svg width={18} height={18} fill="none" viewBox="0 0 20 20" className="mr-1"><circle cx="10" cy="10" r="9" fill="#FFB87B"/><path d="M10 5v5M10 13h.01" stroke="#784B18" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Alpha stage — some translations may not be perfect yet
        </span>
      </div>
      {/* Centered container */}
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-12 px-6">
        {/* Title and desc */}
        <h1 className="text-[2.75rem] font-extrabold text-[#202124] text-center mb-1 tracking-tight font-[Space_Grotesk,sans-serif]">
          Upload your video
        </h1>
        <div className="text-lg md:text-xl text-[#424455bb] font-medium text-center mb-8">
          Upload a video and customize your localization settings
        </div>
        {/* Upload area */}
        <div
          data-testid="upload-area"
          className={clsx(
            "w-full max-w-xl min-h-[220px] md:min-h-[220px] relative flex flex-col items-center justify-center border-2 border-dashed border-[#D4D8E3] transition-all duration-150 text-center rounded-2xl px-2 py-8 bg-white mb-8 cursor-pointer",
            uploading && "opacity-70 pointer-events-none cursor-default"
          )}
          tabIndex={0}
          onClick={() => {
            if (!file && !uploading) handleBrowseClick();
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          aria-disabled={!!file || uploading}
        >
          {!file ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center rounded-full bg-[#EAE7FD] mb-3" style={{ width: 54, height: 54 }}>
                  <UploadIcon className="text-[#764AF8]" size={32} strokeWidth={2.1} />
                </span>
                <span className="font-semibold text-base md:text-lg text-[#6946FF] mb-0.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                    className="hover:underline text-[#6946FF] focus:outline-none"
                  >
                    Click to upload
                  </button>
                  <span className="text-[#888] font-normal ml-1">or drag and drop</span>
                </span>
                <span className="text-[#75777E] text-xs block mt-1">
                  Your video file (max. 1GB)
                </span>
                {fileError && (
                  <span className="text-xs mt-2 text-destructive">{fileError}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="font-medium text-[#244]" style={{ fontSize: 16 }}>{file.name}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFile(null)}
                className="mt-2 text-xs"
                disabled={uploading}
              >
                Remove
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,.mov,video/mp4,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
            tabIndex={-1}
            aria-label="Upload video"
          />
        </div>
        {/* Form controls */}
        <div className="w-full flex flex-col md:flex-row items-start gap-5">
          {/* Language selector */}
          <div className="flex flex-col w-full md:w-[60%]">
            <label className="text-[15px] font-semibold text-[#1E1E23] mb-2 flex gap-2 items-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#E7E3FB] text-[#6946FF] w-7 h-7 mr-1">
                <UploadIcon size={16} className="mx-auto" />
              </span>
              Target Language
            </label>
            <Select value={targetLang} onValueChange={handleSelectTargetLang}>
              <SelectTrigger className="w-full h-11 bg-[#F6F6FA] border-[#E6E5F0] focus:ring-2 focus:ring-[#6946FF]/30 rounded-lg font-medium text-[16px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white rounded-lg shadow-lg border border-gray-100">
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value} className="cursor-pointer">{l.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Subtitles checkbox */}
          <div className="flex flex-col gap-3 w-full md:w-[40%] mt-1">
            <label className="flex items-center gap-3 cursor-pointer select-none text-[16px] font-medium text-[#4B3FDB] mb-1 leading-tight">
              <Checkbox
                id="subtitles"
                checked={subtitles}
                onCheckedChange={handleSubtitlesChange}
                className="border-2 border-[#B9A9FF] bg-white data-[state=checked]:bg-[#764AF8] data-[state=checked]:border-[#6946FF]"
              />
              Include subtitles
            </label>
          </div>
        </div>
        {/* Action Button */}
        <div className="w-full flex items-center justify-end mt-8">
          <Button
            type="button"
            disabled={!file || uploading}
            className={clsx(
              "transition-all duration-150 font-bold px-8 py-3 rounded-full text-white text-lg bg-gradient-to-r from-[#6946FF] to-[#90F0CF] shadow-md hover:shadow-lg hover:from-[#90F0CF] hover:to-[#6946FF] hover:scale-105"
            )}
          >
            Localize
          </Button>
        </div>
      </div>
    </div>
  );
}
