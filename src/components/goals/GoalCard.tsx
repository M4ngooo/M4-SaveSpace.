import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Goal } from '../../types'
import { formatCurrency, formatDaysRemaining } from '../../utils/format'
import { getProgress, getRemaining, isGoalCompleted } from '../../utils/calculations'
import { getMotivationMessage } from '../../utils/motivation'
import { ProgressBar } from '../ui/ProgressBar'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { Button } from '../ui/Button'

interface GoalCardProps {
  goal: Goal
  onAddMoney: (goal: Goal) => void
  compact?: boolean
}

export function GoalCard({ goal, onAddMoney, compact = false }: GoalCardProps) {
  const progress = getProgress(goal.currentAmount, goal.targetAmount)
  const remaining = getRemaining(goal.currentAmount, goal.targetAmount)
  const completed = isGoalCompleted(goal)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-card border rounded-2xl p-5 transition-all duration-200
        ${completed ? 'border-accent/40 glow-accent' : 'border-border hover:border-border-light hover:bg-card-hover'}
      `}
    >
      <Link to={`/cele/${goal.id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{goal.icon}</span>
            <div>
              <h3 className="font-semibold text-text leading-tight">{goal.name}</h3>
              {completed && (
                <span className="text-xs text-accent font-medium">Ukończony ✓</span>
              )}
            </div>
          </div>
          <span className="text-sm font-bold text-accent">{Math.round(progress)}%</span>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-1.5 mb-1">
            <AnimatedCounter value={goal.currentAmount} className="text-lg font-bold text-text" />
            <span className="text-text-muted text-sm">/ {formatCurrency(goal.targetAmount)}</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {!compact && (
          <>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-text-secondary">
                {completed ? 'Cel osiągnięty!' : `Pozostało: ${formatCurrency(remaining)}`}
              </span>
              {goal.deadline && !completed && (
                <span className="text-text-muted text-xs">{formatDaysRemaining(goal.deadline)}</span>
              )}
            </div>
            <p className="text-xs text-text-muted italic">{getMotivationMessage(progress)}</p>
          </>
        )}
      </Link>

      {!completed && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={(e: React.MouseEvent) => { e.preventDefault(); onAddMoney(goal) }}
          >
            + Dodaj pieniądze
          </Button>
        </div>
      )}
    </motion.div>
  )
}
