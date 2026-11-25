import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useAuthOptional } from '../../context/AuthContext'
import { dismissTip, getDismissedTipIds, useSmartTips } from '../../hooks/useSmartTips'

export function SmartTipsWidget() {
  const { goals, transactions } = useApp()
  const auth = useAuthOptional()
  const [dismissed, setDismissed] = useState<string[]>(() => getDismissedTipIds())
  const [collapsed, setCollapsed] = useState(false)

  const tips = useSmartTips({
    goals,
    transactions,
    isLoggedIn: Boolean(auth?.user),
    dismissed,
  })

  if (tips.length === 0) return null

  const handleDismiss = (id: string) => {
    dismissTip(id)
    setDismissed(prev => [...prev, id])
  }

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center gap-2 text-sm font-semibold text-text mb-3 hover:text-accent transition-colors"
      >
        <span className="inline-flex w-8 h-8 rounded-xl bg-accent/15 items-center justify-center text-accent">
          💡
        </span>
        Inteligentne wskazówki
        <span className="text-text-muted font-normal">({tips.length})</span>
        <span className="text-text-muted ml-auto text-xs">{collapsed ? 'Pokaż' : 'Ukryj'}</span>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {tips.map(tip => (
              <motion.article
                key={tip.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="glass-panel rounded-2xl p-4 border border-border/80 relative group"
              >
                <button
                  type="button"
                  aria-label="Ukryj wskazówkę"
                  onClick={() => handleDismiss(tip.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg text-text-muted hover:text-text hover:bg-card-hover transition-colors text-sm"
                >
                  ✕
                </button>
                <h3 className="font-semibold text-text text-sm pr-8">{tip.title}</h3>
                <p className="text-text-secondary text-sm mt-1 leading-relaxed">{tip.body}</p>
                {tip.actionPath && tip.actionLabel && (
                  <Link
                    to={tip.actionPath}
                    className="inline-block mt-3 text-sm font-medium text-accent hover:underline"
                  >
                    {tip.actionLabel} →
                  </Link>
                )}
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
