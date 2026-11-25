import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { GoalCard } from '../components/goals/GoalCard'
import { GoalFormModal } from '../components/goals/GoalFormModal'
import { AddMoneyModal } from '../components/goals/AddMoneyModal'
import { TransactionItem } from '../components/history/TransactionItem'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import {
  getTotalSaved,
  getActiveGoals,
  getCompletedGoals,
  getHighestProgressGoal,
  getProgress,
  getMonthlySavingsNeeded,
  getMonthComparison,
} from '../utils/calculations'
import { formatCurrency } from '../utils/format'
import type { Goal } from '../types'

export function Dashboard() {
  const { goals, transactions, addGoal, addDeposit } = useApp()
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [addMoneyGoal, setAddMoneyGoal] = useState<Goal | null>(null)

  const totalSaved = getTotalSaved(goals)
  const activeGoals = getActiveGoals(goals)
  const completedGoals = getCompletedGoals(goals)
  const topGoal = getHighestProgressGoal(goals)
  const topProgress = topGoal ? getProgress(topGoal.currentAmount, topGoal.targetAmount) : 0
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
  const monthComparison = getMonthComparison(transactions)

  const insightGoal = activeGoals.find(g => g.deadline) || activeGoals[0]
  const monthlyNeeded = insightGoal ? getMonthlySavingsNeeded(insightGoal) : null

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">Witaj 👋</h1>
        <p className="text-text-secondary mt-1">Małymi krokami osiągniesz swoje cele.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Łącznie zaoszczędzone">
          <AnimatedCounter value={totalSaved} className="text-xl sm:text-2xl font-bold text-accent" />
        </StatCard>
        <StatCard label="Aktywne cele">
          <AnimatedCounter value={activeGoals.length} format="number" className="text-xl sm:text-2xl font-bold text-text" />
        </StatCard>
        <StatCard label="Ukończone cele">
          <AnimatedCounter value={completedGoals.length} format="number" className="text-xl sm:text-2xl font-bold text-text" />
        </StatCard>
        <StatCard label="Największy postęp">
          <AnimatedCounter value={Math.round(topProgress)} format="percent" className="text-xl sm:text-2xl font-bold text-text" />
        </StatCard>
      </div>

      {(monthlyNeeded !== null || monthComparison !== null) && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-text-secondary mb-3">Inteligentne wskazówki</h2>
          <div className="space-y-2">
            {monthlyNeeded !== null && insightGoal && (
              <p className="text-sm text-text">
                Aby osiągnąć cel „{insightGoal.name}" na czas, odkładaj około{' '}
                <span className="text-accent font-semibold">{formatCurrency(monthlyNeeded)}</span> miesięcznie.
              </p>
            )}
            {monthComparison !== null && (
              <p className="text-sm text-text">
                {monthComparison >= 0
                  ? <>W tym miesiącu zaoszczędziłeś o <span className="text-accent font-semibold">{monthComparison}%</span> więcej niż w poprzednim miesiącu.</>
                  : <>W tym miesiącu zaoszczędziłeś o <span className="text-danger font-semibold">{Math.abs(monthComparison)}%</span> mniej niż w poprzednim miesiącu.</>
                }
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">Aktywne cele</h2>
        <Button size="sm" onClick={() => setShowGoalForm(true)}>+ Nowy cel</Button>
      </div>

      {activeGoals.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-8">
          <p className="text-text-secondary">Wszystkie cele ukończone! 🎉</p>
          <Button className="mt-4" size="sm" onClick={() => setShowGoalForm(true)}>+ Nowy cel</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {activeGoals.slice(0, 3).map(goal => (
            <GoalCard key={goal.id} goal={goal} onAddMoney={setAddMoneyGoal} />
          ))}
        </div>
      )}

      {activeGoals.length > 3 && (
        <div className="text-center mb-8">
          <Link to="/cele" className="text-sm text-accent hover:underline">Zobacz wszystkie cele →</Link>
        </div>
      )}

      {recentTransactions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Ostatnia aktywność</h2>
            <Link to="/historia" className="text-sm text-accent hover:underline">Zobacz wszystko</Link>
          </div>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {recentTransactions.map(tx => {
              const goal = goals.find(g => g.id === tx.goalId)
              return (
                <div key={tx.id} className="px-4">
                  <TransactionItem transaction={tx} goal={goal} compact />
                </div>
              )
            })}
          </div>
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

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
      <p className="text-xs text-text-secondary mb-2">{label}</p>
      {children}
    </div>
  )
}
