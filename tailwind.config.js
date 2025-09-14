/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F5A623',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled']
    }
  }
};