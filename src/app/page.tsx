// src/app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import FilterBar from '@/components/map/FilterBar';
import { useColorMode } from '@chakra-ui/react';
import { LuSun, LuMoon } from 'react-icons/lu';
const DynamicMap = dynamic(() => import('@/components/map/MapShell'), { ssr: false });

import {
  Heading,
  Text,
  Box,
  Image,
  VStack,
  SimpleGrid,
  Button,
  Container,
  IconButton,
  useColorModeValue,
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
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('brand.white', 'brand.black');
  const cardBg = useColorModeValue('brand.white', 'brand.gray.800');
  const borderColor = useColorModeValue('brand.gray.200', 'brand.gray.700');
  const textColor = useColorModeValue('brand.black', 'brand.white');
  const secondaryTextColor = useColorModeValue('brand.gray.600', 'brand.gray.400');

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
    <Container maxW="1280px" mx="auto" px={6} py={12} bg={bgColor}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="xl" color={textColor}>Recent Listings</Heading>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <LuMoon /> : <LuSun />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="brand.green"
          />
        </Box>

        <Button
          colorScheme="green"
          onClick={fetchRecentListings}
          isLoading={loading}
          size="lg"
          bg="brand.green"
          _hover={{ bg: 'brand.darkGreen' }}
        >
          Fetch Recent Listings
        </Button>

        {error && (
          <Text color="red.500" fontSize="lg" fontWeight="medium">
            {error}
          </Text>
        )}

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={8}
          mb={12}
        >
          {listings.map(l => (
            <Box 
              key={l.id} 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              bg={cardBg}
              borderColor={borderColor}
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
            >
              {l.photoUrls[0] && (
                <Image
                  src={l.photoUrls[0]}
                  alt={l.address}
                  h="240px"
                  w="100%"
                  objectFit="cover"
                />
              )}
              <VStack align="start" p={6} spacing={3}>
                <Text fontSize="xl" fontWeight="bold" color="brand.green">
                  ${l.price.toLocaleString()}
                </Text>
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  {l.address}
                </Text>
                {l.city && l.state && (
                  <Text fontSize="sm" color={secondaryTextColor}>
                    {`${l.city}, ${l.state}`}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Box 
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"
          shadow="lg"
          bg={cardBg}
          borderColor={borderColor}
        >
          <Heading 
            size="lg" 
            p={6} 
            borderBottomWidth="1px"
            borderColor={borderColor}
            color={textColor}
          >
            Map Component
          </Heading>
          
          <Box id="map-container">
            <FilterBar />
            <Box w="100%" h="600px" borderRadius="md" overflow="hidden">
              <DynamicMap />
            </Box>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
