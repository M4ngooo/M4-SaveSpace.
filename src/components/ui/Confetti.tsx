import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) return
    const colors = ['#22C55E', '#16A34A', '#4ADE80', '#86EFAC', '#F0F4F2']
    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4,
      rotation: Math.random() * 360,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [active, onComplete])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ y: '-10vh', rotate: p.rotation, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{ duration: 2.5 + Math.random(), ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
