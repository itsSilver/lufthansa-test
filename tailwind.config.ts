import type { Config } from 'tailwindcss';

import { colorTokens } from './src/theme/colors';

const themeColors = Object.fromEntries(
  colorTokens.map((token) => [token, `rgb(var(--color-${token}) / <alpha-value>)`]),
);

export default {
  content: ['./index.ts', './src/**/*.{ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
} satisfies Config;
