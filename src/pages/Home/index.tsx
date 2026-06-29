import React from "react";
import { Hero, Statistics } from "./components";

interface HomePageProps {
  stats?: {
    projectsCompleted: number;
    applicationsBuilt: number;
    aiSystemsDeveloped: number;
    articlesPublished: number;
    brandsCreated: number;
    videosProduced: number;
    clientsServed: number;
  };
}

export const HomePage: React.FC<HomePageProps> = ({ stats }) => {
  const defaultStats = {
    projectsCompleted: 24,
    applicationsBuilt: 18,
    aiSystemsDeveloped: 12,
    articlesPublished: 8,
    brandsCreated: 6,
    videosProduced: 15,
    clientsServed: 30,
  };

  const displayStats = stats || defaultStats;

  const statItems = [
    { label: "Projects Completed", value: displayStats.projectsCompleted },
    { label: "Applications Built", value: displayStats.applicationsBuilt },
    { label: "AI Systems", value: displayStats.aiSystemsDeveloped },
    { label: "Clients Served", value: displayStats.clientsServed },
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      <Statistics stats={statItems} />
    </div>
  );
};