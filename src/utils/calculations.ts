import { differenceInDays, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import type { Goal, Transaction } from '../types'

export function getProgress(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, (current / target) * 100)
}

export function getRemaining(current: number, target: number): number {
  return Math.max(0, target - current)
}

export function isGoalCompleted(goal: Goal): boolean {
  return goal.currentAmount >= goal.targetAmount
}

export function getActiveGoals(goals: Goal[]): Goal[] {
  return goals.filter(g => !isGoalCompleted(g))
}

export function getCompletedGoals(goals: Goal[]): Goal[] {
  return goals.filter(g => isGoalCompleted(g))
}

export function getTotalSaved(goals: Goal[]): number {
  return goals.reduce((sum, g) => sum + g.currentAmount, 0)
}

export function getGoalTransactions(transactions: Transaction[], goalId: string): Transaction[] {
  return transactions
    .filter(t => t.goalId === goalId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getGoalStats(transactions: Transaction[], goalId: string) {
  const goalTx = getGoalTransactions(transactions, goalId)
  if (goalTx.length === 0) {
    return { average: 0, count: 0, largest: 0 }
  }
  const amounts = goalTx.map(t => t.amount)
  return {
    average: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length),
    count: goalTx.length,
    largest: Math.max(...amounts),
  }
}

export function getWeeklySavingsNeeded(goal: Goal): number | null {
  if (!goal.deadline || isGoalCompleted(goal)) return null
  const remaining = getRemaining(goal.currentAmount, goal.targetAmount)
  const daysLeft = differenceInDays(parseISO(goal.deadline), new Date())
  if (daysLeft <= 0) return null
  const weeksLeft = Math.max(1, daysLeft / 7)
  return Math.ceil(remaining / weeksLeft)
}

export function getMonthlySavingsNeeded(goal: Goal): number | null {
  if (!goal.deadline || isGoalCompleted(goal)) return null
  const remaining = getRemaining(goal.currentAmount, goal.targetAmount)
  const daysLeft = differenceInDays(parseISO(goal.deadline), new Date())
  if (daysLeft <= 0) return null
  const monthsLeft = Math.max(1, daysLeft / 30)
  return Math.ceil(remaining / monthsLeft)
}

export function getDaysRemaining(deadline: string): number {
  return Math.ceil((parseISO(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function getHighestProgressGoal(goals: Goal[]): Goal | null {
  const active = getActiveGoals(goals)
  if (active.length === 0) return null
  return active.reduce((best, g) => {
    const p = getProgress(g.currentAmount, g.targetAmount)
    const bp = getProgress(best.currentAmount, best.targetAmount)
    return p > bp ? g : best
  })
}

export function getTransactionsInMonth(transactions: Transaction[], date: Date): Transaction[] {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return transactions.filter(t =>
    isWithinInterval(parseISO(t.date), { start, end })
  )
}

export function getMonthTotal(transactions: Transaction[], date: Date): number {
  return getTransactionsInMonth(transactions, date).reduce((s, t) => s + t.amount, 0)
}

export function getMostActiveGoal(goals: Goal[], transactions: Transaction[]): Goal | null {
  if (transactions.length === 0) return null
  const counts = new Map<string, number>()
  transactions.forEach(t => counts.set(t.goalId, (counts.get(t.goalId) || 0) + 1))
  let maxId = ''
  let maxCount = 0
  counts.forEach((count, id) => {
    if (count > maxCount) { maxCount = count; maxId = id }
  })
  return goals.find(g => g.id === maxId) || null
}

export function getSavingsOverTime(transactions: Transaction[]): { date: string; amount: number; cumulative: number }[] {
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let cumulative = 0
  const byDay = new Map<string, number>()
  sorted.forEach(t => {
    const day = t.date.split('T')[0]
    byDay.set(day, (byDay.get(day) || 0) + t.amount)
  })
  return Array.from(byDay.entries()).map(([date, amount]) => {
    cumulative += amount
    return { date, amount, cumulative }
  })
}

export function getMonthComparison(transactions: Transaction[]): number | null {
  const now = new Date()
  const thisMonth = getMonthTotal(transactions, now)
  const lastMonth = getMonthTotal(transactions, new Date(now.getFullYear(), now.getMonth() - 1))
  if (lastMonth === 0) return null
  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
}
