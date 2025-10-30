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
				// Custom ZKx401 Colors
				'bg': {
					'pure-black': '#000000',
					'near-black': '#0a0a0a',
					'elevated': '#141414',
					'hover': '#1e1e1e',
					'modal': '#1a1a1a',
				},
				'text': {
					'primary': '#e4e4e7',
					'secondary': '#a1a1aa',
					'tertiary': '#71717a',
					'muted': '#52525b',
				},
				'accent': {
					'cyan': '#00d4ff',
					'cyan-glow': 'rgba(0, 212, 255, 0.4)',
					'green': '#00ff88',
					'green-glow': 'rgba(0, 255, 136, 0.3)',
					'purple': '#8b5cf6',
					'purple-glow': 'rgba(139, 92, 246, 0.3)',
					'orange': '#ff8800',
					'red': '#ff4444',
				},
				'status': {
					'success': '#00ff88',
					'warning': '#ff8800',
					'error': '#ff4444',
					'info': '#00d4ff',
					'live': '#00ff88',
				},
				'chart': {
					'primary': '#00d4ff',
					'secondary': '#8b5cf6',
					'tertiary': '#00ff88',
					'gradient-start': '#00d4ff',
					'gradient-end': 'rgba(0, 212, 255, 0.1)',
				},
				// Existing shadcn colors
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
				lg: '16px',
				md: '12px',
				sm: '8px',
				'full': '9999px',
			},
			boxShadow: {
				'sm': '0 0 0 1px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.8)',
				'card': '0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.6)',
				'card-hover': '0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)',
				'modal': '0 0 0 1px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.9)',
				'glow-cyan': '0 0 12px rgba(0,212,255,0.4), 0 0 24px rgba(0,212,255,0.2)',
				'glow-green': '0 0 12px rgba(0,255,136,0.4), 0 0 24px rgba(0,255,136,0.2)',
				'glow-purple': '0 0 12px rgba(139,92,246,0.3), 0 0 24px rgba(139,92,246,0.15)',
				'glow-pulse': '0 0 8px rgba(0,255,136,0.6)',
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
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-green': 'pulse-green 2s infinite',
			},
			fontFamily: {
				'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'display': ['Inter', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
			},
			fontSize: {
				'hero': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				'h2': ['24px', { lineHeight: '1.3' }],
				'h3': ['20px', { lineHeight: '1.3' }],
				'body-lg': ['18px', { lineHeight: '1.6' }],
				'body': ['16px', { lineHeight: '1.5' }],
				'small': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
				'xs': ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
				'stat-lg': ['32px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
				'stat': ['24px', { lineHeight: '1.2' }],
				'mono': ['14px', { lineHeight: '1.4' }],
			},
			spacing: {
				'1': '4px',
				'2': '8px',
				'3': '12px',
				'4': '16px',
				'5': '20px',
				'6': '24px',
				'8': '32px',
				'10': '40px',
				'12': '48px',
				'16': '64px',
				'20': '80px',
				'24': '96px',
				'32': '128px',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}