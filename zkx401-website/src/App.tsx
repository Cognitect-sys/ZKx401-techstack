import { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import KeyFeaturesSection from './components/KeyFeaturesSection';
import DaydreamsDemo from './components/DaydreamsDemo';
import TechnicalIntegrationSection from './components/TechnicalIntegrationSection';
import UseCasesSection from './components/UseCasesSection';
import CTAFooterSection from './components/CTAFooterSection';
import BootScreen from './components/BootScreen';
import './App.css';

function App() {
  const [showBootScreen, setShowBootScreen] = useState(true);

  const handleBootComplete = () => {
    setShowBootScreen(false);
  };

  return (
    <div className="min-h-screen bg-background-near-black font-primary text-text-primary antialiased relative overflow-hidden">
      {/* Smoky Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="relative z-10">
      {showBootScreen ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <>
          <Navigation />
          <main>
            <HeroSection />
            <DaydreamsDemo />
            <MissionSection />
            <KeyFeaturesSection />
            <TechnicalIntegrationSection />
            <UseCasesSection />
            <CTAFooterSection />
          </main>
        </>
      )}
      </div>
    </div>
  );
}

export default App;