/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#1E3A5F',
          light: '#2A4F7F',
          dark: '#152C49',
        },
        surface: {
          DEFAULT: '#FAFAFA',
          dark: '#0F172A',
        },
        text: {
          DEFAULT: '#1A1A1A',
          muted: '#6B7280',
          dark: '#E2E8F0',
          'dark-muted': '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
