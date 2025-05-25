
import React from "react";

export default function UploadAlphaBanner() {
  return (
    <div className="w-full flex justify-center bg-[#FFEFE0] border-b border-[#FFE1C3] text-[#784B18] py-2 text-[15px] font-medium">
      <span className="flex items-center gap-1">
        <svg width={18} height={18} fill="none" viewBox="0 0 20 20" className="mr-1"><circle cx="10" cy="10" r="9" fill="#FFB87B"/><path d="M10 5v5M10 13h.01" stroke="#784B18" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Alpha stage — some translations may not be perfect yet
      </span>
    </div>
  );
}
