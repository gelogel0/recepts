import React from 'react';
import { LayoutDashboard, PlusCircle, Settings, Box, Share2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Assuming standard routing

interface SidebarProps {
  activePath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'New Project', path: '/create' },
    { icon: Box, label: 'Assets', path: '/assets' },
    { icon: Share2, label: 'Integrations', path: '/integrations' }, // Place for n8n config
  ];

  return (
    <div className="w-64 h-screen bg-surface border-r border-slate-700 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          ContentChef
        </h1>
        <p className="text-xs text-slate-400 mt-1">AI Content Factory</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 w-full rounded-xl hover:bg-slate-700/50 transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
