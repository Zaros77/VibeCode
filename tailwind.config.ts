import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#FFFFFF',
        muted: '#F5F5F7',
        ink: '#1D1D1F',
        accent: '#0f2b8c'
      },
      boxShadow: {
        glass: '0 8px 40px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
