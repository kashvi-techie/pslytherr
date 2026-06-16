/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        blush: {
          50: '#fef9fb',
          100: '#fdeef3',
          200: '#f7cfd8',
          300: '#f4aec0',
          400: '#ee87a3',
          500: '#e45f84',
          600: '#c73d64',
          700: '#9e2d4d',
        },
        sage: {
          50: '#fafcf0',
          100: '#f4f8d3',
          200: '#e8f0a8',
          300: '#d5e470',
          400: '#c0d440',
          500: '#9cb828',
          600: '#7a921e',
          700: '#5c6e17',
        },
        teal: {
          50: '#f0f9f9',
          100: '#d8f0f0',
          200: '#a6d6d6',
          300: '#74bcbc',
          400: '#4da3a3',
          500: '#348888',
          600: '#276868',
          700: '#1d4e4e',
        },
        violet: {
          50: '#f5f3fb',
          100: '#e8e3f4',
          200: '#cdc2e9',
          300: '#b09fd9',
          400: '#9e8dce',
          500: '#8e7dbe',
          600: '#7260a8',
          700: '#564887',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        typing: 'typing 0.3s ease-in-out',
        slideUp: 'slideUp 0.4s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.97)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        typing: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(142, 125, 190, 0.12)',
        'glass-lg': '0 16px 48px rgba(142, 125, 190, 0.18)',
        card: '0 4px 24px rgba(247, 207, 216, 0.4)',
        'card-hover': '0 8px 32px rgba(247, 207, 216, 0.6)',
        glow: '0 0 20px rgba(142, 125, 190, 0.3)',
      },
    },
  },
  plugins: [],
};
