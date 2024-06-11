/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        bgMain: "rgba(var(--bgMain))",
        bgSurrounding: "rgba(var(--bgSurrounding))",
        primary: "rgba(var(--primary))",
        textPrimary: "rgba(var(--textPrimary))",
        linkPrimary: "rgba(var(--linkPrimary))",
        linkHover: "rgba(var(--linkHover))",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss", require("@tailwindcss/typography")],
};
