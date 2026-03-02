/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "var(--radius-lg)",
        "2xl": "var(--radius-xl)",
      },
      boxShadow: {
        panel: "var(--glow-soft)",
        hero: "var(--glow-hero)",
      },
      fontFamily: {
        display: ["var(--font-heading)", "Suez One", "Frank Ruhl Libre", "serif"],
        sans: ["var(--font-ui)", "Rubik", "Noto Sans Hebrew", "sans-serif"],
      },
      letterSpacing: {
        executive: "0.22em",
      },
    },
  },
};

export default config;
