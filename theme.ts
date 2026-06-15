// theme.ts
import { extendTheme } from '@chakra-ui/react';
import {
  BRAND_BACKGROUND,
  BRAND_FOREGROUND,
  BRAND_PRIMARY_ACCENT,
  BRAND_SECONDARY_ACCENT,
} from './lib/uiTokens';

const theme = extendTheme({
  colors: {
    black: BRAND_BACKGROUND,
    white: BRAND_FOREGROUND,
    purple: {
      50: '#fff1ee',
      100: '#ffd9d1',
      200: '#ffb6a7',
      300: '#ff8a73',
      400: '#ef6349',
      500: BRAND_PRIMARY_ACCENT,
      600: '#bd3420',
      700: '#932817',
      800: '#671f16',
      900: '#431a15',
    },
    teal: {
      50: '#e8f4f4',
      100: '#c9e1e2',
      200: '#9fc8ca',
      300: '#75adb0',
      400: '#4f8a8e',
      500: BRAND_SECONDARY_ACCENT,
      600: '#2a5357',
      700: '#224246',
      800: '#1b3336',
      900: '#142528',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      },
    },
  },
});

export default theme;
