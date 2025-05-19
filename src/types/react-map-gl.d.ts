// src/types/react-map-gl.d.ts
import 'react-map-gl';
import type mapboxgl from 'mapbox-gl';

declare module 'react-map-gl' {
  interface InteractiveMapProps {
    /**
     * The “uncontrolled” initial view state.
     */
    initialViewState?: import('react-map-gl').ViewState;
    /**
     * Mapbox access token (v8).
     */
    mapboxAccessToken?: string;
  }
}
