// src/store/useFavorites.ts
import { create } from 'zustand'

interface FavoritesState {
  favorites: Set<string>
  onlyFavs: boolean
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  setOnlyFavs: (value: boolean) => void
}

export const useFavorites = create<FavoritesState>((set: any, get: any) => ({
  favorites: new Set(),
  onlyFavs: false,

  toggleFavorite: (id: string) => {
    // copy the existing Set
    const favs = new Set(get().favorites)
    if (favs.has(id)) favs.delete(id)
    else favs.add(id)
    set({ favorites: favs })
  },

  isFavorite: (id: string) => {
    return get().favorites.has(id)
  },

  setOnlyFavs: (value: boolean) => set({ onlyFavs: value }),
}))
