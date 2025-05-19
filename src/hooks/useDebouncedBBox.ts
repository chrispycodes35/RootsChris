// src/hooks/useDebouncedBBox.ts
import { useEffect, useState } from 'react'
import { ViewState } from 'react-map-gl'

export function useDebouncedBBox(view: ViewState, delay = 400) {
  const [bbox, setBbox] = useState<
    | null
    | {
        sw: [number, number]
        ne: [number, number]
      }
  >(null)

  useEffect(() => {
    const id = window.setTimeout(() => {
      // mercator helpers ----------------------------------------------------
      const worldSize = 512 * 2 ** view.zoom
      const degPerPixel = 360 / worldSize
      const widthDeg = window.innerWidth * degPerPixel
      const heightDeg = window.innerHeight * degPerPixel

      setBbox({
        sw: [view.longitude - widthDeg / 2, view.latitude - heightDeg / 2],
        ne: [view.longitude + widthDeg / 2, view.latitude + heightDeg / 2],
      })
    }, delay)

    return () => clearTimeout(id)
  }, [view, delay])

  return bbox
}
