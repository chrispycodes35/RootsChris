'use client';

import Map, { ViewState, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useRef, useEffect, useMemo } from 'react';

import { useDebouncedBBox } from '@/hooks/useDebouncedBBox';
import { useClusters } from '@/hooks/useClusters';
import { MarkerPin } from './MarkerPin';
import { ClusterBubble } from './ClusterBubble';
import { ListingPopup } from './ListingPopup';
import { useFavorites } from '@/store/useFavorites';
import type { ListingDTO } from '@/types/listing';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

const INITIAL_VIEW: ViewState = {
  longitude: -112.074,
  latitude: 33.448,
  zoom: 10,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

export default function MapShell() {
  // 1) camera
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW);
  const viewRef = useRef(viewState);
  viewRef.current = viewState;

  // 2) popup
  const [active, setActive] = useState<ListingDTO | null>(null);

  // 3) favorites
  const { onlyFavs, isFavorite } = useFavorites();

  // 4) bounding box
  const bbox = useDebouncedBBox(viewState, 400);

  // 5) manual fetch
  const [listings, setListings] = useState<ListingDTO[]>([]);
  useEffect(() => {
    if (!bbox) return;
    const { sw, ne } = bbox;
    fetch(`/api/listings/bbox?sw=${sw}&ne=${ne}`)
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json() as Promise<ListingDTO[]>;
      })
      .then(data => {
        // stamp on your favorite flag
        const withFav = data.map(l => ({ ...l, isFavorite: isFavorite(l.id) }));
        console.log('✅ fetched listings:', withFav.length);
        setListings(withFav);
      })
      .catch(console.error);
  }, [bbox, isFavorite]);

  // 6) filter listings
  const filtered = useMemo(() => {
    return listings.filter(listing => {
      // Filter by favorites
      if (onlyFavs && !isFavorite(listing.id)) {
        return false;
      }
      return true;
    });
  }, [listings, onlyFavs, isFavorite]);

  // 7) cluster them
  const { clusters, engine } = useClusters(
    filtered,
    viewRef.current.zoom,
    { radius: 50, maxZoom: 14, minPoints: 2 }
  );

  // 8) render pins & bubbles
  const pins = useMemo(
    () =>
      clusters.map(c => {
        if ('cluster' in c.properties) {
          const [lng, lat] = c.geometry.coordinates;
          return (
            <ClusterBubble
              key={`cluster-${c.id!}`}
              count={c.properties.point_count}
              longitude={lng}
              latitude={lat}
              onClick={() => {
                const exp = engine.getClusterExpansionZoom(+c.id!);
                setViewState(vs => ({
                  ...vs,
                  longitude: lng,
                  latitude: lat,
                  zoom: Math.min(exp, 16) + 0.1,
                }));
              }}
            />
          );
        }
        const listing = c.properties as ListingDTO;
        return (
          <MarkerPin
            key={listing.id}
            listing={listing}
            onClick={() =>
              setActive(a => (a?.id === listing.id ? null : listing))
            }
          />
        );
      }),
    [clusters, engine]
  );

  return (
    <Map
      initialViewState={INITIAL_VIEW}
      mapboxAccessToken={TOKEN}
      mapStyle={MAP_STYLE}
      style={{ width: '100%', height: '100%' }}
      minZoom={5}
      maxZoom={17}
      onMoveEnd={({ viewState: vs }) => {
        setViewState(vs);
        localStorage.setItem('roots-map-view', JSON.stringify(vs));
      }}
    >
      <NavigationControl position="top-left" />
      {pins}
      {active && <ListingPopup listing={active} onClose={() => setActive(null)} />}
    </Map>
  );
}
