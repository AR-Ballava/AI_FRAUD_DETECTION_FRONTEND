/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   "#080C14",
          secondary: "#0D1421",
          card:      "#111827",
          border:    "#1E2D45",
        },
        accent: {
          cyan:   "#00D4FF",
          red:    "#FF3B3B",
          amber:  "#FFB800",
          green:  "#00FF88",
        },
        text: {
          primary:   "#E8EDF5",
          secondary: "#7A8BA8",
          muted:     "#3D5068",
        }
      },
      fontFamily: {
        display: ["'Share Tech Mono'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan":       "scan 2s linear infinite",
        "glow":       "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glow: {
          "0%":   { boxShadow: "0 0 5px #00D4FF33" },
          "100%": { boxShadow: "0 0 20px #00D4FF66, 0 0 40px #00D4FF22" },
        }
      }
    },
  },
  plugins: [],
}