import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import MLInsights from './pages/MLInsights';
import DemoMode from './pages/DemoMode';
import About from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [latestResult, setLatestResult] = useState(null);

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleAssessmentComplete = (result) => {
    setLatestResult(result);
    setActiveTab('results');
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'home' && (
          <Home setActiveTab={setActiveTab} />
        )}

        {activeTab === 'assessment' && (
          <Assessment
            onAssessmentComplete={handleAssessmentComplete}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'results' && (
          <Results
            result={latestResult}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'exercises' && (
          <Exercises />
        )}

        {activeTab === 'ml-insights' && (
          <MLInsights />
        )}

        {activeTab === 'demo-mode' && (
          <DemoMode
            setActiveTab={setActiveTab}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}

        {activeTab === 'about' && (
          <About setActiveTab={setActiveTab} />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
