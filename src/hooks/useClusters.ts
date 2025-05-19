// src/hooks/useClusters.ts
/*
This hook is used to cluster the listings on the map.
It uses the supercluster library to cluster the listings to help speed up the rendering of the map.
The clustering behavior can be customized through the options parameter:
- radius: Controls how close points need to be to form a cluster (in pixels)
- maxZoom: The maximum zoom level at which clustering occurs
- minPoints: The minimum number of points required to form a cluster
*/
import Supercluster from 'supercluster'
import { useMemo } from 'react'
import type { ListingDTO } from '@/types/listing'

interface ClusterOptions {
  radius?: number    // Distance in pixels within which points will be clustered
  maxZoom?: number   // Maximum zoom level at which clustering occurs
  minPoints?: number // Minimum number of points required to form a cluster
}

export function useClusters(points: ListingDTO[], zoom: number, options: ClusterOptions = {}) {
  return useMemo(() => {
    // Convert listings to GeoJSON features for clustering
    const features = points.map((l) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] },
      properties: l,
    }))

    // Initialize the clustering engine with custom options
    const engine = new Supercluster({
      radius: options.radius ?? 160,    // Default radius increased for larger clusters
      maxZoom: options.maxZoom ?? 5,   // Default max zoom increased to show more clusters
      minPoints: options.minPoints ?? 2, // Default minimum points to form a cluster
      // Add these options to improve clustering accuracy
      nodeSize: 64,                      // Number of points in each node of the tree
      extent: 1000,                       // Tile extent (higher values = more accurate but slower)
      reduce: (acc, props) => {          // Custom reducer to ensure accurate point counts
        if (!acc.point_count) acc.point_count = 0
        acc.point_count += 1
      }
    }).load(features)
    
    // Get clusters for the entire world bounds to ensure accurate counts
    // This ensures we get all clusters regardless of viewport
    const clusters = engine.getClusters([-180, -85, 180, 85], Math.round(zoom))

    return { clusters, engine }
  }, [points, zoom, options.radius, options.maxZoom, options.minPoints])
}
