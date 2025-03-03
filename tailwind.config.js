 /** @type {import('tailwindcss').Config} */
 export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 50s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(80%)" },
          to: { transform: "translateX(-80%)" },
        },
      },
    },
  },
  plugins: [],
};