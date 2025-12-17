import React from 'react';
import { Play, Clock, CheckCircle, BarChart2 } from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColor = {
    [ProjectStatus.DRAFT]: 'text-slate-400 bg-slate-400/10',
    [ProjectStatus.GENERATING]: 'text-blue-400 bg-blue-400/10',
    [ProjectStatus.READY]: 'text-green-400 bg-green-400/10',
    [ProjectStatus.PUBLISHED]: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <div className="bg-surface rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[project.status]}`}>
          {project.status}
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <BarChart2 size={16} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      
      <p className="text-sm text-slate-400 mb-6 line-clamp-2">
        {project.recipe?.description || "No description available."}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700 pt-4">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{project.createdAt.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          {project.status === ProjectStatus.READY ? (
             <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14}/> Ready to export</span>
          ) : (
            <span>{project.frames.length} Assets</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
