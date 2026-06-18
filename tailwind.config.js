/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 對應 Flutter AppColors
      colors: {
        primary: {
          DEFAULT: '#F6C350',
          200: '#F3B03D',
          300: '#DEA137',
        },
        secondary: '#202020',
        accent: '#F7F7F7',
        surface: '#FAFBFB',
        ink: {
          DEFAULT: '#000000',
          100: '#313131',
          200: '#2D2D2D',
          400: '#212121',
        },
        text1: '#959595',
        text2: '#717171',
        yellow450: '#F4B03E',
        brandgrey: {
          100: '#E7E7E7',
          250: '#BBBBBB',
          350: '#ADADAD',
        },
        brandred: '#F1291A',
      },
      fontFamily: {
        // headlineMedium / titleMedium / logo -> IBM Plex Mono
        mono: ['"IBM Plex Mono"', 'monospace'],
        // bodyMedium / bodySmall -> Lato
        sans: ['Lato', 'system-ui', 'sans-serif'],
        // displayLarge -> Gloria Hallelujah
        hand: ['"Gloria Hallelujah"', 'cursive'],
      },
      boxShadow: {
        // Shadows.elevationShadow
        nav: '0 1px 1px 0 rgba(158,158,158,0.6)',
      },
    },
  },
  plugins: [],
};
