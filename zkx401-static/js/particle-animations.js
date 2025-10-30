// Particle Animation System for ZKx401 Website
// Optimized for performance with transform and opacity animations only

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.particleCount = 100; // Default for desktop
        this.connectionDistance = 120;
        this.mouseInfluence = 150;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust particle count based on screen size
        if (window.innerWidth < 768) {
            this.particleCount = 50; // Reduced for mobile
        } else if (window.innerWidth < 1024) {
            this.particleCount = 80; // Tablet
        } else {
            this.particleCount = 100; // Desktop
        }
        
        // Recreate particles with new count
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.3,
                baseOpacity: Math.random() * 0.6 + 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.stopAnimation();
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary detection with bounce
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Mouse influence
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseInfluence && distance > 0) {
                const force = (this.mouseInfluence - distance) / this.mouseInfluence;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }
            
            // Add some randomness to movement
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01;
            
            // Dampen velocity
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Pulsing opacity
            const time = Date.now() * 0.001;
            particle.opacity = particle.baseOpacity + Math.sin(time * particle.pulseSpeed + particle.pulseOffset) * 0.2;
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            this.ctx.fill();
        });
    }
    
    findConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.connections.push({
                        x1: particle1.x,
                        y1: particle1.y,
                        x2: particle2.x,
                        y2: particle2.y,
                        opacity: opacity * 0.2 // Reduced opacity for wires
                    });
                }
            }
        }
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        this.ctx.lineWidth = 1;
        
        this.connections.forEach(connection => {
            this.ctx.beginPath();
            this.ctx.moveTo(connection.x1, connection.y1);
            this.ctx.lineTo(connection.x2, connection.y2);
            this.ctx.globalAlpha = connection.opacity;
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const animate = () => {
            this.updateParticles();
            this.drawConnections();
            this.drawParticles();
            this.findConnections();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Draw static particles
        this.drawParticles();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            const particleSystem = new ParticleSystem(canvas);
            
            // Make particle system globally available for debugging
            window.particleSystem = particleSystem;
        } else {
            // Draw static background for reduced motion
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Draw static particles
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 2 + 1;
                const opacity = Math.random() * 0.4 + 0.2;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
                ctx.fill();
            }
        }
    }
});

// Handle visibility change to pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (window.particleSystem) {
        if (document.hidden) {
            window.particleSystem.stopAnimation();
        } else {
            window.particleSystem.animate();
        }
    }
});

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link, .hero-ctas a, .cta-buttons a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Navbar background on scroll
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        }
        
        lastScrollTop = scrollTop;
    });
});

// Copy button functionality for code blocks
document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const copyType = button.getAttribute('data-copy');
            const codeElement = document.getElementById(copyType);
            
            if (codeElement) {
                try {
                    await navigator.clipboard.writeText(codeElement.textContent);
                    
                    // Visual feedback
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.style.color = '#22c55e';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.color = '';
                    }, 2000);
                    
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = codeElement.textContent;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
            }
        });
    });
});

// Intersection Observer for fade-in animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .use-case-item, .code-block, .mission-content, .cta-content'
    );
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.animation = 'fade-in-up 0.6s ease-out forwards';
        element.style.animationPlayState = 'paused';
        
        observer.observe(element);
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll-based functions
const throttledScrollHandler = throttle(() => {
    // Additional scroll-based functionality can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);