import React, { useState, useEffect } from "react";
import { UserCheck, Mail, Lock, AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

interface RegisterProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (debugToken?: string) => void;
}

export default function Register({ onNavigateToLogin, onRegisterSuccess }: RegisterProps) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password verification checks
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Weak");
  const [strengthColor, setStrengthColor] = useState("bg-red-500");

  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false
  });

  useEffect(() => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    setChecks({
      length: hasLength,
      upper: hasUpper,
      lower: hasLower,
      number: hasNumber,
      symbol: hasSymbol
    });

    // Score from 0 to 5
    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    setStrengthScore(score);

    if (score <= 2) {
      setStrengthLabel("Weak (Insecure)");
      setStrengthColor("bg-red-500");
    } else if (score <= 4) {
      setStrengthLabel("Moderate (Standard)");
      setStrengthColor("bg-yellow-500");
    } else {
      setStrengthLabel("Strong (High Security Seal)");
      setStrengthColor("bg-emerald-500");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("All enrollment cells are required parameters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Error: Password confirmation parameter mismatch.");
      return;
    }

    if (strengthScore < 5) {
      setErrorMsg("Cryptographic verification error: Password does not meet minimum safety complexity guidelines.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg("You must accept our Enterprise standard operations terms and privacy agreements.");
      return;
    }

    setIsLoading(true);
    const res = await register(firstName, lastName, username, email, password, role);
    setIsLoading(false);

    if (res.success) {
      onRegisterSuccess(res.debugVerificationToken);
    } else {
      setErrorMsg(res.error || "Registry transactional request failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl animate-fadeIn text-slate-800 text-left">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.05),transparent_60%)] pointer-events-none" />

      {/* Title */}
      <div className="text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto">
          <UserCheck className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-display text-slate-900 font-extrabold">Register Operator Account</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">Enroll inside AfriWaid’s Dynamic RBAC system. Fill required parameter slots below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10 font-sans">
        {errorMsg && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-650" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* First & Last Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Alasiri"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-register-firstname"
            />
          </div>

          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Waid"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-register-lastname"
            />
          </div>
        </div>

        {/* Username & Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Desired Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alasiri_waid"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-register-username"
            />
          </div>

          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@afriwaid.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-register-email"
            />
          </div>
        </div>

        {/* Desired/Requested Role */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <label className="font-mono uppercase tracking-wider font-semibold">Requested System Role (Dynamic RBAC slot)</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs cursor-pointer text-left"
            id="auth-register-role"
          >
            <option value="User">User (Standard account access)</option>
            <option value="Client">Client Partner (Track specific project contracts)</option>
            <option value="Operator">Operator (Upload project deliverables and milestones)</option>
            <option value="Developer">Developer (Examine server monitoring states)</option>
            <option value="Moderator">Moderator (Manage user chats)</option>
            <option value="Auditor">Compliance Auditor (Read logs in compliance audits)</option>
          </select>
        </div>

        {/* Passwords Input row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Passcode Encryption Keys</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-register-password"
            />
          </div>

          <div className="space-y-1.5 text-xs text-slate-500">
            <label className="font-mono uppercase tracking-wider font-semibold">Confirm Password Pin</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
              id="auth-register-confirm"
            />
          </div>
        </div>

        {/* PASSWORD STRENGTH COMPLEXITY MATRIX METER */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-sans">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-slate-600 uppercase tracking-wide">Passcode Complexity Matrix</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white ${strengthColor}`}>
              {strengthLabel}
            </span>
          </div>

          {/* Graphical strength gauge lines */}
          <div className="grid grid-cols-5 gap-1.5 h-1.5">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`h-full rounded-full transition duration-300 ${
                  strengthScore >= idx ? strengthColor : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Validation Checklist points */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1.5 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${checks.length ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={checks.length ? "text-emerald-700 font-bold" : ""}>Minimum 8 Chars</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${checks.upper ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={checks.upper ? "text-emerald-700 font-bold" : ""}>Uppercase Case</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${checks.lower ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={checks.lower ? "text-emerald-700 font-bold" : ""}>Lowercase Case</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${checks.number ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={checks.number ? "text-emerald-700 font-bold" : ""}>Numbers Segment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${checks.symbol ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={checks.symbol ? "text-emerald-700 font-bold" : ""}>Special Symbol</span>
            </div>
          </div>
        </div>

        {/* Corporate Agreements validation checkbox */}
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 font-sans cursor-pointer py-1">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            id="auth-register-terms"
          />
          <span>I verify acknowledgement of the AfriWaid Studio platform operations standards, and authorize system audit log tracing on security logs.</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          id="auth-register-submit"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Initiate Dynamic Registration Matrix</span>
          )}
        </button>
      </form>

      {/* Redirect trigger */}
      <div className="text-center pt-2 relative z-10">
        <span className="text-xs text-slate-500 font-sans font-medium">Already registered? </span>
        <button
          onClick={onNavigateToLogin}
          className="text-xs text-blue-600 hover:text-blue-750 font-bold font-sans cursor-pointer"
          id="auth-login-trigger"
        >
          Return to Login Console
        </button>
      </div>
    </div>
  );
}
