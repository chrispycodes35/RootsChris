'use client';

import { Marker } from 'react-map-gl';
import { Box, Image } from '@chakra-ui/react';
import type { ListingDTO } from '@/types/listing';

type Props = {
  listing: ListingDTO;
  onClick: () => void;
  style?: React.CSSProperties;
};

export function MarkerPin({ listing, onClick, style }: Props) {
  const { lat, lng, isFavorite } = listing;
  
  // Debug logs
  console.log('Rendering marker:', { lat, lng, isFavorite });
  
  return (
    <Marker
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      onClick={onClick}
      style={style}
    >
      <Box
        position="relative"
        width="32px"
        height="32px"
        cursor="pointer"
        transform="translate(-50%, -50%)"
        transition="transform 0.2s"
        _hover={{ transform: 'translate(-50%, -50%) scale(1.1)' }}
      >
        <Image
          src={isFavorite ? '/pin-fav.svg' : '/pin.svg'}
          alt="Location marker"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Box>
    </Marker>
  );
}