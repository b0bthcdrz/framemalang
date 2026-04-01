import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e8ecff',
          500: '#4f46e5',
          700: '#3730a3',
          900: '#1f1b5b'
        }
      }
    }
  },
  plugins: []
};

export default config;
