/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#321911',
        'primary-container': '#4a2e25',
        'on-primary': '#ffffff',
        'on-primary-container': '#bd9588',
        'primary-fixed': '#ffdbd0',
        'primary-fixed-dim': '#e8bdb0',
        'on-primary-fixed': '#2d150d',
        'on-primary-fixed-variant': '#5e3f36',

        'surface': '#fff8f4',
        'surface-dim': '#e3d8ce',
        'surface-bright': '#fff8f4',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fdf2e7',
        'surface-container': '#f7ece2',
        'surface-container-high': '#f2e6dc',
        'surface-container-highest': '#ece1d7',
        'surface-variant': '#ece1d7',

        'on-surface': '#201b15',
        'on-surface-variant': '#504441',
        'inverse-surface': '#352f29',
        'inverse-on-surface': '#faefe5',

        'outline': '#827470',
        'outline-variant': '#d4c3be',
        'surface-tint': '#78574c',

        'secondary': '#625e57',
        'secondary-container': '#e8e2d9',
        'on-secondary-container': '#68645d',
        'secondary-fixed': '#e8e2d9',
        'secondary-fixed-dim': '#ccc6bd',
        'on-secondary-fixed': '#1e1b16',
        'on-secondary-fixed-variant': '#4a4640',

        'tertiary': '#321a00',
        'tertiary-container': '#502c00',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#d98c35',
        'tertiary-fixed': '#ffdcbd',
        'tertiary-fixed-dim': '#ffb86f',
        'on-tertiary-fixed': '#2c1600',
        'on-tertiary-fixed-variant': '#693c00',

        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'on-error': '#ffffff',

        'background': '#fff8f4',
        'on-background': '#201b15',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

