// src/store/useListings.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ListingDTO } from '@/types/listing'

export interface Filters {
  price: [number, number]
  assumableOnly: boolean
  maxAgeDays: number | null
  status: string[]
  favoritesOnly: boolean
}

interface State {
    favs: Record<string, true>
    filters: Filters
    toggleFav(id: string): void
    setFilters(p: Partial<Filters>): void
  }
  
  export const useListings = create<State>()(persist(
    (set, get) => ({
      favs: {},
      filters: { price: [0, 2_000_000], assumableOnly: false,
                 maxAgeDays: null, status: [], favoritesOnly: false },
      toggleFav: (id) => set(s => {
        const favs = { ...s.favs }
        if (s.favs[id]) {
          delete favs[id]
        } else {
          favs[id] = true
        }
        return { favs }
      }),
      setFilters: (p) => set(s => ({ filters: { ...s.filters, ...p } })),
    }),
    { name: 'roots-listings-store' }
  ))