import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui"],
      },
      letterSpacing: {
        display: "-0.02em",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        brand: {
          navy: "hsl(var(--brand-navy))",
          "navy-deep": "hsl(var(--brand-navy-deep))",
          royal: "hsl(var(--brand-royal))",
          gold: "hsl(var(--brand-gold))",
          "gold-soft": "hsl(var(--brand-gold-soft))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 10px)",
      },
      boxShadow: {
        glass: "0 8px 32px -8px rgba(15, 23, 42, 0.06)",
        "glass-lg": "0 24px 64px -28px rgba(15, 23, 42, 0.1)",
        lift: "0 20px 50px -24px rgba(14, 116, 144, 0.18)",
        "card-hge":
          "0 12px 40px -16px rgba(15, 23, 42, 0.08), 0 4px 16px -8px rgba(56, 189, 248, 0.06)",
        premium:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 24px 48px -28px rgba(15, 23, 42, 0.08), 0 8px 24px -12px rgba(56, 189, 248, 0.06)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, hsl(var(--border) / 0.45) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.45) 1px, transparent 1px)",
        "hero-vignette":
          "radial-gradient(ellipse 85% 65% at 50% 0%, hsl(var(--primary) / 0.12), transparent 58%)",
        "navy-hero":
          "linear-gradient(160deg, rgba(0,0,0,0.5) 0%, rgba(15,23,42,0.38) 45%, rgba(56,189,248,0.14) 100%)",
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "hero-fog": {
          "0%, 100%": { opacity: "0.55", transform: "translate3d(0,0,0) scale(1)" },
          "50%": { opacity: "0.85", transform: "translate3d(-1.5%, 1%, 0) scale(1.03)" },
        },
        "airflow-drift": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(2%)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
        "hero-fog": "hero-fog 14s ease-in-out infinite",
        "airflow-drift": "airflow-drift 22s ease-in-out infinite",
        "glow-pulse": "glow-pulse 8s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
