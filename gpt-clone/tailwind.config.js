/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      background: "#F8F8FA",
      gray: "#EDF2F7",
      light_gray: "#fafafa",
      black: "#000000",
      blue: "#001789",
      error: " #cc0000",
      solid_gray: "#808080",
      red: "#FF0000",
      defaultTextColor: "#d9d9e3",
    },
    extend: {
      boxShadow: {
        custom: "0px 0px 10px 0px rgba(0, 23, 137, 0.5)",
        light: "0px 0px 10px 0px rgba(0, 23, 137, 0.15)",
      },
    },
    container: {
      padding: {
        DEFAULT: "26px",
        sm: "2rem",
        lg: "42px",
        xl: "42px",
        "2xl": "42px",
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true })],
};
