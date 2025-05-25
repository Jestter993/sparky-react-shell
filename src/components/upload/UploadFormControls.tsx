
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
import { Checkbox } from "@/components/ui/checkbox";
import { Upload as UploadIcon } from "lucide-react";

type Props = {
  targetLang: string;
  onTargetLangChange: (val: string) => void;
  subtitles: boolean;
  onSubtitlesChange: (checked: boolean) => void;
  languages: { value: string; label: string }[];
};

export default function UploadFormControls({
  targetLang,
  onTargetLangChange,
  subtitles,
  onSubtitlesChange,
  languages,
}: Props) {
  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-5">
      {/* Language selector */}
      <div className="flex flex-col w-full md:w-[60%]">
        <label className="text-[15px] font-semibold text-[#1E1E23] mb-2 flex gap-2 items-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[#E7E3FB] text-[#6946FF] w-7 h-7 mr-1">
            <UploadIcon size={16} className="mx-auto" />
          </span>
          Target Language
        </label>
        <Select value={targetLang} onValueChange={onTargetLangChange}>
          <SelectTrigger className="w-full h-11 bg-[#F6F6FA] border-[#E6E5F0] focus:ring-2 focus:ring-[#6946FF]/30 rounded-lg font-medium text-[16px]">
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
      </div>
      {/* Subtitles checkbox */}
      <div className="flex flex-col gap-3 w-full md:w-[40%] mt-1">
        <label className="flex items-center gap-3 cursor-pointer select-none text-[16px] font-medium text-[#4B3FDB] mb-1 leading-tight">
          <Checkbox
            id="subtitles"
            checked={subtitles}
            onCheckedChange={onSubtitlesChange}
            className="border-2 border-[#B9A9FF] bg-white data-[state=checked]:bg-[#764AF8] data-[state=checked]:border-[#6946FF]"
          />
          Include subtitles
        </label>
      </div>
    </div>
  );
}
