import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extends: {
      colors: {
        gray: {
          953: "#f4eee5",
          952: "#222",
          951: "#E9E4DB",
        },
        green: {
          951: "#9CAE96",
        },
      },
    },
  },
  plugins: [],
};
export default config;
