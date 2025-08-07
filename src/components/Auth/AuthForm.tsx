
import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn, User, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

// New components/hooks
import AuthPanelSwitcher from "./AuthPanelSwitcher";
import AuthEmailInput from "./AuthEmailInput";
import AuthPasswordInput from "./AuthPasswordInput";
import AuthModeLinks from "./AuthModeLinks";
import { useAuthFormState } from "./useAuthFormState";

// Type
type AuthFormMode = "login" | "signup" | "forgot";

const AuthForm = () => {
  // Use custom hook for state
  const {
    mode,
    setMode,
    loading,
    setLoading,
    serverError,
    setServerError,
    hasSubmitted,
    setHasSubmitted,
    emailRef,
  } = useAuthFormState();
  const navigate = useNavigate();

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

  // Panel animation
  const panelClasses = "transition-all duration-500 ease-[cubic-bezier(.45,.05,.55,.95)]";

  const onSubmit = async (data: { email: string; password: string }) => {
    setServerError(null);
    setHasSubmitted(true);
    setLoading(true);
    if (mode === "login") {
      const { error, data: signInData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      setLoading(false);
      if (error) {
        setServerError(error.message || "Invalid email or password");
        return;
      }
      toast({ title: "Logged in!", description: "Welcome back to Adaptrix." });
      navigate("/");
    } else if (mode === "signup") {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      setLoading(false);
      if (error) {
        if (error.message.includes("User already registered")) {
          setServerError("This email is already registered. Please sign in instead.");
        } else {
          setServerError(error.message || "Account creation failed");
        }
        return;
      }
      toast({ title: "Check your inbox!", description: "We sent you an email to confirm your account." });
    }
  };

  const onForgot = async ({ email }: { email: string }) => {
    setServerError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth",
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
    setHasSubmitted(false);
  };

  // On mode change: reset errors/fields, focus email
  const handleModeChange = (m: AuthFormMode) => {
    setServerError(null);
    setMode(m);
    reset({ email: "", password: "" });
    setHasSubmitted(false); // <-- ensure hasSubmitted resets every time
    setTimeout(() => {
      if (emailRef.current) emailRef.current.focus();
    }, 350);
  };

  // Button UI
  const actionLabel = mode === "login" ? "Login" : mode === "signup" ? "Sign up" : "Send reset link";
  const actionIcon = mode === "login" ? <LogIn size={20} /> : mode === "signup" ? <User size={20} /> : <Mail size={20} />;

  // Render
  return (
    <div>
      <AuthPanelSwitcher mode={mode} onModeChange={handleModeChange} />
      <form
        className={clsx("space-y-6", panelClasses)}
        onSubmit={
          mode === "forgot"
            ? handleSubmit(onForgot)
            : handleSubmit(onSubmit)
        }
        aria-live="polite"
      >
        <AuthEmailInput
          register={register}
          error={errors.email}
          hasSubmitted={hasSubmitted}
          loading={loading}
          emailRef={emailRef}
        />
        <AuthPasswordInput
          register={register}
          error={errors.password}
          hasSubmitted={hasSubmitted}
          loading={loading}
          mode={mode}
          isValid={isValid}
          onEnterInvalid={() => setHasSubmitted(true)}
        />
        {serverError && (
          <div className="p-3 rounded bg-destructive/10 text-destructive text-sm text-center font-medium animate-fade-in">
            {serverError}
          </div>
        )}
        <Button
          className={clsx(
            "w-full py-3 font-extrabold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] hover-scale transition active:scale-100 duration-150",
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
        <AuthModeLinks mode={mode} onModeChange={handleModeChange} />
      </form>
    </div>
  );
};

export default AuthForm;
