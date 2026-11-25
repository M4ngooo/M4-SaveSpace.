import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-3xl glow-accent"
          animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          💰
        </motion.div>
        <motion.div
          className="absolute -inset-4 rounded-3xl border border-accent/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <motion.p
        className="mt-8 text-text-secondary text-sm font-medium"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Ładowanie Oszczędności…
      </motion.p>
      <div className="mt-4 w-48 h-1 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
