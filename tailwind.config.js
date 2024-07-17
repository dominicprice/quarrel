/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["ABeeZee", "sans-serif"],
                serif: ["Merriweather", "serif"],
                block: ["'Archivo Black'", "serif"],
            },
        },
    },
    plugins: [],
};
