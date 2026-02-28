/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.1rem",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
      },
      fontFamily: {
        display: [
          "Suez One",
          "Frank Ruhl Libre",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "Assistant",
          "Rubik",
          "Noto Sans Hebrew",
          "Segoe UI",
          "Tahoma",
          "sans-serif",
        ],
      },
      letterSpacing: {
        executive: "0.22em",
      },
    },
  },
};

export default config;
