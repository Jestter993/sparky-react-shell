
import AuthForm from "@/components/Auth/AuthForm";

const AuthPage = () => (
  <main className="min-h-screen bg-gradient-to-br from-[#5A5CFF]/10 to-[#00C9A7]/10 flex items-center justify-center py-12 px-4">
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10 flex flex-col items-center">
        <span className="font-extrabold text-3xl tracking-tight bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent select-none mb-2">
          Adaptrix
        </span>
        <span className="text-md text-muted-foreground">Speak Ad. Any Language.</span>
      </div>
      <div className="rounded-xl shadow-2xl bg-white/80 backdrop-blur-lg p-8 border border-border">
        <AuthForm />
      </div>
    </div>
  </main>
);

export default AuthPage;
