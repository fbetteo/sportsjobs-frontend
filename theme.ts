// theme.ts
import { extendTheme } from '@chakra-ui/react';
import {
  BRAND_BACKGROUND,
  BRAND_FOREGROUND,
  BRAND_PRIMARY,
  BRAND_SECONDARY,
} from './lib/uiTokens';

function hexToRgb(hex: string) {
  const normalizedHex = hex.replace('#', '');
  const value = parseInt(normalizedHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`;
}

function mixHex(from: string, to: string, amount: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);

  return rgbToHex({
    r: start.r + (end.r - start.r) * amount,
    g: start.g + (end.g - start.g) * amount,
    b: start.b + (end.b - start.b) * amount,
  });
}

function createBrandScale(base: string) {
  return {
    50: mixHex(base, BRAND_FOREGROUND, 0.88),
    100: mixHex(base, BRAND_FOREGROUND, 0.72),
    200: mixHex(base, BRAND_FOREGROUND, 0.56),
    300: mixHex(base, BRAND_FOREGROUND, 0.36),
    400: mixHex(base, BRAND_FOREGROUND, 0.18),
    500: base,
    600: mixHex(base, BRAND_BACKGROUND, 0.15),
    700: mixHex(base, BRAND_BACKGROUND, 0.3),
    800: mixHex(base, BRAND_BACKGROUND, 0.48),
    900: mixHex(base, BRAND_BACKGROUND, 0.66),
  };
}

const theme = extendTheme({
  colors: {
    brandBg: createBrandScale(BRAND_BACKGROUND),
    brandFg: createBrandScale(BRAND_FOREGROUND),
    brandPrimary: createBrandScale(BRAND_PRIMARY),
    brandSecondary: createBrandScale(BRAND_SECONDARY),
  },
  fonts: {
    heading: 'var(--font-heading), sans-serif',
    body: 'var(--font-body), sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'brandBg.500',
        color: 'brandFg.500',
        fontFamily: 'var(--font-body), sans-serif',
      },
      'h1, h2, h3, h4, h5, h6, .chakra-heading': {
        fontFamily: 'var(--font-heading), sans-serif',
        letterSpacing: '0',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        letterSpacing: '0',
      },
    },
  },
});

export default theme;
