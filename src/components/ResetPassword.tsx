import React, { useState } from "react";
import { Lock, AlertCircle, RefreshCw, Key, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "./AuthContext";

interface ResetPasswordProps {
  initialToken?: string;
  onNavigateToLogin: () => void;
}

export default function ResetPassword({ initialToken = "", onNavigateToLogin }: ResetPasswordProps) {
  const { resetPassword } = useAuth();
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !newPassword.trim()) {
      setErrorMsg("Verification token and new password are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Error: Password confirmation mismatch.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const res = await resetPassword(token, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error || "Reset password validation check failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl animate-fadeIn text-slate-800 text-left">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.04),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
          <Key className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-display text-slate-900 font-extrabold font-display">Reset Platform Password</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">Type your dispatched token and apply a complex combination of security criteria.</p>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 font-sans">
          {errorMsg && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Token field */}
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Verification Token Code</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Dispatched token hex string"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-reset-token"
            />
          </div>

          {/* New password field */}
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">New Safe Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-reset-newpass"
            />
          </div>

          {/* Confirm field */}
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Confirm Password Pin</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-reset-confirm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            id="auth-reset-submit"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Finalize Reset Procedures</span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4 py-4 text-center font-sans">
          <div className="p-4 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-850 text-xs space-y-2 flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <span className="font-mono font-bold tracking-widest text-[10px] block pt-1.5">PASSCODE RECONFIGURED</span>
            <p className="leading-relaxed">Your account has been successfully re-secured. Dispatched sessions revoked.</p>
          </div>
          <button
            onClick={onNavigateToLogin}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg font-mono cursor-pointer transition"
            id="auth-reset-goto-login"
          >
            Authorize Updated Logins
          </button>
        </div>
      )}

      {/* Back button */}
      {!success && (
        <div className="text-center pt-2 relative z-10 flex items-center justify-center">
          <button
            onClick={onNavigateToLogin}
            className="text-xs text-slate-650 hover:text-slate-900 font-bold font-sans flex items-center gap-1.5 cursor-pointer"
            id="auth-reset-return"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Logins Console</span>
          </button>
        </div>
      )}
    </div>
  );
}
