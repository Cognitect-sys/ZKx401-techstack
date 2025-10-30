// Main JavaScript for ZKx401 Website
// Handles interactive elements, animations, and user experience enhancements

class ZKx401Website {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupTypewriterEffect();
        this.setupButtonInteractions();
        this.setupCardHoverEffects();
        this.setupNavigationEnhancements();
        this.setupAccessibility();
    }
    
    // Smooth scroll animations and section highlighting
    setupScrollAnimations() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Update active nav link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                    
                    // Add scroll animation class
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // Typewriter effect for hero title
    setupTypewriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const originalText = heroTitle.textContent;
        const chars = originalText.split('');
        
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent-primary)';
        
        let i = 0;
        const typeSpeed = 100;
        
        const typeWriter = () => {
            if (i < chars.length) {
                heroTitle.textContent += chars[i];
                i++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typewriter effect after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // Enhanced button interactions
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Ripple effect on click
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            // Enhanced hover states
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Card hover effects with tilt
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.feature-card, .use-case-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.applyTiltEffect(e, card);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.updateTiltEffect(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetTiltEffect(card);
            });
        });
    }
    
    applyTiltEffect(event, element) {
        element.style.transition = 'transform 0.1s ease-out';
        element.style.willChange = 'transform';
    }
    
    updateTiltEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;
        
        const rotateX = (mouseY / (rect.height / 2)) * -10;
        const rotateY = (mouseX / (rect.width / 2)) * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
    
    resetTiltEffect(element) {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        element.style.transition = 'transform 0.3s ease-out';
    }
    
    // Enhanced navigation
    setupNavigationEnhancements() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;
        
        // Hide/show navbar on scroll
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
        
        // Add active states to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active to clicked link
                link.classList.add('active');
            });
        });
    }
    
    // Accessibility enhancements
    setupAccessibility() {
        // Focus management for keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-primary)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
        
        // Skip to content link
        this.createSkipToContentLink();
        
        // Keyboard navigation for custom components
        this.setupKeyboardNavigation();
    }
    
    createSkipToContentLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-to-content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupKeyboardNavigation() {
        // Arrow key navigation for feature grid
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                let nextIndex;
                
                switch (e.key) {
                    case 'ArrowRight':
                        nextIndex = (index + 1) % featureCards.length;
                        featureCards[nextIndex].focus();
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        nextIndex = (index - 1 + featureCards.length) % featureCards.length;
                        featureCards[nextIndex].focus();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        nextIndex = Math.min(index + 3, featureCards.length - 1);
                        featureCards[nextIndex].focus();
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        nextIndex = Math.max(index - 3, 0);
                        featureCards[nextIndex].focus();
                        e.preventDefault();
                        break;
                }
            });
        });
    }
}

// Code block enhancements
class CodeBlockEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSyntaxHighlighting();
        this.setupCopyButtons();
        this.setupExpandableBlocks();
    }
    
    setupSyntaxHighlighting() {
        // Basic syntax highlighting for code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const content = block.textContent;
            const highlightedContent = this.highlightSyntax(content);
            block.innerHTML = highlightedContent;
        });
    }
    
    highlightSyntax(code) {
        // Simple syntax highlighting
        return code
            .replace(/\/\*(.*?)\*\//g, '<span style="color: var(--text-tertiary);">/*$1*/</span>') // Comments
            .replace(/\b(import|from|const|let|var|function|return|if|else|for|while|class|extends|new)\b/g, '<span style="color: var(--accent-secondary);">$1</span>') // Keywords
            .replace(/"([^"]*)"/g, '<span style="color: var(--success);">"$1"</span>') // Strings
            .replace(/`([^`]*)`/g, '<span style="color: var(--success);">`$1`</span>') // Template strings
            .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: var(--accent-primary);">$1</span>'); // Numbers
    }
    
    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const codeBlock = button.closest('.code-block').querySelector('code');
                const text = codeBlock.textContent;
                
                try {
                    await navigator.clipboard.writeText(text);
                    this.showCopySuccess(button);
                } catch (err) {
                    console.error('Copy failed:', err);
                    this.showCopyError(button);
                }
            });
        });
    }
    
    showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.background = 'var(--success)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }
    
    showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = '✗ Failed';
        button.style.background = 'var(--error)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }
    
    setupExpandableBlocks() {
        // Add expand/collapse functionality for long code blocks
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            const code = block.querySelector('code');
            const lineCount = code.textContent.split('\n').length;
            
            if (lineCount > 20) {
                const toggleButton = document.createElement('button');
                toggleButton.textContent = 'Expand';
                toggleButton.className = 'expand-btn';
                toggleButton.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 80px;
                    background: var(--bg-hover);
                    color: var(--text-secondary);
                    border: 1px solid var(--border-subtle);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                `;
                
                const header = block.querySelector('.code-header');
                header.style.position = 'relative';
                header.appendChild(toggleButton);
                
                let isExpanded = false;
                
                toggleButton.addEventListener('click', () => {
                    isExpanded = !isExpanded;
                    
                    if (isExpanded) {
                        code.style.maxHeight = 'none';
                        toggleButton.textContent = 'Collapse';
                    } else {
                        code.style.maxHeight = '300px';
                        toggleButton.textContent = 'Expand';
                    }
                });
            }
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.measureLoadTime();
        this.monitorAnimationPerformance();
        this.setupErrorTracking();
    }
    
    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Report to analytics if needed
            if (loadTime > 3000) {
                console.warn('Page load time exceeded 3 seconds');
            }
        });
    }
    
    monitorAnimationPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = (frameCount * 1000) / (currentTime - lastTime);
                console.log(`FPS: ${fps.toFixed(1)}`);
                
                if (fps < 30) {
                    console.warn('Low FPS detected, consider reducing animations');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            // Could send to error tracking service
        });
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loading');
    
    // Initialize main components
    const website = new ZKx401Website();
    const codeEnhancer = new CodeBlockEnhancer();
    const performanceMonitor = new PerformanceMonitor();
    
    // Remove loading class when everything is ready
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    });
});

// Add CSS for animations and effects
const additionalStyles = `
<style>
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.skip-to-content:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
}

.loading .hero-content {
    opacity: 0;
    transform: translateY(20px);
}

.loaded .hero-content {
    animation: fade-in-up 0.8s ease-out forwards;
}

.feature-card:focus,
.use-case-item:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
}

.expand-btn:hover {
    background: var(--bg-elevated) !important;
    color: var(--text-primary) !important;
}

.code-block code {
    transition: max-height 0.3s ease-out;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Export for global access
window.ZKx401Website = ZKx401Website;