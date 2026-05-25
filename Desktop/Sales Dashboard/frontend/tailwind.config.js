/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyberbg: "#0a0a0a",
        cybercard: "#1a1a1a",
        cyberpink: "#ff2d55",
        cybercyan: "#00f0ff",
        cybertext: "#ffffff",
        cybermuted: "#a0a0a0",
        cyberdark: "#050505",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        pinkglow: "0 0 15px rgba(255, 45, 85, 0.3)",
        cyanglow: "0 0 15px rgba(0, 240, 255, 0.3)",
        pinkglowlg: "0 0 30px rgba(255, 45, 85, 0.5)",
        cyanglowlg: "0 0 30px rgba(0, 240, 255, 0.5)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
      }
    },
  },
  plugins: [],
}
