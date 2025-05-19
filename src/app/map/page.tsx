// src/app/map/page.tsx
'use client'

import { Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

// Dynamically import MapShell to avoid SSR issues with mapbox
const MapShell = dynamic(() => import('@/components/map/MapShell'), {
  ssr: false,
  loading: () => (
    <Box
      w="100vw"
      h="100vh"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      Loading map...
    </Box>
  ),
})

export default function MapPage() {
  return (
    <Box w="100vw" h="100vh" position="relative">
      <MapShell />
    </Box>
  )
} 