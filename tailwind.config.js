/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
            },
            fontFamily: {
                sans: ['var(--font-main)', 'sans-serif'],
                serif: ['var(--font-heading)', 'serif'],
            }
        },
    },
    plugins: [],
}
