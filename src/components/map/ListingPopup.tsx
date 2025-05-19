// src/components/map/ListingPopup.tsx
'use client'
import { Popup } from 'react-map-gl/mapbox'
import { Box, Text, VStack, HStack, IconButton } from '@chakra-ui/react'
import { LuHeart, LuX } from 'react-icons/lu'
import type { ListingDTO } from '@/types/listing'

export const ListingPopup = ({ listing, onClose }: { listing: ListingDTO; onClose: () => void }) => (
  <Popup longitude={listing.lng} latitude={listing.lat} anchor="bottom" onClose={onClose} closeButton={false}>
    <Box p={4} bg="white" borderRadius="md" boxShadow="lg" minW="220px">
      <VStack align="stretch" gap={3}>           {/* gap prop per v3 :contentReference[oaicite:4]{index=4} */}
        <HStack justify="space-between">
          <Text fontWeight="bold">${listing.price.toLocaleString()}</Text>
          <IconButton aria-label="close" size="sm" variant="ghost" onClick={onClose}>
            <LuX />
          </IconButton>
        </HStack>
        <Text>{listing.address}</Text>
        <HStack gap={4}>
          <Text>{listing.beds} bd</Text>
          <Text>{listing.baths} ba</Text>
          <Text>{listing.sqft.toLocaleString()} sqft</Text>
        </HStack>
        <IconButton aria-label="fav" size="sm" variant="ghost" colorScheme="red">
          <LuHeart />
        </IconButton>
      </VStack>
    </Box>
  </Popup>
)
