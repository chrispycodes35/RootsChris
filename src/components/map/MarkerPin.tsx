// src/components/map/MarkerPin.tsx
'use client';

import { Marker } from 'react-map-gl/mapbox';
import { motion } from 'framer-motion';
import { LuHouse } from 'react-icons/lu';
import type { ListingDTO } from '@/types/listing';

const formatPrice = (price: number): string => {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)}m`;
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(0)}k`;
  }
  return price.toString();
};

export const MarkerPin = ({
  listing,
  onClick,
}: {
  listing: ListingDTO;
  onClick: () => void;
}) => (
  <Marker longitude={listing.lng} latitude={listing.lat} anchor="bottom">
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <motion.div whileHover={{ scale: 1.1 }} style={{ position: 'relative' }}>
        <LuHouse size={28} color="#14e956" />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          textShadow: '0 0 2px black',
          whiteSpace: 'nowrap'
        }}>
          ${formatPrice(listing.price)}
        </div>
      </motion.div>
    </div>
  </Marker>
);
