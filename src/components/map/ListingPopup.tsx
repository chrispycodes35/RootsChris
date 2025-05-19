// src/components/map/ListingPopup.tsx
'use client'
import { Popup } from 'react-map-gl'
import { Box, Text, VStack, HStack, IconButton, Button, Image } from '@chakra-ui/react'
import { LuHeart, LuX } from 'react-icons/lu'
import type { ListingDTO } from '@/types/listing'
import { useFavorites } from '@/store/useFavorites'

interface ListingPopupProps {
  listing: ListingDTO;
  onClose: () => void;
}

export const ListingPopup = ({ listing, onClose }: ListingPopupProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <Popup
      longitude={listing.lng}
      latitude={listing.lat}
      anchor="bottom"
      onClose={onClose}
      closeButton={false}
      closeOnClick={false}
    >
      <Box 
        p={1.5} 
        minW="200px" 
        borderRadius="md" 
        boxShadow="md"
        bg="white"
        position="relative"
      >
        <IconButton
          aria-label="Close popup"
          icon={<LuX />}
          size="xs"
          position="absolute"
          top={2}
          right={2}
          variant="ghost"
          onClick={onClose}
        />
        
        <VStack align="start" spacing={3}>
          <Box w="100%" h="160px" borderRadius="md" overflow="hidden">
            <Image
              src={listing.imageUrl || '/placeholder-house.jpg'}
              alt={listing.address}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>

          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" fontSize="xl">${listing.price.toLocaleString()}</Text>
            <IconButton
              aria-label={isFavorite(listing.id) ? 'Remove from favorites' : 'Add to favorites'}
              icon={<LuHeart />}
              size="xs"
              variant="ghost"
              colorScheme={isFavorite(listing.id) ? 'pink' : 'gray'}
              onClick={() => toggleFavorite(listing.id)}
            />
          </HStack>

          <Text fontWeight="medium" fontSize="sm">{listing.address}</Text>
          
          <HStack spacing={2} color="gray.600" fontSize="xs">
            <Text>{listing.beds} beds</Text>
            <Text>{listing.baths} baths</Text>
            {listing.sqft > 0 && <Text>{listing.sqft} sqft</Text>}
          </HStack>

          {listing.isAssumable && (
            <Text color="green.500" fontSize="xs" fontWeight="medium">
              Assumable Loan Available
            </Text>
          )}

          <Button
            w="100%"
            colorScheme="green"
            size="xs"
            onClick={() => {
              // TODO: Implement navigation to listing detail page
              console.log('View listing:', listing.id)
            }}
          >
            Learn More
          </Button>
        </VStack>
      </Box>
    </Popup>
  )
}
