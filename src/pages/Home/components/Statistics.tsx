import React from "react";

interface StatItem {
  label: string;
  value: string | number;
  suffix?: string;
}

interface StatisticsProps {
  stats: StatItem[];
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center space-y-2">
            <div className="text-4xl font-bold">
              {stat.value}{stat.suffix || ""}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};