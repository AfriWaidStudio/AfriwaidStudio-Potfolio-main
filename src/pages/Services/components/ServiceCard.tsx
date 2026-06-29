import React from "react";
import { ServiceOffer } from "../../../types";
import { Card } from "../../../components/ui";

interface ServiceCardProps {
  service: ServiceOffer;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{service.title}</h3>
          <span className="text-xs font-mono bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 px-2 py-1 rounded">
            {service.category}
          </span>
        </div>
        <p className="text-base leading-7 text-slate-600 dark:text-zinc-400 mb-4">
          {service.description}
        </p>
        <div className="flex items-center text-cyan-500 group-hover:translate-x-1 transition-transform">
          <span className="text-base font-medium">Learn More</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};