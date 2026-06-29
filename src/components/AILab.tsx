import React, { useState, useEffect, useRef } from "react";
import { 
  Brain, 
  Cpu, 
  MessageSquare, 
  Sparkles, 
  X, 
  Send, 
  RefreshCw, 
  Bot 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CustomizationSettings } from "../types";

interface Criteria {
  id: string;
  name: string;
  weight: number; // 0 to 1
  description: string;
}

interface OptionScore {
  name: string;
  scores: Record<string, number>; // criteriaId -> score (1 to 10)
}

interface AILabProps {
  customization?: CustomizationSettings;
}

export default function AILab({ customization }: AILabProps) {
  // Consultant state
  const [prompt, setPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Floating Chat Bubble State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; text: string }>>(() => {
    try {
      const saved = localStorage.getItem("afriwaid_lab_chat");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading chat history from localStorage:", e);
    }
    return [
      { role: "model", text: "Hello! I am AfriBot, your interactive AI lab companion. Ask me anything about AfriWaid's AI Engine (WaidPulse), KI Systems (KonsOS), our visual Design Canvas, or our premium software tech stack!" }
    ];
  });
  const [isChatTyping, setIsChatTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync chat message history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("afriwaid_lab_chat", JSON.stringify(chatMessages));
    } catch (e) {
      console.error("Error saving chat history to localStorage:", e);
    }
  }, [chatMessages]);

  // Auto-scroll logic to track newest messages
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen, isChatTyping]);

  const handleSendChatMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || isChatTyping) return;

    // Append user message
    const updatedMessages = [...chatMessages, { role: "user" as const, text: textToSend }];
    setChatMessages(updatedMessages);
    if (!customText) setChatInput("");
    setIsChatTyping(true);

    try {
      const historyToSend = updatedMessages.slice(0, -1);

      const response = await fetch("/api/ai-lab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyToSend
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach server-side model layer.");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "model" as const, text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        role: "model" as const, 
        text: "System Alert: I encountered a microservice network delay while reaching our model. Please try asking again in a moment." 
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([
      { role: "model", text: "Hello! I am AfriBot, your interactive AI lab companion. Ask me anything about AfriWaid's AI Engine (WaidPulse), KI Systems (KonsOS), our visual Design Canvas, or our premium software tech stack!" }
    ]);
  };

  // KonsOSMCDA Simulator State
  const [criteria, setCriteria] = useState<Criteria[]>([
    { id: "scal", name: "Scalability", weight: 0.4, description: "Ability to handle transaction spike peaks." },
    { id: "sec", name: "Security Gateways", weight: 0.3, description: "Compliance with data isolation audits." },
    { id: "cost", name: "OpEx Efficiency", weight: 0.1, description: "Cost efficiency under idle states." },
    { id: "lat", name: "Edge Latency", weight: 0.2, description: "Response latency times under global ingress." }
  ]);

  const options: OptionScore[] = [
    { name: "Serverless Micro-Container", scores: { scal: 9.5, sec: 7.0, cost: 9.0, lat: 6.5 } },
    { name: "Isolated Dedicated Instance", scores: { scal: 7.5, sec: 9.5, cost: 5.0, lat: 8.5 } },
    { name: "Edge Hybrid Gateway", scores: { scal: 8.5, sec: 8.0, cost: 7.5, lat: 9.5 } }
  ];

  const handleAskConsultant = async (customPrompt?: string) => {
    const textToAsk = customPrompt || prompt;
    if (!textToAsk.trim()) return;

    setLoading(true);
    setChatResponse(null);

    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToAsk })
      });
      const data = await res.json();
      setChatResponse(data.text);
    } catch (e) {
      console.error(e);
      setChatResponse("Error: Operational connectivity failure. Unable to access server middleware API.");
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (id: string, val: number) => {
    const updated = criteria.map(c => c.id === id ? { ...c, weight: val } : c);
    setCriteria(updated);
  };

  const calculateTotalScore = (opt: OptionScore) => {
    let sum = 0;
    let totalWeight = 0;
    criteria.forEach(c => {
      sum += (opt.scores[c.id] || 0) * c.weight;
      totalWeight += c.weight;
    });
    return totalWeight > 0 ? (sum / totalWeight).toFixed(2) : "0.00";
  };

  const suggestedPrompts = [
    { label: "Predict Agritech Agent Latency", text: "What is an acceptable network latency buffer when sending USSD triggered agritech data to Gemini-3.5 agent controllers?" },
    { label: "MCDA Optimization Formula", text: "Give me the mathematical formula to weight Security Gateways vs OpEx Efficiency in a financial regulatory app." },
    { label: "Spatial Tech Branding", text: "Suggest typography, dark neutral color spectrum values, and motion curves for a spatial design studio in Blender." }
  ];

  return (
    <div className="space-y-12 text-slate-850">
      {/* Intro Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono tracking-widest uppercase font-bold">
          <Brain className="w-3.5 h-3.5 animate-pulse text-blue-600" />
          {customization?.aiLabTagline || "Neural Architecture & Design Lab"}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-950">
          {customization?.aiLabTitle || "Active AI & KI Innovation Playground"}
        </h1>
        <p className="text-slate-500 text-base md:text-md text-center font-sans leading-relaxed">
          {customization?.aiLabDescription || "Experiment directly with our server-side cognitive modules of AfriWaid. Consult our live systems analyst or tweak the decision criteria weight formulas dynamically."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Live Consultant Console (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden space-y-6 shadow-xs text-left">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-300">
            <Sparkles className="w-40 h-40" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-55 border border-blue-150 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-display text-slate-900 font-extrabold">Server-Side Systems Consultant</h3>
              <p className="text-xs text-slate-400 font-mono font-bold">MODEL ID: gemini-3.5-flash-latest</p>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <label className="text-xs text-slate-400 tracking-wider uppercase font-mono font-bold">Select a pre-configured scenario</label>
            <div className="grid grid-cols-1 gap-2">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.text);
                    handleAskConsultant(p.text);
                  }}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-xs text-slate-600 transition duration-150 flex items-center justify-between cursor-pointer font-medium"
                  id={`quick-prompt-${idx}`}
                >
                  <span className="truncate pr-4">{p.label}</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 opacity-80 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 font-sans">
            <label className="text-xs text-slate-400 tracking-wider uppercase font-mono font-bold">Custom Technical Consultation Query</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask our systems advisor regarding databases, machine learning, or brand workflows..."
                className="flex-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500"
                id="consultant-query-input"
              />
              <button
                onClick={() => handleAskConsultant()}
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition duration-150 disabled:opacity-40 whitespace-nowrap flex items-center justify-center flex-shrink-0 cursor-pointer"
                id="consultant-query-btn"
              >
                {loading ? "Analyzing..." : "Inquire"}
              </button>
            </div>
          </div>

          {/* Response Deck */}
          <AnimatePresence mode="wait">
            {(loading || chatResponse) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-xs text-blue-700 font-mono tracking-wider uppercase font-bold">Active Response Terminal</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {loading ? (
                  <div className="py-4 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-350 border-t-blue-600 animate-spin" />
                    <p className="text-xs text-slate-405 font-mono font-bold">Routing query through AfriWaid proxy gateway...</p>
                  </div>
                ) : (
                  <div className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-line text-left bg-white p-3 border border-slate-200 rounded-md">
                    {chatResponse}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: KonsOSMCDA Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs text-left animate-fadeIn">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-55 border border-blue-150 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-display text-slate-900 font-extrabold">KonsOSMCDA Score Matrix</h3>
                <p className="text-xs text-slate-400 font-mono font-bold">COMPLIANCE CRITERIA ADJUSTER</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              MCDA mathematical systems prevent bias in corporate tool selection. Change the criteria slide weights locally below to evaluate real-time architectural resilience calculations.
            </p>

            <div className="space-y-4 font-sans">
              {criteria.map((c) => (
                <div key={c.id} className="space-y-1.5 p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-900 font-bold">{c.name}</span>
                    <span className="text-blue-700 font-mono font-bold">Weight: {(c.weight * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={c.weight}
                    onChange={(e) => handleWeightChange(c.id, parseFloat(e.target.value))}
                    className="w-full accent-blue-605 bg-slate-200 rounded-lg appearance-none h-1.5 cursor-pointer"
                    id={`slider-criteria-${c.id}`}
                  />
                  <p className="text-[10px] text-slate-400 font-medium font-sans leading-tight">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 font-sans">
            <h4 className="text-xs text-slate-400 tracking-wider uppercase font-mono font-bold">Calculated Resiliency Index Results</h4>
            <div className="space-y-3">
              {options.map((opt, idx) => {
                const finalScore = parseFloat(calculateTotalScore(opt));
                const widthPercent = finalScore * 10;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-mono font-extrabold">{opt.name}</span>
                      <span className="text-slate-900 font-bold font-mono text-right">{finalScore} / 10.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200 p-0.5">
                      <div
                        className="bg-blue-650 h-full rounded-full transition-all duration-300"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING AI CHAT BUBBLE FOR AI LAB */}
      <div className="fixed bottom-6 right-6 z-50 font-sans pointer-events-none">
        <div className="relative flex flex-col items-end pointer-events-auto">
          
          {/* Chat Panel Box */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-16 right-0 w-[320px] sm:w-[380px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left"
                style={{ maxHeight: "calc(100vh - 120px)", height: "450px" }}
              >
                {/* Header */}
                <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-display font-extrabold text-slate-100 tracking-wide flex items-center gap-1">
                        AfriBot Co-Pilot <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                      </h4>
                      <p className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
                        SYSTEM NODE ACTIVE
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleResetChat}
                      title="Clear discussion"
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                      id="lab-chat-reset-btn"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChatOpen(false)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                      id="lab-chat-close-btn"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Messages Body Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/95 scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={
                          msg.role === "user"
                            ? "bg-indigo-600 text-slate-100 rounded-2xl rounded-tr-none px-3.5 py-2.5 text-xs sm:text-sm max-w-[85%] shadow-md"
                            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs sm:text-sm max-w-[85%] space-y-2 shadow-xs"
                        }
                      >
                        {msg.role === "model" ? (
                          <div className="space-y-1.5 leading-relaxed">
                            {renderFormattedText(msg.text)}
                          </div>
                        ) : (
                          <p className="leading-relaxed font-sans">{msg.text}</p>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                        {msg.role === "user" ? "USER_INPUT" : "AFRIBOT_OUTPUT"}
                      </span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isChatTyping && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-xs">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                        <span className="text-xs text-slate-400 ml-1 font-sans">AfriBot is typing...</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">FORMULATING_COGNITION...</span>
                    </div>
                  )}

                  {/* Starter Quick Actions Tag Deck */}
                  {chatMessages.length === 1 && !isChatTyping && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">// INITIALIZE DIAGNOSTICS</span>
                      <div className="flex flex-col gap-1.5">
                        {[
                          "Tell me about WaidPulse AI Engine",
                          "What is KonsOSDecision Matrix?",
                          "What elements make up AfriWaid's tech stack?"
                        ].map((promptText, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendChatMessage(undefined, promptText)}
                            className="text-left text-[11px] px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition duration-150 hover:border-slate-750 cursor-pointer"
                            id={`suggested-chat-${idx}`}
                          >
                            <span className="font-sans leading-relaxed text-slate-300 font-medium">{promptText}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Form */}
                <form
                  onSubmit={handleSendChatMessage}
                  className="border-t border-slate-800 bg-slate-900/40 p-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask regarding projects or technology stack..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
                    id="lab-chat-input-field"
                    disabled={isChatTyping}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatTyping}
                    className="p-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition duration-150 flex items-center justify-center shrink-0 cursor-pointer"
                    id="lab-chat-submit-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Floating Action Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 shadow-2xl transition-all duration-300 pointer-events-auto cursor-pointer relative group"
            id="lab-chat-trigger-btn"
            title="Open AI Chat Assistant"
          >
            {/* Glowing Ring Accent */}
            <span className="absolute inset-x-0 -inset-y-0.5 rounded-full bg-indigo-500/10 blur-md group-hover:bg-indigo-500/20 transition-all duration-300 animate-pulse pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5 text-indigo-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 95, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -95, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping border border-slate-950" />
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-slate-950" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

        </div>
      </div>

    </div>
  );
}

// Lightweight custom TSX layout formatter for markdown-like styles (bolds, backticks, list items)
function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let isBullet = false;
    let processedLine = line;

    if (line.trim().startsWith("- ")) {
      isBullet = true;
      processedLine = line.trim().substring(2);
    } else if (line.trim().startsWith("* ")) {
      isBullet = true;
      processedLine = line.trim().substring(2);
    }

    const parts = processedLine.split("**");
    const renderedParts = parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return <strong key={pIdx} className="font-bold text-indigo-300">{part}</strong>;
      }

      const subParts = part.split("`");
      return subParts.map((subPart, sIdx) => {
        if (sIdx % 2 === 1) {
          return (
            <code key={sIdx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-cyan-400 font-bold">
              {subPart}
            </code>
          );
        }
        return subPart;
      });
    });

    if (isBullet) {
      return (
        <div key={idx} className="flex gap-2 items-start text-xs sm:text-sm pl-2 font-sans text-slate-300 leading-relaxed py-0.5">
          <span className="text-indigo-400 select-none">▪</span>
          <span className="flex-1">{renderedParts}</span>
        </div>
      );
    }

    return (
      <p key={idx} className={`font-sans leading-relaxed text-xs sm:text-sm text-slate-300 ${line.trim() === "" ? "h-2" : ""}`}>
        {renderedParts}
      </p>
    );
  });
}
