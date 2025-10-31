import ParticleBackground from './ParticleBackground';

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {/* Animated Particle Background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/10 rounded-full mb-4 animate-float">
            <span className="text-2xl font-bold text-accent-primary">Z</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-hero-title font-bold text-text-primary leading-tight mb-6 tracking-tight animate-slide-up">
          ZKx401
        </h1>

        {/* Subtitle */}
        <p className="text-body-large text-text-secondary mb-8 leading-relaxed max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
          Deploy autonomous private agents with zero-knowledge x401
        </p>
        
        {/* Agent Description */}
        <p className="text-body-medium text-text-muted mb-8 leading-relaxed max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.25s'}}>
          Build and deploy fully autonomous agents that operate with complete privacy through advanced zero-knowledge protocols, enabling secure blockchain interactions without exposing sensitive data.
        </p>



        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.4s'}}>
          <button 
            onClick={() => scrollToSection('daydreams-demo')}
            className="bg-accent-primary hover:bg-accent-hover text-white px-8 py-3 rounded-md font-semibold text-body transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary min-w-[160px]"
          >
            Start Architecture Demo
          </button>
          <button 
            onClick={() => scrollToSection('usecases')}
            className="border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-8 py-3 rounded-md font-semibold text-body transition-all duration-150 transform hover:-translate-y-0.5 min-w-[160px]"
          >
            Explore Use Cases
          </button>
        </div>
      </div>
    </section>
  );
}