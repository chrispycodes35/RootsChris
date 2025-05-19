// src/components/ui/provider.tsx
'use client';
import { ReactNode, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorModeProvider } from './color-mode';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
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
