
import React from "react";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import clsx from "clsx";

interface AuthPasswordInputProps {
  register: ReturnType<any>;
  error?: { message?: string };
  hasSubmitted: boolean;
  loading: boolean;
  mode: "login" | "signup" | "forgot";
  isValid: boolean;
  onEnterInvalid: () => void;
}

const AuthPasswordInput: React.FC<AuthPasswordInputProps> = ({
  register,
  error,
  hasSubmitted,
  loading,
  mode,
  isValid,
  onEnterInvalid,
}) =>
  mode !== "forgot" ? (
    <div>
      <label className="block mb-1 font-semibold text-sm" htmlFor="password">
        Password
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-2.5 text-[#00C9A7]/80" size={18} />
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="Password"
          className={clsx("pl-10", error && "border-destructive")}
          aria-invalid={!!error}
          aria-describedby={error ? "password-error" : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          tabIndex={2}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === "Enter" && !isValid) {
              onEnterInvalid();
            }
          }}
        />
      </div>
      {hasSubmitted && error && (
        <span className="text-xs text-destructive ml-1" id="password-error">
          {error.message}
        </span>
      )}
    </div>
  ) : null;

export default AuthPasswordInput;
