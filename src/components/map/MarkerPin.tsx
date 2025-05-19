// src/components/map/MarkerPin.tsx
'use client'
import { motion } from 'framer-motion'
import { Marker } from 'react-map-gl/mapbox'
import { LuHouse } from 'react-icons/lu'

import type { ListingDTO } from '@/types/listing'

export const MarkerPin = ({ listing, onClick }: { listing: ListingDTO; onClick: () => void }) => (
  <Marker longitude={listing.lng} latitude={listing.lat} anchor="bottom"> {/* props per docs :contentReference[oaicite:3]{index=3} */}
    <motion.div whileHover={{ scale: 1.1 }} onClick={onClick}>
      <LuHouse size={28} color="#14e956" />
    </motion.div>
  </Marker>
)
