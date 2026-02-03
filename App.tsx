
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppConfig } from './types';
import { DEFAULT_CONFIG, CONFIG_KEY } from './constants';
import Home from './pages/Home';
import Result from './pages/Result';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const updateConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    document.documentElement.style.setProperty('--accent-color', config.accentColor);
  }, [config.primaryColor, config.accentColor]);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative shadow-2xl bg-white ring-1 ring-slate-100">
      <Routes>
        <Route path="/" element={<Home config={config} />} />
        <Route path="/result" element={<Result config={config} />} />
        <Route path="/admin" element={<Admin config={config} updateConfig={updateConfig} />} />
      </Routes>
    </div>
  );
};

export default App;
