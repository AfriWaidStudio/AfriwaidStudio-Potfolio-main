import React from "react";
import { ServiceOffer } from "../../types";
import { ServiceCard } from "./components/ServiceCard";

interface ServicesPageProps {
  services: ServiceOffer[];
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services }) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">Our Services</h1>
          <p className="text-base lg:text-lg leading-8 text-slate-600 dark:text-zinc-400 mt-2 max-w-3xl">
            Comprehensive digital solutions for modern businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};