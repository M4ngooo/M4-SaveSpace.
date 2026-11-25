import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { CircularProgress } from '../components/ui/CircularProgress'
import { ProgressBar } from '../components/ui/ProgressBar'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { TransactionItem } from '../components/history/TransactionItem'
import { GoalFormModal } from '../components/goals/GoalFormModal'
import { AddMoneyModal } from '../components/goals/AddMoneyModal'
import { Button } from '../components/ui/Button'
import { Confetti } from '../components/ui/Confetti'
import {
  getProgress,
  getRemaining,
  isGoalCompleted,
  getGoalTransactions,
  getGoalStats,
  getWeeklySavingsNeeded,
  getDaysRemaining,
} from '../utils/calculations'
import { formatCurrency, formatDate, formatDaysRemaining } from '../utils/format'
import { getMotivationMessage } from '../utils/motivation'

export function GoalDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { goals, transactions, updateGoal, deleteGoal, addDeposit } = useApp()
  const [showEdit, setShowEdit] = useState(false)
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const goal = goals.find(g => g.id === id)

  if (!goal) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary mb-4">Nie znaleziono celu</p>
        <Button variant="secondary" onClick={() => navigate('/cele')}>Wróć do celów</Button>
      </div>
    )
  }

  const progress = getProgress(goal.currentAmount, goal.targetAmount)
  const remaining = getRemaining(goal.currentAmount, goal.targetAmount)
  const completed = isGoalCompleted(goal)
  const goalTx = getGoalTransactions(transactions, goal.id)
  const stats = getGoalStats(transactions, goal.id)
  const weeklyNeeded = getWeeklySavingsNeeded(goal)
  const daysLeft = goal.deadline ? getDaysRemaining(goal.deadline) : null

  const handleDelete = () => {
    deleteGoal(goal.id)
    navigate('/cele')
  }

  const handleDeposit = (goalId: string, amount: number) => {
    const wasCompleted = isGoalCompleted(goal)
    const success = addDeposit(goalId, amount)
    if (success && !wasCompleted && goal.currentAmount + amount >= goal.targetAmount) {
      setShowConfetti(true)
    }
    return success
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text text-sm mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Wróć
      </button>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <CircularProgress progress={progress} size={140} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <span className="text-3xl">{goal.icon}</span>
              <h1 className="text-2xl font-bold text-text">{goal.name}</h1>
              {completed && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-semibold rounded-lg">Ukończony</span>
              )}
            </div>
            {goal.description && (
              <p className="text-text-secondary text-sm mb-3">{goal.description}</p>
            )}
            <p className="text-sm text-text-muted italic">{getMotivationMessage(progress)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <DetailStat label="Zebrano">
            <AnimatedCounter value={goal.currentAmount} className="text-lg font-bold text-accent" />
          </DetailStat>
          <DetailStat label="Cel">
            <span className="text-lg font-bold text-text">{formatCurrency(goal.targetAmount)}</span>
          </DetailStat>
          <DetailStat label="Pozostało">
            <span className="text-lg font-bold text-text">{completed ? '—' : formatCurrency(remaining)}</span>
          </DetailStat>
          <DetailStat label="Termin">
            <span className="text-sm font-semibold text-text">
              {goal.deadline ? formatDate(goal.deadline) : 'Brak'}
            </span>
          </DetailStat>
        </div>

        <ProgressBar progress={progress} size="lg" showGlow />

        {goal.deadline && !completed && daysLeft !== null && daysLeft > 0 && weeklyNeeded !== null && (
          <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl">
            <p className="text-sm text-text">
              <span className="font-semibold">{formatDaysRemaining(goal.deadline)}</span>
              {' · '}
              Aby osiągnąć cel na czas, odkładaj około{' '}
              <span className="text-accent font-semibold">{formatCurrency(weeklyNeeded)}</span> tygodniowo.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          {!completed && (
            <Button onClick={() => setShowAddMoney(true)}>+ Dodaj pieniądze</Button>
          )}
          <Button variant="secondary" onClick={() => setShowEdit(true)}>Edytuj</Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>Usuń</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <DetailStat label="Średnia wpłata" card>
          <span className="text-xl font-bold text-text">{formatCurrency(stats.average)}</span>
        </DetailStat>
        <DetailStat label="Liczba wpłat" card>
          <span className="text-xl font-bold text-text">{stats.count}</span>
        </DetailStat>
        <DetailStat label="Największa wpłata" card>
          <span className="text-xl font-bold text-text">{formatCurrency(stats.largest)}</span>
        </DetailStat>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Historia wpłat</h2>
        {goalTx.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-text-secondary text-sm">Brak wpłat dla tego celu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goalTx.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} goal={goal} />
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-text mb-2">Usunąć cel?</h3>
            <p className="text-text-secondary text-sm mb-6">
              Cel „{goal.name}" i wszystkie powiązane transakcje zostaną trwale usunięte.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>Anuluj</Button>
              <Button variant="danger" fullWidth onClick={handleDelete}>Usuń</Button>
            </div>
          </div>
        </div>
      )}

      <GoalFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        editGoal={goal}
        onSubmit={(data) => updateGoal(goal.id, data)}
      />
      <AddMoneyModal
        open={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        goal={goal}
        onDeposit={handleDeposit}
      />
    </motion.div>
  )
}

function DetailStat({
  label,
  children,
  card = false,
}: {
  label: string
  children: React.ReactNode
  card?: boolean
}) {
  if (card) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-text-secondary mb-1">{label}</p>
        {children}
      </div>
    )
  }
  return (
    <div>
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {children}
    </div>
  )
}
