// src/hooks/useDebouncedBBox.ts
import { useEffect, useState } from 'react'

type View = { longitude: number; latitude: number; zoom: number }

export function useDebouncedBBox(view: View, delay = 300) {
  const [bbox, setBbox] = useState<null | { sw: [number, number]; ne: [number, number] }>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      const worldSize = 512 * Math.pow(2, view.zoom) // mapbox mercator basis
      const degreesPerPixel = 360 / worldSize
      const widthDeg = window.innerWidth * degreesPerPixel
      const heightDeg = window.innerHeight * degreesPerPixel

      setBbox({
        sw: [view.longitude - widthDeg / 2, view.latitude - heightDeg / 2],
        ne: [view.longitude + widthDeg / 2, view.latitude + heightDeg / 2]
      })
    }, delay)
    return () => clearTimeout(id)
  }, [view, delay])

  return bbox
}
