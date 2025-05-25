
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
      </div>
      {/* Subtitles checkbox */}
      <div className="flex items-center gap-3 mt-1">
        <Checkbox
          id="subtitles"
          checked={subtitles}
          onCheckedChange={onSubtitlesChange}
          className="border-2 border-[#8D6AFE] bg-white data-[state=checked]:bg-[#8D6AFE] data-[state=checked]:border-[#8D6AFE]"
        />
        <label htmlFor="subtitles" className="select-none text-[16px] font-medium text-[#8D6AFE] leading-tight cursor-pointer">
          Include subtitles
        </label>
      </div>
    </div>
  );
}
