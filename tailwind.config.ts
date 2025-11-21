import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SAGE Brand Colors (EXACT HEX)
        primary: {
          teal: '#0F766E',
          DEFAULT: '#0F766E',
        },
        accent: {
          gold: '#F59E0B',
          orange: '#EA580C',
        },
        dark: {
          bg: '#1A1A1A',
          card: '#252525',
          DEFAULT: '#1A1A1A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          DEFAULT: '#FFFFFF',
        },
        locked: '#5A5A5A',
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #252525 50%, #1A1A1A 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(37, 37, 37, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #0F766E, 0 0 10px #0F766E' },
          '100%': { boxShadow: '0 0 10px #0F766E, 0 0 20px #0F766E, 0 0 30px #0F766E' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
