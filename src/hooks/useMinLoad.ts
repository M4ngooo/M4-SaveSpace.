import { useEffect, useState } from 'react'

/** Krótkie opóźnienie, aby pokazać skeleton przy „ładowaniu” widoków. */
export function useMinLoad(ms = 350) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), ms)
    return () => window.clearTimeout(t)
  }, [ms])
  return ready
}
