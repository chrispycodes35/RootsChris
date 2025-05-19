// src/app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Heading, Text, Box, Image, VStack, SimpleGrid, Button, Separator } from '@chakra-ui/react'



const MapShell = dynamic(() => import('@/components/map/MapShell'), { ssr: false })

/** one-to-one with the /api/listings/recent SELECT */
interface Listing {
  id: string
  address: string
  city: string | null
  state: string | null
  price: number
  bedrooms: number | null
  bathrooms: number | null
  squareFeet: number | null
  photoUrls: string[]
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ------------ fetch helper ------------ */
  async function fetchRecentListings() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/listings/recent')
      if (!res.ok) throw new Error('Fetch failed')
      setListings(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  /* -------------- render -------------- */
  return (
    <Box maxW="1280px" mx="auto" px={6} py={8}>
      <Heading mb={4}>Recent Listings</Heading>

      {/* Chakra v3 ➜ prop is `loading`, not `isLoading` :contentReference[oaicite:1]{index=1} */}
      <Button mb={6} colorScheme="blue" onClick={fetchRecentListings} loading={loading}>
        Fetch Recent Listings
      </Button>

      {error && <Text color="red.500" mb={4}>{error}</Text>}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {listings.map(l => (
          <Box key={l.id} borderWidth="1px" borderRadius="md" overflow="hidden">
            {l.photoUrls[0] && (
              <Image src={l.photoUrls[0]} alt={l.address} h="200px" w="100%" objectFit="cover" />
            )}
            <VStack align="start" p={4} gap={2}>
              <Text fontWeight="bold">${l.price.toLocaleString()}</Text>
              <Text>{l.address}</Text>
              {l.city && l.state && <Text>{`${l.city}, ${l.state}`}</Text>}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Separator my={10} />
      <Text fontSize="lg" mb={4}>Explore the same listings on the map below 👇</Text>

      <Box w="100%" h="600px" borderRadius="md" overflow="hidden">
        <MapShell />
      </Box>
    </Box>
  )
}
