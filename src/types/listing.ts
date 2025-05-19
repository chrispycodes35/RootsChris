// src/types/listing.ts
export interface ListingDTO {
  id: string
  price: number
  lat: number
  lng: number           // ← used by Marker & Popup
  beds: number
  baths: number
  sqft: number
  address: string
  isAssumable: boolean
  createdAt: string
  isFavorite?: boolean
  imageUrl?: string
}
