import React from 'react';
import { Project, ProjectStatus } from '../types';
import ProjectCard from '../components/ProjectCard';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Christmas Beef Wellington',
    status: ProjectStatus.PUBLISHED,
    createdAt: new Date('2023-12-20'),
    frames: [],
    recipe: {
      id: 'r1',
      title: 'Christmas Beef Wellington',
      description: 'A classic centerpiece for the holidays.',
      viralityScore: 95,
      ingredients: []
    }
  },
  {
    id: '2',
    title: 'Sparkling Cranberry Cocktail',
    status: ProjectStatus.READY,
    createdAt: new Date('2023-12-22'),
    frames: [],
    recipe: {
      id: 'r2',
      title: 'Sparkling Cranberry Cocktail',
      description: 'Festive drink with amazing colors.',
      viralityScore: 88,
      ingredients: []
    }
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 mt-2">Manage your AI content pipeline</p>
        </div>
        <Link to="/create" className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
          <Plus size={20} />
          New Generation
        </Link>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Views</p>
          <h3 className="text-3xl font-bold text-white">1.2M</h3>
          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
            <span>+12%</span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-1">Assets Generated</p>
          <h3 className="text-3xl font-bold text-white">342</h3>
          <div className="mt-2 text-xs text-primary flex items-center gap-1">
            <span>Using Gemini 3 Pro</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-1">Pipeline Status</p>
          <h3 className="text-3xl font-bold text-white">Active</h3>
          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>n8n Connected</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-6">Recent Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
        
        {/* Empty State / Create New Card */}
        <Link to="/create" className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:bg-slate-800/30 transition-all cursor-pointer min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <span className="font-medium">Create New Project</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
