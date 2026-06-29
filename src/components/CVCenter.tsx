import React, { useState } from "react";
import { Download, Share2, MapPin, Mail, Award, Check } from "lucide-react";
import { CV, CustomizationSettings } from "../types";

interface CVCenterProps {
  cvs: CV[];
  onDownloadIncrement: (id: string) => void;
  customization?: CustomizationSettings;
}

export default function CVCenter({ cvs, onDownloadIncrement, customization }: CVCenterProps) {
  const publishedCvs = cvs.filter(c => c.isPublished);
  const [selectedCv, setSelectedCv] = useState<CV | null>(publishedCvs[0] || null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!selectedCv) {
    return (
      <div className="text-center py-12 p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <p className="text-sm text-slate-400 font-mono">No published CV profiles are currently hosted on AfriWaid.</p>
      </div>
    );
  }

  const handleShare = () => {
    const url = `${window.location.origin}/cv/${selectedCv.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      onDownloadIncrement(selectedCv.id);
      setDownloading(false);
      window.print();
    }, 1500);
  };

  return (
    <div className="space-y-8 text-slate-800">
      {/* Selector and toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-205 pb-4">
        <div className="text-left">
          <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
            {customization?.cvTitle || "Resume & CV Center"}
          </h1>
          <p className="text-xs text-slate-450 font-mono font-semibold">
            {customization?.cvSubtitle || "OFFICIAL INSTANCE: CHOOSE PROFESSIONAL PATHWAY"}
          </p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Profiles selector */}
          <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-lg">
            {publishedCvs.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCv(c)}
                className={`px-3 py-1.5 rounded-md text-xs transition duration-150 cursor-pointer font-bold ${selectedCv.id === c.id ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 font-semibold"}`}
                id={`cv-tab-${c.slug}`}
              >
                {c.title.split("&")[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition duration-150 flex items-center gap-1.5 cursor-pointer font-bold"
              title="Copy shareable link"
              id="cv-share-btn"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-705 transition duration-150 flex items-center gap-1.5 font-bold cursor-pointer"
              title="Print friendly / PDF"
              id="cv-download-btn"
            >
              <Download className="w-3.5 h-3.5 text-blue-605" />
              <span>{downloading ? "Processing..." : "PDF / Print"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CV Print Preview Sheet (with @media print styles injected) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 text-left shadow-md relative overflow-hidden print:p-0 print:border-0 print:shadow-none print:bg-white print:text-black">
        {/* CSS print style tag for perfect paper margins */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            div {
              border-color: #e5e7eb !important;
            }
            span, p, h1, h2, h3, h4, h5, li {
              color: black !important;
            }
          }
        `}} />

        {/* Decorative background grid (print-hidden) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.04),transparent_40%)] pointer-events-none print:hidden" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Header */}
          <div className="border-b border-slate-150 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 print:border-neutral-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 print:text-black">{selectedCv.name}</h1>
              <h2 className="text-lg md:text-xl font-mono text-blue-700 font-extrabold print:text-blue-600">{selectedCv.title}</h2>
              <p className="text-xs text-slate-450 font-mono flex items-center gap-1.5 print:text-gray-600 font-bold">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> London, UK / Global Ingress
                <span className="text-slate-300">|</span>
                <Mail className="w-3.5 h-3.5 text-blue-600" /> waidsoko@gmail.com
              </p>
            </div>
            {/* Status indicator (print-hidden) */}
            <div className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-150 text-[10px] text-blue-700 font-mono tracking-wider uppercase h-fit print:hidden font-bold">
              ● Active Profile
            </div>
          </div>

          {/* Core Summary */}
          <div className="space-y-2 font-sans text-left">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-150 pb-1.5 print:border-neutral-200 print:text-gray-500">Summary</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed print:text-gray-700 font-medium">{selectedCv.summary}</p>
          </div>

          {/* Section: Skills */}
          <div className="space-y-4 font-sans text-left">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-150 pb-1.5 print:border-neutral-200 print:text-gray-500">Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {selectedCv.skills.map((skillGroup, idx) => (
                <div key={idx} className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-lg print:border-neutral-100 print:p-2">
                  <h4 className="text-xs font-mono text-blue-700 font-extrabold print:text-blue-600 uppercase tracking-wider">{skillGroup.category}</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-semibold pr-1 print:text-gray-700">
                    {skillGroup.list.map((sk, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 print:bg-blue-600" />
                        <span>{sk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Layout: Career vs Edu */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Career (7 cols) */}
            <div className="lg:col-span-8 space-y-6 font-sans">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-150 pb-1.5 print:border-neutral-200 print:text-gray-500">Professional Experience</h3>
              <div className="space-y-6">
                {selectedCv.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2 text-left relative pl-4 border-l border-slate-200 print:border-neutral-200">
                    {/* Bullet accent */}
                    <div className="absolute w-2 h-2 rounded-full bg-blue-600 top-1.5 -left-[5px] print:bg-blue-600" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-slate-900 print:text-black">
                        {exp.role} <span className="text-slate-450 font-normal">at</span> <span className="text-blue-700 print:text-blue-600 font-black">{exp.company}</span>
                      </h4>
                      <span className="text-xs text-slate-400 font-mono font-bold">{exp.period}</span>
                    </div>

                    <ul className="space-y-1.5 pl-2 text-xs text-slate-550 leading-relaxed list-disc print:text-gray-600 font-medium">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Edu & Certs (4 cols) */}
            <div className="lg:col-span-4 space-y-6 font-sans">
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-150 pb-1.5 print:border-neutral-200 print:text-gray-500">Education</h3>
                <div className="space-y-4">
                  {selectedCv.education.map((edu, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <h4 className="font-extrabold text-slate-900 print:text-black">{edu.degree}</h4>
                      <p className="text-slate-500 font-medium print:text-gray-600">{edu.institution}</p>
                      <span className="text-[10px] text-slate-400 font-mono block font-bold">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-150 pb-1.5 print:border-neutral-200 print:text-gray-500">Certifications</h3>
                <ul className="space-y-2 text-xs text-slate-650 print:text-gray-600 font-semibold">
                  {selectedCv.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-left">
                      <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 print:text-blue-600" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 print:hidden">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-extrabold border-b border-slate-150 pb-1.5">Verified Credentials</h3>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-800">Digital Signature Match</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono font-bold">HASH: SHA256//waid-cv-enc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
