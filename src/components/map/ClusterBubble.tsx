// src/components/map/ClusterBubble.tsx
/*
This component is used to display a cluster of listings on the map.
It uses the motion library to animate the cluster when it is hovered over.
*/
'use client';

import { Marker } from 'react-map-gl';
import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

interface ClusterBubbleProps {
  count: number;
  longitude: number;
  latitude: number;
  onClick: () => void;
  style?: CSSProperties;
}

export const ClusterBubble = ({
  count,
  longitude,
  latitude,
  onClick,
  style,
}: ClusterBubbleProps) => (
  <Marker 
    longitude={longitude} 
    latitude={latitude}
    anchor="center"
    offset={[0, 0]}
    clickTolerance={3}
    draggable={false}
    pitchAlignment="map"
    rotationAlignment="map"
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      onTap={onClick}
      style={{
        cursor: 'pointer',
        background: '#14e956',
        color: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: 'translate(-50%, -50%)',
        ...style,
      }}
    >
      {count}
    </motion.div>
  </Marker>
);

