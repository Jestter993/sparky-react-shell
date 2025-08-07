
import React from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type Props = {
  disabled: boolean;
  onClick: () => void;
};

export default function UploadActionButton({ disabled, onClick }: Props) {
  return (
    <Button
      type="button"
      disabled={disabled}
      className={clsx(
        "transition-all duration-150 font-bold px-10 py-3 rounded-full text-white text-lg",
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] shadow-md hover:shadow-lg hover-scale"
      )}
      onClick={onClick}
    >
      Localize
    </Button>
  );
}
