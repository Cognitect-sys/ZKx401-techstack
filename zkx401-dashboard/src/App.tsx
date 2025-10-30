import React from 'react';
import Navigation from './components/ui/Navigation';
import HeroSection from './components/dashboard/HeroSection';
import NetworkMonitor from './components/dashboard/NetworkMonitor';
import FacilitatorComparison from './components/dashboard/FacilitatorComparison';
import CompetitiveAdvantages from './components/dashboard/CompetitiveAdvantages';
import PaymentRouting from './components/dashboard/PaymentRouting';
import ActivityFeed from './components/dashboard/ActivityFeed';
import Footer from './components/ui/Footer';

function App() {
  return (
    <div className="dashboard-container">
      <Navigation />
      
      <main>
        <HeroSection />
        <NetworkMonitor />
        <FacilitatorComparison />
        <CompetitiveAdvantages />
        <PaymentRouting />
        <ActivityFeed />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;