import { useMemo } from 'react'
import { motion } from 'framer-motion'

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${pseudoRandom(i + 1) * 100}%`,
        size: 2 + pseudoRandom(i + 2) * 4,
        duration: 12 + pseudoRandom(i + 3) * 16,
        delay: pseudoRandom(i + 4) * 8,
        opacity: 0.15 + pseudoRandom(i + 5) * 0.35,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-[9]" aria-hidden>
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: p.left,
            bottom: '-5%',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{ y: ['0vh', '-115vh'], x: [0, pseudoRandom(p.id + 6) * 80 - 40] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
