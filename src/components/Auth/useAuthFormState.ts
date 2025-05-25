
import { useState, useRef } from "react";

export function useAuthFormState() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  return {
    mode,
    setMode,
    loading,
    setLoading,
    serverError,
    setServerError,
    hasSubmitted,
    setHasSubmitted,
    emailRef,
  };
}
