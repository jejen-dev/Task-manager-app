/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'dark-bg': '#191B1F',
                'dark-card': '#2A2D32',
                'dark-text': '#FEF7EE',
                'dark-secondary': '#7E878D',
                'light-bg': '#FEF7EE',
                'light-card': '#FFFFFF',
                'light-text': '#191B1F',
                'light-secondary': '#7E878D',
                'accent-red': '#752522',
                'accent-red-light': '#F9E3E2',
                'accent-blue': '#253985',
                'accent-blue-light': '#DEE9FC',
                'accent-yellow': '#C18D30',
                'accent-yellow-light': '#FDF9C9',
                'accent-green': '#285231',
                'accent-green-light': '#E2FBE8',
            },
            fontFamily: {
                'sans': ['DM Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}