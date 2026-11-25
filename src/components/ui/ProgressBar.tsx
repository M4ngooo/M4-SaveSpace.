import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  showGlow?: boolean
  className?: string
}

export function ProgressBar({ progress, size = 'md', showGlow = false, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress))
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' }

  return (
    <div className={`w-full bg-bg-secondary rounded-full overflow-hidden ${heights[size]} ${className}`}>
      <motion.div
        className={`h-full rounded-full ${clamped >= 100 ? 'bg-accent glow-accent-strong' : 'bg-accent'} ${showGlow && clamped >= 80 ? 'glow-accent' : ''}`}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
