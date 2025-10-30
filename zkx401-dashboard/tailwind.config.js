/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Enhanced Custom ZKx401 Colors
				'bg': {
					'pure-black': '#000000',
					'near-black': '#0a0a0a',
					'elevated': '#141414',
					'hover': '#1e1e1e',
					'modal': '#1a1a1a',
					'glass': 'rgba(255, 255, 255, 0.05)',
					'glass-strong': 'rgba(255, 255, 255, 0.1)',
				},
				'text': {
					'primary': '#e4e4e7',
					'secondary': '#a1a1aa',
					'tertiary': '#71717a',
					'muted': '#52525b',
					'inverse': '#000000',
				},
				'accent': {
					'cyan': '#00d4ff',
					'cyan-light': '#33ddff',
					'cyan-dark': '#00b8e6',
					'cyan-glow': 'rgba(0, 212, 255, 0.4)',
					'cyan-glow-strong': 'rgba(0, 212, 255, 0.6)',
					'green': '#00ff88',
					'green-light': '#33ffaa',
					'green-dark': '#00e676',
					'green-glow': 'rgba(0, 255, 136, 0.3)',
					'green-glow-strong': 'rgba(0, 255, 136, 0.5)',
					'purple': '#8b5cf6',
					'purple-light': '#a78bfa',
					'purple-dark': '#7c3aed',
					'purple-glow': 'rgba(139, 92, 246, 0.3)',
					'purple-glow-strong': 'rgba(139, 92, 246, 0.5)',
					'orange': '#ff8800',
					'orange-light': '#ffaa33',
					'orange-dark': '#cc6600',
					'red': '#ff4444',
					'red-light': '#ff6666',
					'red-dark': '#cc0000',
				},
				'status': {
					'success': '#00ff88',
					'warning': '#ff8800',
					'error': '#ff4444',
					'info': '#00d4ff',
					'live': '#00ff88',
					'pending': '#ffaa33',
				},
				'chart': {
					'primary': '#00d4ff',
					'secondary': '#8b5cf6',
					'tertiary': '#00ff88',
					'quaternary': '#ff8800',
					'gradient-start': '#00d4ff',
					'gradient-end': 'rgba(0, 212, 255, 0.1)',
					'grid': 'rgba(255, 255, 255, 0.1)',
					'axis': 'rgba(255, 255, 255, 0.3)',
				},
				// Enhanced shadcn colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#00d4ff',
					foreground: '#000000',
				},
				secondary: {
					DEFAULT: '#8b5cf6',
					foreground: '#e4e4e7',
				},
				accent: {
					DEFAULT: '#00ff88',
					foreground: '#000000',
				},
				destructive: {
					DEFAULT: '#ff4444',
					foreground: '#e4e4e7',
				},
				muted: {
					DEFAULT: '#141414',
					foreground: '#a1a1aa',
				},
				popover: {
					DEFAULT: '#1a1a1a',
					foreground: '#e4e4e7',
				},
				card: {
					DEFAULT: '#141414',
					foreground: '#e4e4e7',
				},
			},
			borderRadius: {
				'2xs': '4px',
				'xs': '6px',
				'sm': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '20px',
				'2xl': '24px',
				'3xl': '32px',
				'full': '9999px',
			},
			boxShadow: {
				'xs': '0 0 0 1px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.8)',
				'sm': '0 0 0 1px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.8)',
				'md': '0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.6)',
				'lg': '0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)',
				'xl': '0 0 0 1px rgba(255,255,255,0.15), 0 12px 32px rgba(0,0,0,0.8)',
				'2xl': '0 0 0 1px rgba(255,255,255,0.2), 0 16px 48px rgba(0,0,0,0.9)',
				'card': '0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.6)',
				'card-hover': '0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)',
				'modal': '0 0 0 1px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.9)',
				'inner': 'inset 0 2px 4px rgba(0,0,0,0.6)',
				
				// Enhanced Glow Effects
				'glow-cyan': '0 0 12px rgba(0,212,255,0.4), 0 0 24px rgba(0,212,255,0.2), 0 0 48px rgba(0,212,255,0.1)',
				'glow-cyan-strong': '0 0 16px rgba(0,212,255,0.6), 0 0 32px rgba(0,212,255,0.4), 0 0 64px rgba(0,212,255,0.2)',
				'glow-green': '0 0 12px rgba(0,255,136,0.4), 0 0 24px rgba(0,255,136,0.2), 0 0 48px rgba(0,255,136,0.1)',
				'glow-green-strong': '0 0 16px rgba(0,255,136,0.6), 0 0 32px rgba(0,255,136,0.4), 0 0 64px rgba(0,255,136,0.2)',
				'glow-purple': '0 0 12px rgba(139,92,246,0.3), 0 0 24px rgba(139,92,246,0.15), 0 0 48px rgba(139,92,246,0.1)',
				'glow-purple-strong': '0 0 16px rgba(139,92,246,0.5), 0 0 32px rgba(139,92,246,0.3), 0 0 64px rgba(139,92,246,0.15)',
				'glow-pulse': '0 0 8px rgba(0,255,136,0.6), 0 0 16px rgba(0,255,136,0.4)',
				'glow-pulse-strong': '0 0 12px rgba(0,255,136,0.8), 0 0 24px rgba(0,255,136,0.6), 0 0 36px rgba(0,255,136,0.4)',
				
				// Multi-layer shadows
				'layer-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
				'layer-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
				'layer-3': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
				'layer-4': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
				'layer-5': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'pulse-green': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.3)', opacity: '0.6' },
				},
				'pulse-green-enhanced': {
					'0%, 100%': { 
						transform: 'scale(1)', 
						opacity: '1',
						boxShadow: '0 0 8px rgba(0, 255, 136, 0.6), 0 0 16px rgba(0, 255, 136, 0.4)'
					},
					'50%': { 
						transform: 'scale(1.4)', 
						opacity: '0.5',
						boxShadow: '0 0 12px rgba(0, 255, 136, 0.8), 0 0 24px rgba(0, 255, 136, 0.6)'
					},
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-scale': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200px 0'
					},
					'100%': {
						backgroundPosition: 'calc(200px + 100%) 0'
					}
				},
				'shimmer-enhanced': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 12px rgba(0, 212, 255, 0.4)'
					},
					'50%': { 
						boxShadow: '0 0 24px rgba(0, 212, 255, 0.8)'
					}
				},
				'hover-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-6px)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-green': 'pulse-green 2s infinite',
				'pulse-green-enhanced': 'pulse-green-enhanced 2s infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in-scale': 'fade-in-scale 0.4s ease-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out',
				'shimmer': 'shimmer 1.5s infinite',
				'shimmer-enhanced': 'shimmer-enhanced 2s infinite',
				'glow-pulse': 'glow-pulse 2s infinite',
				'hover-bounce': 'hover-bounce 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'spin-slow': 'spin-slow 3s linear infinite',
			},
			fontFamily: {
				'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
				'display': ['Inter', 'system-ui', 'sans-serif'],
				'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'monospace'],
				'heading': ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'hero': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'hero-sm': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				'h1-sm': ['28px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				'h2': ['24px', { lineHeight: '1.3' }],
				'h2-sm': ['20px', { lineHeight: '1.3' }],
				'h3': ['20px', { lineHeight: '1.3' }],
				'h3-sm': ['18px', { lineHeight: '1.3' }],
				'body-lg': ['18px', { lineHeight: '1.6' }],
				'body': ['16px', { lineHeight: '1.5' }],
				'body-sm': ['14px', { lineHeight: '1.5' }],
				'small': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
				'sm': ['12px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
				'xs': ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
				'stat-lg': ['32px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
				'stat': ['24px', { lineHeight: '1.2' }],
				'stat-sm': ['20px', { lineHeight: '1.2' }],
				'mono': ['14px', { lineHeight: '1.4' }],
				'caption': ['11px', { lineHeight: '1.3', letterSpacing: '0.02em' }],
			},
			spacing: {
				'0.5': '2px',
				'1': '4px',
				'1.5': '6px',
				'2': '8px',
				'2.5': '10px',
				'3': '12px',
				'3.5': '14px',
				'4': '16px',
				'5': '20px',
				'6': '24px',
				'7': '28px',
				'8': '32px',
				'9': '36px',
				'10': '40px',
				'11': '44px',
				'12': '48px',
				'14': '56px',
				'16': '64px',
				'18': '72px',
				'20': '80px',
				'24': '96px',
				'28': '112px',
				'32': '128px',
				'36': '144px',
				'40': '160px',
				'44': '176px',
				'48': '192px',
				'52': '208px',
				'56': '224px',
				'60': '240px',
				'64': '256px',
				'72': '288px',
				'80': '320px',
				'96': '384px',
			},
			// Enhanced backdrop blur utilities
			backdropBlur: {
				'xs': '2px',
				'sm': '4px',
				'md': '8px',
				'lg': '16px',
				'xl': '24px',
				'2xl': '40px',
				'3xl': '64px',
			},
			// Enhanced transition timing
			transitionDuration: {
				'0': '0ms',
				'75': '75ms',
				'100': '100ms',
				'150': '150ms',
				'200': '200ms',
				'300': '300ms',
				'500': '500ms',
				'700': '700ms',
				'1000': '1000ms',
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'smooth': 'cubic-bezier(0.4, 0.0, 0.6, 1)',
				'sharp': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
				'gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			},
			// Enhanced z-index scale
			zIndex: {
				'1': '1',
				'10': '10',
				'20': '20',
				'30': '30',
				'40': '40',
				'50': '50',
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100',
			},
			// Custom aspect ratios
			aspectRatio: {
				'4/3': '4 / 3',
				'3/2': '3 / 2',
				'2/3': '2 / 3',
				'9/16': '9 / 16',
				'golden': '1.618 / 1',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		// Add custom plugin for additional utilities
		function({ addUtilities, theme }) {
			const newUtilities = {
				'.text-shadow-sm': {
					textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
				},
				'.text-shadow': {
					textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
				},
				'.text-shadow-lg': {
					textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
				},
				'.text-shadow-glow': {
					textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
				},
				'.bg-mesh': {
					backgroundImage: `
						radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)
					`,
				},
				'.bg-grid': {
					backgroundImage: `
						linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
						linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
					`,
					backgroundSize: '20px 20px',
				},
				'.mask-gradient-to-b': {
					maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
				},
				'.mask-gradient-to-t': {
					maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
				},
				'.mask-gradient-to-r': {
					maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
				},
				'.mask-gradient-to-l': {
					maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
				},
			};
			addUtilities(newUtilities);
		},
	],
}