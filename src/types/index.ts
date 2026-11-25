export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  icon: string
  description?: string
  createdAt: string
  completedAt?: string
}

export interface Transaction {
  id: string
  goalId: string
  amount: number
  date: string
  note?: string
}

export interface AppData {
  goals: Goal[]
  transactions: Transaction[]
  demoDataLoaded: boolean
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export const GOAL_ICONS = ['💰', '🏠', '🚗', '✈️', '🎮', '💻', '📱', '🎓', '❤️', '🎁', '🌴', '🛡️'] as const

export const QUICK_AMOUNTS = [50, 100, 200, 500, 1000] as const
