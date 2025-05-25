
import React from "react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import clsx from "clsx";

interface AuthEmailInputProps {
  register: ReturnType<any>;
  error?: { message?: string };
  hasSubmitted: boolean;
  loading: boolean;
  emailRef: React.RefObject<HTMLInputElement>;
}

const AuthEmailInput: React.FC<AuthEmailInputProps> = ({
  register,
  error,
  hasSubmitted,
  loading,
  emailRef,
}) => {
  // Compose ref so that both react-hook-form and the parent ref are honored
  const {
    ref: registerRef,
    ...registerRest
  } = register("email", {
    required: "Email is required",
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Invalid email format",
    },
  });

  // This function will set the internal RHF ref and the emailRef prop
  const combinedRef = (el: HTMLInputElement) => {
    registerRef(el);
    if (emailRef) {
      // @ts-expect-error
      emailRef.current = el;
    }
  };

  return (
    <div>
      <label className="block mb-1 font-semibold text-sm" htmlFor="email">
        Email
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-2.5 text-[#5A5CFF]/80" size={18} />
        <Input
          id="email"
          type="email"
          autoFocus
          {...registerRest}
          ref={combinedRef}
          className={clsx("pl-10", error && "border-destructive")}
          placeholder="you@email.com"
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
          autoComplete="username"
          tabIndex={1}
          disabled={loading}
        />
      </div>
      {hasSubmitted && error && (
        <span className="text-xs text-destructive ml-1" id="email-error">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default AuthEmailInput;

