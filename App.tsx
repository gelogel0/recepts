import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simple hook to get current path for sidebar active state
  // In a real router setup, sidebar would use useLocation hook internally
  const path = window.location.hash.replace('#', '') || '/';
  
  return (
    <div className="flex min-h-screen bg-background text-slate-100 font-sans">
      <Sidebar activePath={path} />
      <main className="flex-1 ml-64 bg-background">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  // Check for API Key
  if (!process.env.API_KEY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Configuration Error</h1>
        <p className="text-slate-400 max-w-md text-center">
          The <code>API_KEY</code> environment variable is missing. 
          Please add your Google Gemini API Key to the environment to run the ContentChef.
        </p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
