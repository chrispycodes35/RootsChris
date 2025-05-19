'use client'
/*
This component is the main component for the map.
It is responsible for rendering the map and the listings on the map.
*/
import Map, { ViewState, ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { Box } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedBBox } from '@/hooks/useDebouncedBBox'
import { useClusters } from '@/hooks/useClusters'
import { MarkerPin } from './MarkerPin'
import { ListingPopup } from './ListingPopup'
import { ClusterBubble } from './ClusterBubble'
import type { ListingDTO } from '@/types/listing'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
const PHOENIX: ViewState = {
  longitude: -112.074, latitude: 33.448, zoom: 10, bearing: 0, pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 }
}

// Clustering configuration
const CLUSTER_RADIUS = 120 // Increased radius to show more points per cluster (default was 50)
const MAX_ZOOM = 17 // Increased zoom level at which clustering stops (default was 15)
const MIN_POINTS = 2 // Minimum points required to form a cluster

export default function MapShell() {
  /* ------------ camera ------------- */
  const [view, setView] = useState<ViewState>(() => {
    try { return JSON.parse(localStorage.getItem('roots-map-view')!) ?? PHOENIX }
    catch { return PHOENIX }
  })
  useEffect(() => localStorage.setItem('roots-map-view', JSON.stringify(view)), [view])

  /* ------------ data --------------- */
  const bbox = useDebouncedBBox(view, 400)
  const { data: listings = [] } = useQuery({
    enabled: !!bbox,
    queryKey: ['bbox', bbox],
    queryFn: async () => {
      const { sw, ne } = bbox!
      const res = await fetch(`/api/listings/bbox?sw=${sw}&ne=${ne}`)
      if (!res.ok) throw new Error('bbox fetch failed')
      return res.json() as Promise<ListingDTO[]>
    },
    staleTime: 30_000, refetchOnWindowFocus: false,
  })
  /* ------------ clustering --------- */
  const { clusters, engine } = useClusters(listings, view.zoom)

  /* ------------ handlers ----------- */
  const onMove = useCallback((e: ViewStateChangeEvent) => setView(e.viewState), [])
  const [active, setActive] = useState<ListingDTO | null>(null)

  /* ------------ render ------------- */
  const pins = useMemo(() => clusters.map(c =>
    !c.properties?.cluster ? (
      <MarkerPin key={c.properties.id}
                 listing={c.properties as ListingDTO}
                 onClick={() => setActive(c.properties as ListingDTO)} />
    ) : (
      <ClusterBubble key={`c-${c.id}`}
                     count={c.properties.point_count}
                     longitude={c.geometry.coordinates[0]}
                     latitude={c.geometry.coordinates[1]}
                     onClick={() => {
                       const zoom = Math.min(
                         engine.getClusterExpansionZoom(c.id as number),
                         MAX_ZOOM
                       )
                       setView(v => ({ ...v,
                         longitude: c.geometry.coordinates[0],
                         latitude: c.geometry.coordinates[1],
                         zoom: zoom + 0.5 }))
                     }}/>
    )
  ), [clusters, engine])

  return (
    <Box w="100%" h="100%">
      <Map {...view} onMove={onMove}
           mapStyle="mapbox://styles/mapbox/light-v11"
           reuseMaps mapboxAccessToken={TOKEN}>
        {pins}
        {active && <ListingPopup listing={active} onClose={() => setActive(null)} />}
      </Map>
    </Box>
  )
}
