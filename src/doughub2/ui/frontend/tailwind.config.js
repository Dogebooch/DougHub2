/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary backgrounds
                'bg-base': '#2C3134',
                'bg-card': '#2F3A48',
                'bg-elevated': '#254341',
                'bg-input': '#09232A',
                // Interactive states
                'bg-hover': '#315C62',
                'bg-selected': '#254341',
                // Borders
                'border-default': '#506256',
                // Text colors
                'text-primary': '#F0DED3',
                'text-secondary': '#A79385',
                'text-tertiary': '#858A7E',
                'text-accent': '#DEC28C',
                'text-warning': '#CEA48C',
                // Accent colors
                'accent-gold': '#C8A92A',
                'accent-orange': '#AB613C',
                'accent-orange-hover': '#C76439',
                'accent-rust': '#9C593A',
                // Status colors
                'status-error': '#DE634D',
                'status-warning': '#E1A102',
                'status-success': '#BCBA90',
            },
            backgroundImage: {
                // Floating Action Button gradients (from legacy userscript)
                'button-idle': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'button-hover': 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                'button-success': 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
                'button-error': 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                'button-processing': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            },
            boxShadow: {
                'fab': '0 4px 12px rgba(0, 0, 0, 0.3)',
                'fab-hover': '0 6px 16px rgba(0, 0, 0, 0.4)',
                'fab-active': '0 2px 8px rgba(0, 0, 0, 0.3)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
