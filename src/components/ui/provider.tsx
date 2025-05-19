// src/components/ui/provider.tsx
'use client'

import { ReactNode, useState } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode'

interface AppProviderProps extends ColorModeProviderProps {
  children: ReactNode
}

export function Provider({ children, ...colorModeProps }: AppProviderProps) {
  /* one stable instance ➜ avoids hydration mismatch */
  const [client] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...colorModeProps}>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
