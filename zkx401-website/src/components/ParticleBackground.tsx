import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 30 : 60; // Reduced for light theme
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.15 + 0.05,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const updateParticle = (particle: Particle, time: number) => {
      // Mouse attraction (gentle)
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const force = (120 - distance) / 120 * 0.01;
        particle.vx += (dx / distance) * force;
        particle.vy += (dy / distance) * force;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary bounce
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Gentle direction changes
      if (Math.random() < 0.001) {
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05;
      }

      // Limit velocity
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      const maxSpeed = 0.5;
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }

      // Update pulse phase
      particle.pulsePhase += 0.02;
    };

    const drawParticle = (particle: Particle, time: number) => {
      const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulsePhase + time * 0.001));
      
      ctx.save();
      ctx.globalAlpha = pulseOpacity;
      
      // Main particle
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Subtle glow
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.1)';
      ctx.fill();
      
      ctx.restore();
    };

    const drawConnections = (time: number) => {
      const particles = particlesRef.current;
      const maxDistance = 100;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.08;
            
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 0.5;
            
            // Animate connection opacity
            const pulseOpacity = opacity * (0.7 + 0.3 * Math.sin(time * 0.002 + i * 0.5));
            ctx.globalAlpha = pulseOpacity;
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      timeRef.current += 16; // ~60fps
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections first (background)
      drawConnections(time);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        updateParticle(particle, time);
        drawParticle(particle, time);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouseRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize
    resizeCanvas();
    createParticles();

    if (!prefersReducedMotion) {
      animate();
    } else {
      // Static particles for accessibility
      drawConnections(timeRef.current);
      particlesRef.current.forEach(particle => drawParticle(particle, timeRef.current));
    }

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}