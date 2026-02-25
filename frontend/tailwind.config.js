/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: '#E53935',
        neon: '#00BFFF',
        urban: '#B0B0B0',
        midnight: '#000000',
        'crimson-dark': '#B71C1C',
        'neon-dark': '#0099CC',
        'surface': '#0A0A0A',
        'surface-2': '#111111',
        'surface-3': '#1A1A1A',
      },
      fontFamily: {
        marker: ['"Permanent Marker"', 'cursive'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'cursive'],
        oswald: ['"Oswald"', 'sans-serif'],
      },
      animation: {
        'spray-in': 'sprayIn 0.8s ease-out forwards',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'splatter': 'splatter 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'paint-drip': 'paintDrip 1s ease-in forwards',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        sprayIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-2deg)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)', filter: 'blur(0px)' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #00BFFF, 0 0 10px #00BFFF, 0 0 20px #00BFFF' },
          '50%': { boxShadow: '0 0 10px #00BFFF, 0 0 30px #00BFFF, 0 0 60px #00BFFF' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        splatter: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '60%': { transform: 'scale(1.3)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0.6' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 4px #E53935, 0 0 11px #E53935, 0 0 19px #E53935' },
          '50%': { textShadow: '0 0 4px #E53935, 0 0 11px #E53935, 0 0 19px #E53935, 0 0 40px #E53935, 0 0 80px #E53935' },
        },
        paintDrip: {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
        'graffiti-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A0A0A 50%, #0A0A1A 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #E53935, #B71C1C)',
        'neon-gradient': 'linear-gradient(135deg, #00BFFF, #0099CC)',
      },
      boxShadow: {
        'neon': '0 0 5px #00BFFF, 0 0 10px #00BFFF, 0 0 20px #00BFFF',
        'crimson': '0 0 5px #E53935, 0 0 10px #E53935, 0 0 20px #E53935',
        'neon-lg': '0 0 10px #00BFFF, 0 0 30px #00BFFF, 0 0 60px #00BFFF',
        'crimson-lg': '0 0 10px #E53935, 0 0 30px #E53935, 0 0 60px #E53935',
      },
      dropShadow: {
        'neon': ['0 0 8px #00BFFF', '0 0 20px #00BFFF'],
        'crimson': ['0 0 8px #E53935', '0 0 20px #E53935'],
      },
    },
  },
  plugins: [],
};
