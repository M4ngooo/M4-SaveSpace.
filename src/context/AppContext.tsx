import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Goal, Transaction, Toast, AppData } from '../types'
import { SEED_DATA } from '../data/seed'
import { isGoalCompleted } from '../utils/calculations'

const STORAGE_KEY = 'oszczednosci-app-data'

interface AppContextType {
  goals: Goal[]
  transactions: Transaction[]
  toasts: Toast[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completedAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addDeposit: (goalId: string, amount: number, note?: string) => boolean
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  showToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
  loadDemoData: () => void
  clearAllData: () => void
  hasDemoData: boolean
}

const AppContext = createContext<AppContextType | null>(null)

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppData
  } catch { /* ignore */ }
  return SEED_DATA
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    saveData(data)
  }, [data])

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = uuidv4()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const recalcGoalAmount = useCallback((goalId: string, transactions: Transaction[]): number => {
    return transactions
      .filter(t => t.goalId === goalId)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [])

  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'completedAt'>) => {
    const goalId = uuidv4()
    const goal: Goal = {
      ...goalData,
      id: goalId,
      createdAt: new Date().toISOString(),
      completedAt: goalData.currentAmount >= goalData.targetAmount ? new Date().toISOString() : undefined,
    }
    const initialTx: Transaction | null = goalData.currentAmount > 0
      ? {
          id: uuidv4(),
          goalId,
          amount: goalData.currentAmount,
          date: new Date().toISOString(),
          note: 'Kwota początkowa',
        }
      : null

    setData(prev => ({
      ...prev,
      goals: [...prev.goals, goal],
      transactions: initialTx ? [initialTx, ...prev.transactions] : prev.transactions,
    }))
    showToast('Cel utworzony pomyślnie')
  }, [showToast])

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g
        const updated = { ...g, ...updates }
        if (updated.currentAmount >= updated.targetAmount && !g.completedAt) {
          updated.completedAt = new Date().toISOString()
        } else if (updated.currentAmount < updated.targetAmount) {
          updated.completedAt = undefined
        }
        return updated
      }),
    }))
    showToast('Cel zaktualizowany')
  }, [showToast])

  const deleteGoal = useCallback((id: string) => {
    setData(prev => ({
      goals: prev.goals.filter(g => g.id !== id),
      transactions: prev.transactions.filter(t => t.goalId !== id),
      demoDataLoaded: prev.demoDataLoaded,
    }))
    showToast('Cel usunięty', 'info')
  }, [showToast])

  const addDeposit = useCallback((goalId: string, amount: number, note?: string): boolean => {
    if (amount <= 0) {
      showToast('Kwota musi być większa od zera', 'error')
      return false
    }
    const goal = data.goals.find(g => g.id === goalId)
    if (!goal) return false

    const wasCompleted = isGoalCompleted(goal)
    const tx: Transaction = {
      id: uuidv4(),
      goalId,
      amount,
      date: new Date().toISOString(),
      note,
    }

    setData(prev => {
      const newTransactions = [tx, ...prev.transactions]
      const newGoals = prev.goals.map(g => {
        if (g.id !== goalId) return g
        const newAmount = g.currentAmount + amount
        const completed = newAmount >= g.targetAmount
        return {
          ...g,
          currentAmount: newAmount,
          completedAt: completed ? (g.completedAt || new Date().toISOString()) : undefined,
        }
      })
      return { ...prev, goals: newGoals, transactions: newTransactions }
    })

    if (!wasCompleted && goal.currentAmount + amount >= goal.targetAmount) {
      showToast('Cel osiągnięty! 🎉')
    } else {
      showToast(`Dodano ${amount} zł 🎉`)
    }
    return true
  }, [data.goals, showToast])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData(prev => {
      const newTransactions = prev.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
      const affectedGoalIds = new Set<string>()
      const oldTx = prev.transactions.find(t => t.id === id)
      if (oldTx) affectedGoalIds.add(oldTx.goalId)
      if (updates.goalId) affectedGoalIds.add(updates.goalId)

      const newGoals = prev.goals.map(g => {
        if (!affectedGoalIds.has(g.id)) return g
        const newAmount = recalcGoalAmount(g.id, newTransactions)
        const completed = newAmount >= g.targetAmount
        return {
          ...g,
          currentAmount: newAmount,
          completedAt: completed ? (g.completedAt || new Date().toISOString()) : undefined,
        }
      })
      return { ...prev, transactions: newTransactions, goals: newGoals }
    })
    showToast('Transakcja zaktualizowana')
  }, [recalcGoalAmount, showToast])

  const deleteTransaction = useCallback((id: string) => {
    setData(prev => {
      const tx = prev.transactions.find(t => t.id === id)
      if (!tx) return prev
      const newTransactions = prev.transactions.filter(t => t.id !== id)
      const newGoals = prev.goals.map(g => {
        if (g.id !== tx.goalId) return g
        const newAmount = recalcGoalAmount(g.id, newTransactions)
        const completed = newAmount >= g.targetAmount
        return {
          ...g,
          currentAmount: newAmount,
          completedAt: completed ? g.completedAt : undefined,
        }
      })
      return { ...prev, transactions: newTransactions, goals: newGoals }
    })
    showToast('Transakcja usunięta', 'info')
  }, [recalcGoalAmount, showToast])

  const loadDemoData = useCallback(() => {
    setData(SEED_DATA)
    showToast('Dane demonstracyjne załadowane')
  }, [showToast])

  const clearAllData = useCallback(() => {
    setData({ goals: [], transactions: [], demoDataLoaded: false })
    showToast('Wszystkie dane usunięte', 'info')
  }, [showToast])

  return (
    <AppContext.Provider value={{
      goals: data.goals,
      transactions: data.transactions,
      toasts,
      addGoal,
      updateGoal,
      deleteGoal,
      addDeposit,
      updateTransaction,
      deleteTransaction,
      showToast,
      removeToast,
      loadDemoData,
      clearAllData,
      hasDemoData: data.demoDataLoaded,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
