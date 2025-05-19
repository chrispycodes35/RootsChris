// src/components/map/MapShell.tsx
'use client'
import { Box } from '@chakra-ui/react'
import Map, { ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MarkerPin } from './MarkerPin'
import { ListingPopup } from './ListingPopup'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { ListingDTO } from '@/types/listing'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
const initial = { longitude: -122.4, latitude: 37.8, zoom: 11 }

export default function MapShell() {
  const [view, setView] = useState(initial)
  const [active, setActive] = useState<ListingDTO | null>(null)

  const { data: listings = [] } = useQuery({
    queryKey: ['bbox', view.longitude, view.latitude, view.zoom],
    queryFn: async () => {
      const px = 360 / (512 * 2 ** view.zoom)
      const w = window.innerWidth * px, h = window.innerHeight * px
      const sw = [view.longitude - w / 2, view.latitude - h / 2]
      const ne = [view.longitude + w / 2, view.latitude + h / 2]
      const res = await fetch(`/api/listings/bbox?sw=${sw}&ne=${ne}`)
      return res.json() as Promise<ListingDTO[]>
    }
  })

  const onMove = useCallback((e: ViewStateChangeEvent) => setView(e.viewState), [])

  return (
    <Box w="100%" h="100%">
      <Map {...view} onMove={onMove} mapStyle="mapbox://styles/mapbox/light-v11" mapboxAccessToken={TOKEN} reuseMaps>
        {listings.map(l => <MarkerPin key={l.id} listing={l} onClick={() => setActive(l)} />)}
        {active && <ListingPopup listing={active} onClose={() => setActive(null)} />}
      </Map>
    </Box>
  )
}
