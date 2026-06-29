import React from "react";
import { Project } from "../../../types";
import { Card } from "../../../components/ui";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-700 rounded-t-xl overflow-hidden">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No Image
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{project.name}</h3>
          <span className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded">
            {project.category}
          </span>
        </div>
        <p className="text-base leading-7 text-slate-600 dark:text-zinc-400">
          {project.description}
        </p>
      </div>
    </Card>
  );
};