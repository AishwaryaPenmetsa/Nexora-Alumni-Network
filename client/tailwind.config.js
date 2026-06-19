/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#050816",
        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#06B6D4",
        success: "#10B981",
        danger: "#EF4444",
        cardBg: "rgba(10, 16, 37, 0.45)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        space: ["'Space Grotesk'", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.7))' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glass-glow': '0 8px 32px 0 rgba(99, 102, 241, 0.2)',
        'accent-glow': '0 8px 32px 0 rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [],
}
