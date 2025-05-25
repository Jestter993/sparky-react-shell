import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Info, Upload, ArrowRight, History, ArrowDown } from "lucide-react";
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
const MAX_SIZE_MB = 500;

function getLangLabel(value: string) {
  return LANGUAGES.find((l) => l.value === value)?.label || value;
}

export default function VideoUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetLang, setTargetLang] = useState("en");
  const [subtitles, setSubtitles] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null); // e.g., "English"
  const [showActions, setShowActions] = useState(false);

  // Generate a video thumbnail URL for preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function resetUpload() {
    setFile(null);
    setPreviewUrl(null);
    setDetectedLang(null);
    setFileError(null);
    setProgress(0);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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

  function handleRemoveFile() {
    resetUpload();
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
    setUploading(true);

    // Generate a preview URL
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    // Simulate language detection and upload
    setProgress(0);
    setTimeout(() => setProgress(20), 300);
    setTimeout(() => setProgress(55), 800);

    // Fake language detection (simulate async)
    setTimeout(() => {
      setDetectedLang("English"); // Replace with actual detection later
      setProgress(80);
    }, 1200);

    // Simulate upload finishing
    setTimeout(() => {
      setUploading(false);
      setProgress(100);
    }, 1600);
  }

  function handleSelectTargetLang(val: string) {
    setTargetLang(val);
  }

  function handleSubtitlesChange(checked: boolean) {
    setSubtitles(checked);
  }

  // Playful microinteraction for drag area
  const dragClass =
    uploading || file
      ? "border-primary bg-[#F5F8FA] scale-98 pointer-events-none cursor-default"
      : "hover-scale border-dashed border-2 border-[#5A5CFF]/30 hover:border-[#00C9A7] bg-white shadow hover:shadow-lg transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#f5f8fa] via-[#eaf1fb] to-[#f5f8fa] font-inter overflow-x-hidden">
      <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-white/90 shadow-xl p-8 md:p-10 flex flex-col gap-6 border border-gray-100 animate-fade-in">
        {/* Alpha/Beta notice */}
        <div className="flex items-start gap-2 bg-[#FFA552]/10 border-l-4 border-[#FFA552] rounded p-3 mb-2">
          <Info className="text-[#FFA552] mt-0.5" size={20} />
          <div className="text-sm font-medium text-[#924800]">
            <div className="font-bold">Alpha/Beta</div>
            This feature is experimental — Not all videos will translate perfectly. Results may vary.
          </div>
        </div>
        {/* Main upload area */}
        <div
          data-testid="upload-area"
          className={clsx(
            "rounded-2xl flex flex-col items-center justify-center transition-all duration-150 text-center py-12 bg-white group relative cursor-pointer",
            dragClass
          )}
          tabIndex={0}
          onClick={() => {
            if (!file && !uploading) handleBrowseClick();
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          aria-disabled={!!file || uploading}
        >
          {!file && (
            <div className="flex flex-col items-center gap-3">
              <Upload
                className="text-[#5A5CFF] animate-bounce"
                size={36}
                strokeWidth={2.1}
              />
              <span className="font-bold text-lg text-[#0F1117]">
                Drag & drop a video here
              </span>
              <span className="text-muted-foreground text-sm">
                or <span className="font-semibold text-[#00C9A7] underline underline-offset-2">click to browse</span> <br /> (MP4, MOV. Max {MAX_SIZE_MB}MB)
              </span>
              {fileError && (
                <span className="text-xs mt-2 text-destructive">{fileError}</span>
              )}
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
          {/* If video is uploading/ready */}
          {file && (
            <div className="flex flex-col items-center gap-2 w-full">
              {/* Preview */}
              {previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="w-48 h-32 object-cover border border-gray-200 rounded-xl shadow mb-3"
                  poster={previewUrl}
                />
              )}
              <div className="font-medium text-[#0F1117] text-sm truncate" style={{maxWidth: 260}}>{file.name}</div>
              <Button size="sm" variant="outline" onClick={handleRemoveFile} className="mt-2 text-xs" disabled={uploading}>
                Remove & try another
              </Button>
            </div>
          )}
        </div>
        {/* Progress bar & language detection */}
        {(uploading || progress > 0) && (
          <div className="flex flex-col gap-2 items-center">
            <Progress value={progress} className="h-2 bg-[#F5F8FA] w-full" />
            {detectedLang && (
              <div className="text-xs text-[#00C9A7] font-semibold mt-1">
                Detected language: {detectedLang}
              </div>
            )}
            {!detectedLang && uploading && (
              <div className="text-xs text-muted-foreground">
                Detecting language...
              </div>
            )}
          </div>
        )}

        {/* Subtitle checkbox & target lang dropdown */}
        <div className="flex flex-col md:flex-row items-center md:gap-6 gap-3">
          {/* Language selector */}
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <label className="text-sm font-semibold text-[#0F1117] flex gap-1 items-center">
              Target language
              <ArrowDown className="inline-block w-4 h-4 text-[#5A5CFF]/70" />
            </label>
            <Select value={targetLang} onValueChange={handleSelectTargetLang}>
              <SelectTrigger className="w-full bg-[#F5F8FA] border border-[#E2E8F0] focus:ring-2 focus:ring-[#00C9A7]/40 rounded-lg shadow-sm">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white rounded-lg shadow-xl border border-gray-100">
                <SelectLabel>Popular Languages</SelectLabel>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value} className="cursor-pointer">
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Subtitles checkbox */}
          <div className="flex gap-4 items-center w-full md:w-1/2">
            <Checkbox
              id="subtitles"
              checked={subtitles}
              onCheckedChange={handleSubtitlesChange}
              className="border-[#5A5CFF]"
            />
            <label htmlFor="subtitles" className="text-sm font-semibold select-none">
              Do you want subtitles?
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center justify-between mt-3">
          {/* Dashboard/history button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/")}
            className="hover-scale gap-2 text-[#5A5CFF] font-semibold"
          >
            <History className="w-4 h-4" />
            Previous projects
          </Button>
          {/* Action menu */}
          <DropdownMenu open={showActions} onOpenChange={setShowActions}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg hover-scale flex gap-1 font-semibold"
              >
                More Actions
                <ArrowDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuLabel>Other Options</DropdownMenuLabel>
              <DropdownMenuItem disabled>
                Settings (Coming soon)
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                AI Quality Checks (Alpha only)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Submit/Process button */}
          <Button
            type="button"
            disabled={!file || uploading || !detectedLang || progress < 95}
            className={clsx(
              "transition-all duration-150 font-bold px-6 rounded-lg shadow hover:shadow-lg bg-gradient-to-tr from-[#5A5CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#5A5CFF] text-white hover-scale"
            )}
          >
            Process & Translate
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        {/* Micro note */}
        <div className="text-center text-xs text-muted-foreground mt-2 tracking-wide">
          <span className="font-medium text-[#5A5CFF]">MVP Note:</span> Only video uploads are currently supported. More formats coming soon!
        </div>
      </div>
    </div>
  );
}
