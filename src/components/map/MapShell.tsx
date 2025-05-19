// src/components/map/MapShell.tsx
'use client'

import { Box } from '@chakra-ui/react'
import Map, { ViewStateChangeEvent, ViewState } from 'react-map-gl/mapbox'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MarkerPin } from './MarkerPin'
import { ListingPopup } from './ListingPopup'
import { useDebouncedBBox } from '@/hooks/useDebouncedBBox'
import type { ListingDTO } from '@/types/listing'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
const PHOENIX: ViewState = { longitude: -112.074, latitude: 33.448, zoom: 10, bearing: 0, pitch: 0, padding: { top: 0, bottom: 0, left: 0, right: 0 } }

export default function MapShell() {
  /** ------------------------------------------------------------------ */
  /* camera state – restore last view if we have it                      */
  /** ------------------------------------------------------------------ */
  const [view, setView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roots-map-view')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          longitude: parsed.longitude,
          latitude: parsed.latitude,
          zoom: parsed.zoom,
          bearing: 0,
          pitch: 0,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      }
    }
    return PHOENIX
  })

  useEffect(() => {
    localStorage.setItem('roots-map-view', JSON.stringify(view))
  }, [view])

  /** ------------------------------------------------------------------ */
  /* debounced BBOX -> limit network traffic                             */
  /** ------------------------------------------------------------------ */
  const bbox = useDebouncedBBox(view, 400)

  const { data: listings = [] } = useQuery({
    enabled: !!bbox,
    queryKey: ['bbox', bbox],
    queryFn: async () => {
      const { sw, ne } = bbox!
      const res = await fetch(`/api/listings/bbox?sw=${sw}&ne=${ne}`)
      if (!res.ok) throw new Error('bbox fetch failed')
      return (await res.json()) as ListingDTO[]
    },
    /** 30 s cache & never refetch on tab-focus */
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  /** ------------------------------------------------------------------ */
  /* event handlers                                                      */
  /** ------------------------------------------------------------------ */
  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => setView(evt.viewState),
    [],
  )

  /** ------------------------------------------------------------------ */
  /* memoised markers – avoids rerendering on every drag                 */
  /** ------------------------------------------------------------------ */
  const markers = useMemo(
    () =>
      listings.map((l) => (
        <MarkerPin key={l.id} listing={l} onClick={() => setActive(l)} />
      )),
    [listings],
  )

  const [active, setActive] = useState<ListingDTO | null>(null)

  return (
    <Box w="100%" h="100%">
      <Map
        {...view}
        onMove={onMove}
        reuseMaps
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={TOKEN}
      >
        {markers}
        {active && (
          <ListingPopup listing={active} onClose={() => setActive(null)} />
        )}
      </Map>
    </Box>
  )
}
