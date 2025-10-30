import { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import KeyFeaturesSection from './components/KeyFeaturesSection';
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
    <div className="min-h-screen bg-background-near-white font-primary text-text-primary antialiased">
      {showBootScreen ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <>
          <Navigation />
          <main>
            <HeroSection />
            <MissionSection />
            <KeyFeaturesSection />
            <TechnicalIntegrationSection />
            <UseCasesSection />
            <CTAFooterSection />
          </main>
        </>
      )}
    </div>
  );
}

export default App;