/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: '#007bff',
                    200: '#0056b3',
                    300: '#003d80',
                    500: '#007bff',
                    600: '#0056b3',
                    700: '#003d80',
                    800: '#00264d',
                    900: '#001329',
                },
            },
            boxShadow: {
                roomItem: '0 1px 5px #00000012',
            },
        },
        fontFamily: {
            sans: ['Helvetica', 'Arial', 'sans-serif'],
        },
    },
    plugins: [],
};
