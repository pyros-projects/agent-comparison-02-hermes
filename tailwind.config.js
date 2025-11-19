/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Work Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#0f172a',
        mist: '#0b1220',
        glow: '#7cf2d4',
        ember: '#f6ad55',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 10% 20%, rgba(124, 242, 212, 0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(246, 173, 85, 0.1), transparent 35%), radial-gradient(circle at 50% 80%, rgba(94, 234, 212, 0.08), transparent 30%)',
      },
    },
  },
  plugins: [],
}
