
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon } from "lucide-react";
import clsx from "clsx";

type Props = {
  file: File | null;
  fileError: string | null;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleBrowseClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  setFile: (file: File | null) => void;
};

export default function UploadDropzone({
  file,
  fileError,
  uploading,
  fileInputRef,
  handleBrowseClick,
  handleFileChange,
  handleDrop,
  handleDragOver,
  setFile,
}: Props) {
  return (
    <div
      data-testid="upload-area"
      className={clsx(
        "w-full max-w-xl min-h-[180px] relative flex flex-col items-center justify-center border border-gray-300 transition-all duration-150 text-center rounded-2xl px-3 py-12 bg-white mb-10 cursor-pointer",
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
        <div className="flex flex-col items-center gap-2 w-full">
          <span
            className="flex items-center justify-center rounded-full bg-gradient-to-b from-[#D6C5FF] to-[#F2FEED] shadow-sm mb-4"
            style={{ width: 56, height: 56 }}
          >
            <UploadIcon className="text-[#8D6AFE]" size={30} strokeWidth={2.1} />
          </span>
          <span className="font-semibold text-base md:text-lg text-[#8D6AFE] mb-0.5">
            <button
              onClick={e => {
                e.stopPropagation();
                handleBrowseClick();
              }}
              className="hover:underline focus:outline-none text-[#8D6AFE]"
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
  );
}
