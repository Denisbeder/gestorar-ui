/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: ({ colors }) => {
                return {
                    primary: 'rgb(var(--color-primary))',
                    danger: 'rgb(var(--color-danger))',
                    neutral: 'rgb(var(--color-neutral))',
                };
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
