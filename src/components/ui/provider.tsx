// src/components/ui/provider.tsx
'use client';
import { ReactNode, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorModeProvider } from './color-mode';

const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      green: '#14e956',
      darkGreen: '#12d34e',
      black: '#000000',
      white: '#ffffff',
      gray: {
        50: '#f7f7f7',
        100: '#e3e3e3',
        200: '#c8c8c8',
        300: '#a4a4a4',
        400: '#818181',
        500: '#666666',
        600: '#515151',
        700: '#3d3d3d',
        800: '#2a2a2a',
        900: '#1a1a1a',
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'brand.black' : 'brand.white',
        color: props.colorMode === 'dark' ? 'brand.white' : 'brand.black',
      },
    }),
  },
});

export function Provider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <ChakraProvider theme={theme}>
        <ColorModeProvider>{children}</ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
