
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, User, Mail, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

type AuthFormMode = "login" | "signup" | "forgot";

const AuthForm = () => {
  const [mode, setMode] = useState<AuthFormMode>("login");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
    getValues,
    reset,
  } = useForm<{ email: string; password: string }>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  // Animate transitions between panels
  const panelClasses = "transition-all duration-500 ease-[cubic-bezier(.45,.05,.55,.95)]";

  // Handler for both login and signup
  const onSubmit = async (data: { email: string; password: string }) => {
    setServerError(null);
    setHasSubmitted(true);
    setLoading(true);
    if (mode === "login") {
      // Sign in with credentials
      const { error, data: signInData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      setLoading(false);

      if (error) {
        setServerError(error.message || "Invalid email or password");
        return;
      }
      // Retrieve session and determine if user is new or returning
      const sessionUser = signInData?.user;
      // For demonstration, if user.created_at within last 2 minutes, route to onboarding
      const createdAt = sessionUser?.created_at ? new Date(sessionUser.created_at) : null;
      const isOnboarding = createdAt && Date.now() - createdAt.getTime() < 4 * 60 * 1000;
      if (isOnboarding) {
        toast({ title: "Welcome!", description: "Complete a quick onboarding.", duration: 2000 });
        navigate("/onboarding");
      } else {
        navigate("/"); // upload page/main
      }
      // Optionally toast
      toast({ title: "Logged in!", description: "Welcome back to Adaptrix." });
    } else if (mode === "signup") {
      // Sign up
      const { error, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      setLoading(false);
      if (error) {
        setServerError(error.message || "Account creation failed");
        return;
      }
      toast({ title: "Check your inbox!", description: "We sent you an email to confirm your account." });
      // For onboarding after signup, redirect to onboarding after a short wait
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    }
  };

  // Forgot password handler
  const onForgot = async ({ email }: { email: string }) => {
    setServerError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth", // can direct back to the same page
    });
    setLoading(false);

    if (error) {
      setServerError(error.message || "Failed to send reset email");
      return;
    }
    toast({
      title: "Reset email sent",
      description: "Check your inbox for password reset instructions.",
    });
    setMode("login");
    reset({ password: "" });
  };

  const handleModeChange = (m: AuthFormMode) => {
    setServerError(null);
    setMode(m);
    setTimeout(() => {
      if (emailRef.current) emailRef.current.focus();
    }, 350);
  };

  // Compose labels and icons for main button
  const actionLabel = mode === "login" ? "Login" : mode === "signup" ? "Sign up" : "Send reset link";
  const actionIcon = mode === "login" ? <LogIn size={20} /> : mode === "signup" ? <User size={20} /> : <Mail size={20} />;

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex items-center justify-center mb-7 gap-2">
        <button
          className={clsx(
            "px-4 py-2 rounded-lg font-medium bg-transparent transition-all duration-150",
            mode === "login" ? "bg-[#5A5CFF]/10 text-[#5A5CFF] shadow" : "text-gray-500 hover:bg-gray-100"
          )}
          type="button"
          onClick={() => handleModeChange("login")}
        >
          Login
        </button>
        <button
          className={clsx(
            "px-4 py-2 rounded-lg font-medium bg-transparent transition-all duration-150",
            mode === "signup" ? "bg-[#00C9A7]/10 text-[#00C9A7] shadow" : "text-gray-500 hover:bg-gray-100"
          )}
          type="button"
          onClick={() => handleModeChange("signup")}
        >
          Sign up
        </button>
      </div>
      {/* Animated Panel */}
      <form
        className={clsx("space-y-6", panelClasses)}
        onSubmit={
          mode === "forgot"
            ? handleSubmit(onForgot)
            : handleSubmit(onSubmit)
        }
        aria-live="polite"
      >
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className={clsx("pl-10", errors.email && "border-destructive")}
              placeholder="you@email.com"
              ref={emailRef}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="username"
              tabIndex={1}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-destructive ml-1" id="email-error">
              {errors.email.message}
            </span>
          )}
        </div>
        {/* Password field for login/signup (not for forgot password) */}
        {mode !== "forgot" && (
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
                className={clsx("pl-10", errors.password && "border-destructive")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                tabIndex={2}
                disabled={loading}
                onKeyDown={e => {
                  if (e.key === "Enter" && !isValid) {
                    setHasSubmitted(true);
                  }
                }}
              />
            </div>
            {errors.password && (
              <span className="text-xs text-destructive ml-1" id="password-error">
                {errors.password.message}
              </span>
            )}
          </div>
        )}
        {/* Server error message */}
        {serverError && (
          <div className="p-3 rounded bg-destructive/10 text-destructive text-sm text-center font-medium animate-fade-in">{serverError}</div>
        )}
        {/* Main action button */}
        <Button
          className={clsx(
            "w-full py-3 font-extrabold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] hover:scale-105 transition active:scale-100 duration-150",
            loading && "opacity-60 pointer-events-none"
          )}
          type="submit"
          disabled={loading || !isDirty || !isValid || isSubmitting}
          tabIndex={3}
          aria-busy={loading}
        >
          {loading ? (
            <span className="animate-spin mr-2 inline-block rounded-full border-2 border-t-2 border-t-[#5A5CFF] border-r-[#00C9A7] border-[#fff] w-5 h-5" />
          ) : actionIcon}
          {actionLabel}
        </Button>
        {/* Toggle forgot password, login/signup link */}
        <div className="flex flex-col items-center gap-2 mt-2">
          {mode !== "forgot" ? (
            <button
              type="button"
              onClick={() => handleModeChange("forgot")}
              className="text-xs text-[#5A5CFF] hover:underline focus:underline transition"
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className="text-xs text-[#5A5CFF] hover:underline focus:underline transition"
            >
              Back to login
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
