
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
        "transition-all duration-150 font-bold px-8 py-3 rounded-full text-white text-lg bg-gradient-to-r from-[#6946FF] to-[#90F0CF] shadow-md hover:shadow-lg hover:from-[#90F0CF] hover:to-[#6946FF] hover:scale-105"
      )}
      onClick={onClick}
    >
      Localize
    </Button>
  );
}
