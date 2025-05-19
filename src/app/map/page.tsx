// src/app/map-with-filters/page.tsx
'use client'
import dynamic from "next/dynamic";
import FilterBar from "@/components/map/FilterBar";
const MapShell = dynamic(() => import("@/components/map/MapShell"), { ssr: false });

export default function MapFilters() {
  return (
    <div className="flex flex-col h-screen">
      <FilterBar />
      <div className="flex-1">
        <MapShell />
      </div>
    </div>
  );
}
