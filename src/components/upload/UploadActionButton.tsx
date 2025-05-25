
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
        "bg-gradient-to-r from-[#C1A3FE] to-[#98F6CE]",
        "shadow-md hover:shadow-lg hover:from-[#98F6CE] hover:to-[#C1A3FE] hover:scale-105"
      )}
      onClick={onClick}
    >
      Localize
    </Button>
  );
}
