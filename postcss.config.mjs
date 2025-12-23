const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Safelist responsive text-align classes for TipTap editor
      safelist: [
        // Base text-align classes
        "text-left",
        "text-center",
        "text-right",
        "text-justify",
        // Responsive variants for mobile (md: breakpoint)
        "md:text-left",
        "md:text-center",
        "md:text-right",
        "md:text-justify",
        // Responsive variants for desktop (lg: breakpoint)
        "lg:text-left",
        "lg:text-center",
        "lg:text-right",
        "lg:text-justify",
      ],
    },
  },
};

export default config;
