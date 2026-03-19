/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "border-l-red-500", "border-l-yellow-400", "border-l-sky-400",
    "bg-red-500/10", "bg-yellow-400/10", "bg-sky-400/10",
    "text-red-400", "text-yellow-400", "text-sky-400",
    "border-red-500/30", "border-yellow-400/30", "border-sky-400/30",
    "animate-delay-100","animate-delay-200","animate-delay-300",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      keyframes: {
        fadeUp:     { from:{opacity:"0",transform:"translateY(20px)"}, to:{opacity:"1",transform:"translateY(0)"} },
        fadeLeft:   { from:{opacity:"0",transform:"translateX(-16px)"}, to:{opacity:"1",transform:"translateX(0)"} },
        fadeRight:  { from:{opacity:"0",transform:"translateX(16px)"}, to:{opacity:"1",transform:"translateX(0)"} },
        fadeIn:     { from:{opacity:"0"}, to:{opacity:"1"} },
        scaleIn:    { from:{opacity:"0",transform:"scale(0.93)"}, to:{opacity:"1",transform:"scale(1)"} },
        blink:      { "0%,100%":{opacity:"1"}, "50%":{opacity:"0"} },
        shimmer:    { "0%":{backgroundPosition:"-400px 0"}, "100%":{backgroundPosition:"400px 0"} },
        gridScroll: { "0%":{backgroundPosition:"0 0"}, "100%":{backgroundPosition:"48px 48px"} },
        orbPulse:   { "0%,100%":{transform:"scale(1) translate(0,0)"}, "50%":{transform:"scale(1.15) translate(20px,-20px)"} },
        orbPulse2:  { "0%,100%":{transform:"scale(1) translate(0,0)"}, "50%":{transform:"scale(1.1) translate(-15px,15px)"} },
        pulse2:     { "0%,100%":{opacity:"1"}, "50%":{opacity:"0.4"} },
        progressW:  { from:{width:"0%"}, to:{width:"100%"} },
      },
      animation: {
        "fade-up":    "fadeUp    0.5s cubic-bezier(.22,.68,0,1.2) both",
        "fade-left":  "fadeLeft  0.45s cubic-bezier(.22,.68,0,1.2) both",
        "fade-right": "fadeRight 0.45s cubic-bezier(.22,.68,0,1.2) both",
        "fade-in":    "fadeIn    0.4s ease both",
        "scale-in":   "scaleIn   0.4s cubic-bezier(.22,.68,0,1.2) both",
        "blink":      "blink 1s step-end infinite",
        "shimmer":    "shimmer 1.6s infinite linear",
        "grid-scroll":"gridScroll 12s linear infinite",
        "orb-pulse":  "orbPulse  8s ease-in-out infinite",
        "orb-pulse2": "orbPulse2 10s ease-in-out infinite",
        "pulse2":     "pulse2 1.5s ease-in-out infinite",
        "progress-w": "progressW 1.5s ease-out both",
      },
    },
  },
  plugins: [],
};