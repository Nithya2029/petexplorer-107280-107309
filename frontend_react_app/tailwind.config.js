module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00BFAE",
        secondary: "#1A202C",
        accent: "#FFC107"
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      },
      boxShadow: {
        md: "0 2px 8px rgba(16,32,53,0.07)",
        lg: "0 6px 32px rgba(35,41,64,0.12)"
      }
    },
  },
  plugins: [],
};
