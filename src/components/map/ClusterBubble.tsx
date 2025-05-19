// src/components/map/ClusterBubble.tsx
/*
This component is used to display a cluster of listings on the map.
It uses the motion library to animate the cluster when it is hovered over.
*/
'use client';

import { Marker } from 'react-map-gl/mapbox';
import { motion } from 'framer-motion';

export function ClusterBubble({
  count,
  longitude,
  latitude,
  onClick,
}: {
  count: number;
  longitude: number;
  latitude: number;
  onClick: () => void;
}) {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor="center">
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#14e956',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
          }}
        >
          {count}
        </motion.div>
      </div>
    </Marker>
  );
}

