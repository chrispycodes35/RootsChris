// src/app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import FilterBar from '@/components/map/FilterBar';
const DynamicMap = dynamic(() => import('@/components/map/MapShell'), { ssr: false });

import {
  Heading,
  Text,
  Box,
  Image,
  VStack,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';

interface Listing {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  photoUrls: string[];
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecentListings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/listings/recent');
      if (!res.ok) throw new Error('Fetch failed');
      setListings(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box maxW="1280px" mx="auto" px={6} py={8}>
      <Heading mb={4}>Recent Listings</Heading>

      <Button
        mb={6}
        colorScheme="blue"
        onClick={fetchRecentListings}
        isLoading={loading}
      >
        Fetch Recent Listings
      </Button>

      {error && <Text color="red.500" mb={4}>{error}</Text>}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={10}>
        {listings.map(l => (
          <Box key={l.id} borderWidth="1px" borderRadius="md" overflow="hidden">
            {l.photoUrls[0] && (
              <Image
                src={l.photoUrls[0]}
                alt={l.address}
                h="200px" w="100%"
                objectFit="cover"
              />
            )}
            <VStack align="start" p={4} gap={2}>
              <Text fontWeight="bold">${l.price.toLocaleString()}</Text>
              <Text>{l.address}</Text>
              {l.city && l.state && (
                <Text>{`${l.city}, ${l.state}`}</Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Box h="1px" bg="gray.200" my={10} />

      <Text fontSize="lg" mb={4}>
        Map Component Below!
      </Text>
      <div > 
        <FilterBar />

        <Box w="100%" h="600px" borderRadius="md" overflow="hidden">
          <DynamicMap />
        </Box>
      </div>
    </Box>
  );
}
