import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "./AuthContext";

interface LoginProps {
  onNavigateToRegister: () => void;
  onNavigateToForgot: () => void;
  onLoginSuccess: () => void;
}

export default function Login({ onNavigateToRegister, onNavigateToForgot, onLoginSuccess }: LoginProps) {
  const { login } = useAuth();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim() || !password.trim()) {
      setErrorMsg("Email or username and password are required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const res = await login(credential, password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.error || "Credentials could not be verified.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl animate-fadeIn text-slate-800 text-left">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none" />

      <div className="text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-display text-slate-900 font-extrabold">Sign In</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          Authenticate with your account credentials to access your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10 font-sans">
        {errorMsg && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="break-all">{errorMsg}</span>
          </div>
        )}

        <div className="space-y-1.5 text-xs text-slate-500">
          <label className="font-mono uppercase tracking-wider font-semibold block" htmlFor="auth-login-credential">
            Email or Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-login-credential"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <label className="font-mono uppercase tracking-wider font-semibold" htmlFor="auth-login-password">
              Password
            </label>
            <button
              type="button"
              onClick={onNavigateToForgot}
              className="text-[10px] text-blue-600 hover:text-blue-750 font-mono font-bold tracking-wider uppercase cursor-pointer"
              id="auth-forgot-trigger"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-login-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <label className="flex items-center gap-2 text-slate-600 font-sans font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              id="auth-login-remember"
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer shadow-sm border border-blue-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
          id="auth-login-submit"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="text-center pt-2 relative z-10">
        <span className="text-xs text-slate-500 font-sans font-medium">Need an account? </span>
        <button
          onClick={onNavigateToRegister}
          className="text-xs text-blue-600 hover:text-blue-750 font-bold font-sans cursor-pointer"
          id="auth-register-trigger"
        >
          Request access
        </button>
      </div>
    </div>
  );
}
