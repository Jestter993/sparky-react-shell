
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Upload as UploadIcon, AlertTriangle, CheckCircle } from "lucide-react";

type Props = {
  targetLang: string;
  onTargetLangChange: (val: string) => void;
  languages: { value: string; label: string }[];
  detectedLanguage?: string;
  isDetecting?: boolean;
};

export default function UploadFormControls({
  targetLang,
  onTargetLangChange,
  languages,
  detectedLanguage,
  isDetecting,
}: Props) {
  // Get the detected language label
  const detectedLanguageLabel = languages.find(l => l.value === detectedLanguage)?.label;
  
  // Determine if detected language matches target
  const isSameLanguage = detectedLanguage && targetLang && detectedLanguage === targetLang;
  const isDifferentLanguage = detectedLanguage && targetLang && detectedLanguage !== targetLang;
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Language selector */}
      <div className="flex flex-col w-full">
        <label className="text-[15px] font-semibold text-[#101016] mb-2 flex gap-2 items-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[#E7E3FB] text-[#8D6AFE] w-7 h-7 mr-1">
            <UploadIcon size={16} className="mx-auto" />
          </span>
          Target Language
        </label>
        <Select value={targetLang} onValueChange={onTargetLangChange}>
          <SelectTrigger className="w-full h-11 bg-[#F6F6FA] border-[#E6E5F0] focus:ring-2 focus:ring-[#8D6AFE]/30 rounded-lg font-medium text-[16px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white rounded-lg shadow-lg border border-gray-100">
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value} className="cursor-pointer">{l.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {/* Smart language suggestion */}
        {detectedLanguage && detectedLanguage !== 'unknown' && !isDetecting && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {isSameLanguage ? (
              <>
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-amber-700">
                  Detected {detectedLanguageLabel} - consider choosing a different target language
                </span>
              </>
            ) : isDifferentLanguage ? (
              <>
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-green-700">
                  Good choice! Video appears to be in {detectedLanguageLabel}
                </span>
              </>
            ) : null}
          </div>
        )}
        
        {isDetecting && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            <span>Detecting language...</span>
          </div>
        )}
      </div>
    </div>
  );
}
