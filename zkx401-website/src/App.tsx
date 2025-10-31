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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 font-primary text-text-primary antialiased relative overflow-hidden">
      {/* Atmospheric Smoky Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/25 via-blue-900/15 to-slate-950/90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_20%_50%_at_30%_20%,_rgba(37,99,235,0.15),transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_25%_40%_at_80%_70%,_rgba(15,23,42,0.8),transparent)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(15,23,42,0.3)_50%,_transparent_75%)]"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_60%_70%,_rgba(59,130,246,0.05),_rgba(15,23,42,0.8),_rgba(59,130,246,0.05),_transparent)]"></div>
      {/* Subtle Noise Texture for Smoky Effect */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }}></div>
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