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
        textThemeEnphasize: "rgba(var(--textThemeEnphasize))",
        textTheme: "rgba(var(--textTheme))",
        textThemeDim: "rgba(var(--textThemeDim))",
        textEnphasize: "rgba(var(--textEnphasize))",
        textPrimary: "rgba(var(--textPrimary))",
        textDim: "rgba(var(--textDim))",
        linkPrimary: "rgba(var(--linkPrimary))",
        linkHover: "rgba(var(--linkHover))",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss", require("@tailwindcss/typography")],
};
