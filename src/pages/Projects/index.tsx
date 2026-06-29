import React from "react";
import { Project } from "../../types";
import { ProjectCard } from "./components/ProjectCard";

interface ProjectsPageProps {
  projects: Project[];
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">Featured Projects</h1>
          <p className="text-base leading-7 text-slate-600 dark:text-zinc-400 mt-2">
            A showcase of our most impactful work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};