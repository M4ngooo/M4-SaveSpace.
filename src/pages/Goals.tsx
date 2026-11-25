import { useState } from 'react'
import { useMinLoad } from '../hooks/useMinLoad'
import { GoalListSkeleton } from '../components/ui/Skeleton'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { GoalCard } from '../components/goals/GoalCard'
import { GoalFormModal } from '../components/goals/GoalFormModal'
import { AddMoneyModal } from '../components/goals/AddMoneyModal'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { getActiveGoals, getCompletedGoals } from '../utils/calculations'
import type { Goal } from '../types'

export function Goals() {
  const { goals, addGoal, addDeposit } = useApp()
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [addMoneyGoal, setAddMoneyGoal] = useState<Goal | null>(null)
  const [tab, setTab] = useState<'active' | 'completed'>('active')

  const activeGoals = getActiveGoals(goals)
  const completedGoals = getCompletedGoals(goals)
  const displayedGoals = tab === 'active' ? activeGoals : completedGoals
  const ready = useMinLoad()

  if (!ready && goals.length > 0) {
    return <GoalListSkeleton />
  }

  if (goals.length === 0) {
    return (
      <>
        <EmptyState
          icon="🚀"
          title="Zacznij oszczędzać na swój pierwszy cel 🚀"
          description="Utwórz cel, ustaw kwotę i zacznij odkładać pieniądze."
          actionLabel="+ Utwórz pierwszy cel"
          onAction={() => setShowGoalForm(true)}
        />
        <GoalFormModal open={showGoalForm} onClose={() => setShowGoalForm(false)} onSubmit={addGoal} />
      </>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Cele</h1>
          <p className="text-text-secondary text-sm mt-1">Zarządzaj swoimi celami oszczędnościowymi</p>
        </div>
        <Button onClick={() => setShowGoalForm(true)}>+ Nowy cel</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('active')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'active' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:text-text'
          }`}
        >
          Aktywne ({activeGoals.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'completed' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:text-text'
          }`}
        >
          Ukończone ({completedGoals.length})
        </button>
      </div>

      {displayedGoals.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-text-secondary">
            {tab === 'active' ? 'Brak aktywnych celów' : 'Brak ukończonych celów'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onAddMoney={setAddMoneyGoal} />
          ))}
        </div>
      )}

      <GoalFormModal open={showGoalForm} onClose={() => setShowGoalForm(false)} onSubmit={addGoal} />
      <AddMoneyModal
        open={!!addMoneyGoal}
        onClose={() => setAddMoneyGoal(null)}
        goal={addMoneyGoal}
        onDeposit={addDeposit}
      />
    </motion.div>
  )
}
