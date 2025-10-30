import ParticleBackground from './ParticleBackground';

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background-pure-black overflow-hidden">
      {/* Animated Particle Background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/10 rounded-full mb-4">
            <span className="text-2xl font-bold text-accent-primary">Z</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-hero-title font-bold text-text-primary leading-tight mb-6 tracking-tight">
          ZKx401
        </h1>

        {/* Subtitle */}
        <p className="text-body-large text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
          Privacy-Enhanced x402 Protocol for Solana
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => scrollToSection('quickstart')}
            className="bg-accent-primary hover:bg-accent-hover text-white px-8 py-3 rounded-md font-semibold text-body transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary min-w-[140px]"
          >
            Get Started
          </button>
          <button 
            onClick={() => scrollToSection('mission')}
            className="border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-8 py-3 rounded-md font-semibold text-body transition-all duration-150 transform hover:-translate-y-0.5 min-w-[140px]"
          >
            View Documentation
          </button>
        </div>

        {/* NPM Package Reference */}
        <div className="mt-12">
          <div className="inline-flex items-center px-4 py-2 bg-background-elevated border border-border-subtle rounded-md">
            <span className="text-small text-text-tertiary mr-2">npm package:</span>
            <span className="text-small text-accent-primary font-mono">@payai/x402-solana</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-text-tertiary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-text-tertiary rounded-full mt-2 animate-glow-pulse"></div>
        </div>
      </div>
    </section>
  );
}