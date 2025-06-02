/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          50: "hsl(var(--success-50))",
          100: "hsl(var(--success-100))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          50: "hsl(var(--warning-50))",
          100: "hsl(var(--warning-100))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
          50: "hsl(var(--error-50))",
          100: "hsl(var(--error-100))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          50: "hsl(var(--info-50))",
          100: "hsl(var(--info-100))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.025em' }],
        'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600', letterSpacing: '-0.025em' }],
        'h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }],
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'car-card': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'button': '0 4px 12px rgba(59, 130, 246, 0.3)',
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-in-out-custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-custom': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backdropBlur: {
        'header': '8px',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
    function({ addUtilities, addComponents }) {
      // Custom button components
      addComponents({
        '.btn': {
          '@apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-primary': {
          '@apply btn bg-primary text-primary-foreground hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0': {},
          'padding': '12px 24px',
        },
        '.btn-secondary': {
          '@apply btn border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground': {},
          'padding': '10px 22px',
        },
        '.btn-outline': {
          '@apply btn border-2 border-neutral-300 text-neutral-700 bg-transparent hover:bg-neutral-50 hover:border-neutral-400': {},
          'padding': '10px 22px',
        },
        '.btn-ghost': {
          '@apply btn text-neutral-700 bg-transparent hover:bg-neutral-100': {},
          'padding': '12px 24px',
        },
        '.btn-sm': {
          'padding': '8px 16px',
          'font-size': '0.875rem',
        },
        '.btn-lg': {
          'padding': '16px 32px',
          'font-size': '1.125rem',
        },
      });

      // Card components
      addComponents({
        '.card': {
          '@apply bg-card border border-border rounded-xl p-6 transition-all duration-200 ease-out hover:-translate-y-0.5': {},
          'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        '.card:hover': {
          'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        '.car-card': {
          '@apply bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1': {},
          'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
        '.car-card-image': {
          '@apply w-full h-48 object-cover': {},
        },
        '.car-card-content': {
          '@apply p-6': {},
        },
        '.car-card-title': {
          '@apply text-lg font-semibold mb-2': {},
        },
        '.car-card-specs': {
          '@apply flex flex-wrap gap-2 mb-4': {},
        },
        '.car-card-spec': {
          '@apply bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm': {},
        },
      });

      // Form components
      addComponents({
        '.input': {
          '@apply w-full px-4 py-3 border-2 border-border rounded-lg text-base bg-background text-foreground transition-all duration-200 ease-out focus:outline-none focus:border-primary': {},
        },
        '.input:focus': {
          'box-shadow': '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
        '.input-label': {
          '@apply block font-medium mb-2 text-foreground': {},
        },
        '.select': {
          '@apply input cursor-pointer': {},
        },
      });

      // Badge components
      addComponents({
        '.badge': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-wide': {},
        },
        '.badge-success': {
          '@apply badge bg-success-50 text-success': {},
        },
        '.badge-warning': {
          '@apply badge bg-warning-50 text-warning': {},
        },
        '.badge-error': {
          '@apply badge bg-error-50 text-error': {},
        },
        '.badge-info': {
          '@apply badge bg-info-50 text-info': {},
        },
      });

      // Navigation components
      addComponents({
        '.nav-link': {
          '@apply text-foreground no-underline px-4 py-2 rounded-md font-medium transition-all duration-200 ease-out hover:bg-muted hover:text-primary': {},
        },
        '.nav-link-active': {
          '@apply nav-link bg-primary text-primary-foreground hover:bg-primary-700': {},
        },
      });

      // Layout utilities
      addUtilities({
        '.container-custom': {
          'width': '100%',
          'max-width': '1280px',
          'margin': '0 auto',
          'padding': '0 1rem',
          '@screen sm': {
            'padding': '0 1.5rem',
          },
          '@screen lg': {
            'padding': '0 2rem',
          },
        },
        '.section-spacing': {
          'padding-top': '3rem',
          'padding-bottom': '3rem',
          '@screen md': {
            'padding-top': '4rem',
            'padding-bottom': '4rem',
          },
        },
      });
    },
  ],
}