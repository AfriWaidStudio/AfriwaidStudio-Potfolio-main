import React from "react";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Building Africa's Next Generation of Intelligent Digital Systems",
  subtitle = "We craft sophisticated software, decision intelligence MCDA models, and fine editorial papers for global impact.",
  primaryCta = "Explore Our Work",
  secondaryCta = "Book a Consultation",
}) => {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-100/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            {title}
          </h1>
          <p className="text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold text-base hover:bg-cyan-600 transition-colors flex items-center gap-2">
            {primaryCta}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-semibold text-base hover:bg-slate-100 transition-colors">
            {secondaryCta}
          </button>
        </div>
      </div>
    </section>
  );
};