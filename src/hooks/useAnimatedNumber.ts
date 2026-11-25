import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(value: number, duration = 800) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    const start = prevRef.current
    const end = value
    if (start === end) return

    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(animate)
      else prevRef.current = end
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return display
}
