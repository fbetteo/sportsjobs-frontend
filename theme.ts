// theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'black',        // Background color
        color: 'white',     // Font color
        fontFamily: 'Arial, sans-serif', // Default font
      },
    },
  },
});

export default theme;