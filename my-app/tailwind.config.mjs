/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#143888",
        border: "#E3E8EF",
        warning: "#F6C420",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "digital-numbers": ["Digital", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

// export default config;
