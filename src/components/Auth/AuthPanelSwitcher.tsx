
import React from "react";
import clsx from "clsx";

type AuthFormMode = "login" | "signup" | "forgot";
interface AuthPanelSwitcherProps {
  mode: AuthFormMode;
  onModeChange: (mode: AuthFormMode) => void;
}
const AuthPanelSwitcher: React.FC<AuthPanelSwitcherProps> = ({ mode, onModeChange }) => (
  <div className="flex items-center justify-center mb-7 gap-2">
    <button
      className={clsx(
        "px-4 py-2 rounded-lg font-medium bg-transparent transition-all duration-150",
        mode === "login" ? "bg-[#5A5CFF]/10 text-[#5A5CFF] shadow" : "text-gray-500 hover:bg-gray-100"
      )}
      type="button"
      onClick={() => onModeChange("login")}
    >
      Login
    </button>
    <button
      className={clsx(
        "px-4 py-2 rounded-lg font-medium bg-transparent transition-all duration-150",
        mode === "signup" ? "bg-[#00C9A7]/10 text-[#00C9A7] shadow" : "text-gray-500 hover:bg-gray-100"
      )}
      type="button"
      onClick={() => onModeChange("signup")}
    >
      Sign up
    </button>
  </div>
);

export default AuthPanelSwitcher;
