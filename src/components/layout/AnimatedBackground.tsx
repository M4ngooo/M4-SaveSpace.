import { motion } from 'framer-motion'

const orbs = [
  { size: 420, x: '8%', y: '12%', delay: 0, duration: 22 },
  { size: 320, x: '72%', y: '18%', delay: 2, duration: 26 },
  { size: 280, x: '55%', y: '62%', delay: 1, duration: 20 },
  { size: 200, x: '15%', y: '70%', delay: 3, duration: 24 },
  { size: 160, x: '85%', y: '78%', delay: 1.5, duration: 18 },
]

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden>
      <div className="absolute inset-0 bg-bg transition-colors duration-500" />

      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-[0.28]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at 30% 30%, var(--color-accent), transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg/80" />
    </div>
  )
}
