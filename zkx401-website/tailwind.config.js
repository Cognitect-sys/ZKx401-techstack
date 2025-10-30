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
				// ZKx401 Design System Colors
				background: {
					'pure-black': '#000000',
					'near-black': '#0a0a0a',
					'elevated': '#141414',
					'hover': '#1e1e1e',
					DEFAULT: 'hsl(var(--background))',
				},
				text: {
					'primary': '#e4e4e7',
					'secondary': '#a1a1aa',
					'tertiary': '#71717a'
				},
				accent: {
					'primary': '#3b82f6',
					'hover': '#60a5fa',
					'glow': 'rgba(59, 130, 246, 0.5)',
					'secondary': '#a855f7',
					DEFAULT: '#3b82f6',
					foreground: 'hsl(var(--accent-foreground))',
				},
				semantic: {
					'success': '#22c55e',
					'warning': '#f59e0b',
					'error': '#ef4444'
				},
				border: {
					'subtle': 'rgba(255, 255, 255, 0.1)',
					'moderate': 'rgba(255, 255, 255, 0.15)',
					DEFAULT: 'hsl(var(--border))',
				},
				overlay: {
					'dark': 'rgba(0, 0, 0, 0.3)'
				},
				primary: {
					DEFAULT: '#3b82f6',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				foreground: 'hsl(var(--foreground))',
			},
			fontFamily: {
				'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				'monospace': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
			},
			fontSize: {
				'hero-title': '56px',
				'headline-1': '36px',
				'headline-2': '24px',
				'body-large': '18px',
				'body': '16px',
				'small': '14px',
				'code': '14px'
			},
			spacing: {
				'xs': '8px',
				'sm': '16px',
				'md': '24px',
				'lg': '32px',
				'xl': '48px',
				'2xl': '64px',
				'3xl': '96px',
				'4xl': '128px'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'sm': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '24px'
			},
			boxShadow: {
				'glow-primary': '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
				'glow-subtle': '0 0 12px rgba(59, 130, 246, 0.4)',
				'card': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.5)'
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
				'glow-pulse': {
					'0%, 100%': { opacity: '0.5' },
					'50%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}