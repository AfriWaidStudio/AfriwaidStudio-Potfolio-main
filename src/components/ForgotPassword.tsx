import React, { useState } from "react";
import { Mail, HelpCircle, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "./AuthContext";

interface ForgotPasswordProps {
  onNavigateToLogin: () => void;
  onNavigateToReset: (token: string) => void;
}

export default function ForgotPassword({ onNavigateToLogin, onNavigateToReset }: ForgotPasswordProps) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [debugToken, setDebugToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please provide an email target address.");
      return;
    }

    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    setDebugToken("");

    const res = await forgotPassword(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || "Instructions dispatched.");
      if (res.debugResetToken) {
        setDebugToken(res.debugResetToken);
      }
    } else {
      setErrorMsg(res.error || "Failed reset trigger.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl animate-fadeIn text-slate-800 text-left">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.04),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
          <HelpCircle className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-display text-slate-900 font-extrabold">Retrieve Passcode</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">Enter your registered email address below, and we will trigger secure password instructions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10 font-sans">
        {errorMsg && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-650" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instructions Generated</span>
            </div>
            <p className="font-sans leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Input */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <label className="font-mono uppercase tracking-wider font-semibold">Registered Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. waidsoko@gmail.com"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
              id="auth-forgot-email"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer shadow-sm border border-blue-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
          id="auth-forgot-submit"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Request Passcode Retrieve</span>
          )}
        </button>

        {/* Developer Sandbox Testing Token Indicator */}
        {debugToken && (
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs space-y-2.5">
            <span className="font-mono font-bold text-orange-700 uppercase tracking-widest text-[9px] block">💻 Simulated Verification Core Result</span>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              To test the next reset password screen, click the quick-reset button below to instantly utilize the generated code token and verify password strength triggers.
            </p>
            <button
              type="button"
              onClick={() => onNavigateToReset(debugToken)}
              className="w-full py-2 bg-orange-600 hover:bg-orange-750 text-white rounded-lg transition duration-200 font-mono text-[10px] uppercase font-bold cursor-pointer"
              id="auth-forgot-bypass-btn"
            >
              Direct Reset With Token: {debugToken.substring(0, 10)}...
            </button>
          </div>
        )}
      </form>

      {/* Redirect back to login */}
      <div className="text-center pt-2 relative z-10 flex items-center justify-center">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="text-xs text-slate-650 hover:text-slate-900 font-bold font-sans flex items-center gap-1.5 cursor-pointer"
          id="auth-forgot-return"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Logins Panel</span>
        </button>
      </div>
    </div>
  );
}
