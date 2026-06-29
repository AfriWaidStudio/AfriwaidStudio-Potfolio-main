import React, { useState, useEffect } from "react";
import { Mail, Landmark, Sparkles, Building, Send, CheckCircle } from "lucide-react";
import { Inquiry } from "../types";

interface ContactFormProps {
  initialServiceCategory?: string;
  onInquirySubmitted: (inquiry: Inquiry) => void;
}

export default function ContactForm({ initialServiceCategory, onInquirySubmitted }: ContactFormProps) {
  const [activeFormType, setActiveFormType] = useState<"contact" | "service" | "collaboration" | "partnership">("contact");
  
  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Software Development");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Sync initialCategory
  useEffect(() => {
    if (initialServiceCategory) {
      setActiveFormType("service");
      setServiceCategory(initialServiceCategory);
    }
  }, [initialServiceCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      organization: organization || "Individual Client",
      message,
      type: activeFormType,
      serviceCategory: activeFormType === "service" ? serviceCategory : undefined,
      date: new Date().toISOString().split("T")[0],
      status: "new"
    };

    onInquirySubmitted(newInquiry);
    setSuccess(true);

    // reset fields
    setName("");
    setEmail("");
    setOrganization("");
    setMessage("");

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  const getFormTitle = () => {
    switch (activeFormType) {
      case "service": return "Service Provision Request";
      case "collaboration": return "Research Innovation Alliance";
      case "partnership": return "Strategic Enterprise Partnership";
      default: return "General Consultation Ticket";
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto text-left">
      {/* Mini Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Initiate Collaboration</h1>
        <p className="text-sm text-slate-500 font-sans">
          AfriWaid Studio values precision client communication. Choose your exact ticketing track to ensure proper routing to our systems director.
        </p>
      </div>

      {/* Grid of options selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["contact", "service", "collaboration", "partnership"] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveFormType(type);
              setSuccess(false);
            }}
            className={`p-4 rounded-xl border text-left space-y-3 transition duration-200 cursor-pointer ${
              activeFormType === type
                ? "border-cyan-500 bg-black text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-black text-slate-500 dark:text-zinc-400 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-black dark:hover:text-cyan-400 hover:bg-black hover:shadow-xs"
            }`}
            id={`contact-type-btn-${type}`}
          >
            <div className={`p-1.5 rounded-lg w-fit transition duration-200 ${
              activeFormType === type 
                ? "bg-cyan-950/80 text-cyan-400" 
                : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400"
            }`}>
              {type === "contact" && <Mail className="w-5 h-5" />}
              {type === "service" && <Sparkles className="w-5 h-5" />}
              {type === "collaboration" && <Landmark className="w-5 h-5" />}
              {type === "partnership" && <Building className="w-5 h-5" />}
            </div>
            
            <div className="space-y-0.5">
              <h4 className={`text-xs font-bold uppercase tracking-wide font-display leading-tight ${activeFormType === type ? 'text-cyan-400' : 'text-slate-900 dark:text-white'}`}>{type}</h4>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 lowercase leading-tight font-mono">Ticketing path</p>
            </div>
          </button>
        ))}
      </div>

      {/* Actual Form Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 relative overflow-hidden shadow-xs">
        
        {success ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-250 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-display text-slate-900 font-bold">Ticket Successfully Registered</h3>
              <p className="text-slate-500 text-xs mt-1 font-sans">We have queued your inquiry. Our regional director will respond within 12 standard business hours.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono">
              COMPILING GATEWAY STATUS: REGISTERED_OK
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-sm font-mono text-cyan-600 dark:text-cyan-400 tracking-wider uppercase border-b border-slate-200 dark:border-neutral-800 pb-3 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> {getFormTitle()}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
              {/* Name */}
              <div className="space-y-1.5 text-xs text-slate-500">
                <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">Representative Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition duration-150"
                  id="inq-form-name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-xs text-slate-500">
                <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sjenkins@kenyatechgroup.co.ke"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition duration-150"
                  id="inq-form-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
              {/* Organization */}
              <div className="space-y-1.5 text-xs text-slate-500">
                <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">Affiliated Organization</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Kenya Tech Group / None"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition duration-150"
                  id="inq-form-org"
                />
              </div>

              {/* Dynamic field for Service selection */}
              {activeFormType === "service" ? (
                <div className="space-y-1.5 text-xs text-slate-500">
                  <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">Requested Service Class</label>
                  <select
                     value={serviceCategory}
                     onChange={(e) => setServiceCategory(e.target.value)}
                     className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs cursor-pointer"
                     id="inq-form-service"
                  >
                     <option value="Software Development">Software Development</option>
                     <option value="AI Solutions">AI Solutions & Integration</option>
                     <option value="KI Systems">Decision Intelligence Systems</option>
                     <option value="Logo Design">Logo & Brand Identity</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs text-slate-500">
                  <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">Operational Country Ingress</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Global (United Kingdom, Kenya, Germany...)"
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 cursor-not-allowed text-xs"
                    id="inq-form-country"
                  />
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5 text-xs text-slate-500 font-sans">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">Detailed Scope of Request *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include estimated starting parameters, core database nodes, desired launch timelines, etc..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition duration-150"
                id="inq-form-message"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg font-mono transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-cyan-500/10"
              id="submit-inquiry-btn"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Transmit Ticket Node</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
