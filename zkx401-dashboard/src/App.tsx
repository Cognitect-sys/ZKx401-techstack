import React from 'react';
import Navigation from './components/ui/Navigation';
import HeroSection from './components/dashboard/HeroSection';
import SimpleNetworkMonitor from './components/dashboard/SimpleNetworkMonitor';
import FacilitatorComparison from './components/dashboard/FacilitatorComparison';
import CompetitiveAdvantages from './components/dashboard/CompetitiveAdvantages';
import PaymentRouting from './components/dashboard/PaymentRouting';
import UseCasesSection from './components/dashboard/UseCasesSection';
import Footer from './components/ui/Footer';

function App() {
  return (
    <div className="dashboard-container">
      <Navigation />
      
      <main>
        <HeroSection />
        <SimpleNetworkMonitor />
        <FacilitatorComparison />
        <CompetitiveAdvantages />
        <PaymentRouting />
        <UseCasesSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;