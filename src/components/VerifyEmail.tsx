import React, { useState, useEffect } from "react";
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";

interface VerifyEmailProps {
  initialToken?: string;
  onNavigateToLogin: () => void;
}

export default function VerifyEmail({ initialToken = "", onNavigateToLogin }: VerifyEmailProps) {
  const { verifyEmail } = useAuth();
  const [token, setToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token.trim()) {
      setErrorMsg("Verification token input is required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const res = await verifyEmail(token);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error || "Specified token code index check rejected.");
    }
  };

  // Auto trigger verification if token is passed initially on creation
  useEffect(() => {
    if (initialToken.trim()) {
      handleVerify();
    }
  }, [initialToken]);

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl animate-fadeIn text-slate-800 text-left">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.04),transparent_60%)] pointer-events-none" />

      {/* Header icon */}
      <div className="text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
          <Mail className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-display text-slate-900 font-extrabold font-display">Certify Email Address</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">Validate your operator metadata with email verification credentials.</p>
      </div>

      {!success ? (
        <form onSubmit={handleVerify} className="space-y-4 relative z-10 font-sans">
          {errorMsg && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-650" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Token input */}
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Verification Code Token</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste verification hex token here"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
              id="auth-verification-token-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer shadow-sm border border-blue-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
            id="auth-verification-submit"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Verify Operator Coordinates</span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4 py-4 text-center font-sans">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs space-y-2 flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
            <span className="font-mono font-bold tracking-widest text-[10px] block pt-1.5">EMAIL ADRESS CERTIFIED</span>
            <p className="leading-relaxed">Your account registry has been successfully certified. Dynamic privilege filters active.</p>
          </div>
          <button
            onClick={onNavigateToLogin}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg font-mono cursor-pointer transition flex items-center justify-center gap-1.5"
            id="auth-verification-goto-login"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
