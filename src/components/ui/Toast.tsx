import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'

export function ToastContainer() {
  const { toasts, removeToast } = useApp()

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() => removeToast(toast.id)}
            className={`
              pointer-events-auto px-5 py-3 rounded-xl text-sm font-medium shadow-2xl cursor-pointer
              ${toast.type === 'success' ? 'bg-accent text-bg glow-accent' : ''}
              ${toast.type === 'error' ? 'bg-danger/90 text-white' : ''}
              ${toast.type === 'info' ? 'bg-card border border-border text-text' : ''}
            `}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
