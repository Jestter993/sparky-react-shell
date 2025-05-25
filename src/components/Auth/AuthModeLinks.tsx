
import React from "react";

type AuthFormMode = "login" | "signup" | "forgot";
interface AuthModeLinksProps {
  mode: AuthFormMode;
  onModeChange: (mode: AuthFormMode) => void;
}
const AuthModeLinks: React.FC<AuthModeLinksProps> = ({ mode, onModeChange }) => (
  <div className="flex flex-col items-center gap-2 mt-2">
    {mode !== "forgot" ? (
      <button
        type="button"
        onClick={() => onModeChange("forgot")}
        className="text-xs text-[#5A5CFF] hover:underline focus:underline transition"
      >
        Forgot password?
      </button>
    ) : (
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className="text-xs text-[#5A5CFF] hover:underline focus:underline transition"
      >
        Back to login
      </button>
    )}
  </div>
);

export default AuthModeLinks;
