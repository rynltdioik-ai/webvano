/* @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0f",
        panel: "#12121a",
        edge: "#1e1e2e",
        accent: "#6d5efc",
        accent2: "#9b6dfc",
      },
    },
  },
  plugins: [],
};
