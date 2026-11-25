import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { Goal, Transaction } from '../types'

export interface SmartTip {
  id: string
  title: string
  body: string
  priority: number
  actionLabel?: string
  actionPath?: string
}

const DISMISS_KEY = 'oszczednosci-dismissed-tips'

export function getDismissedTipIds(): string[] {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {
    /* ignore */
  }
  return []
}

export function dismissTip(id: string) {
  const ids = new Set(getDismissedTipIds())
  ids.add(id)
  localStorage.setItem(DISMISS_KEY, JSON.stringify([...ids]))
}

interface UseSmartTipsOptions {
  goals: Goal[]
  transactions: Transaction[]
  isLoggedIn: boolean
  dismissed: string[]
}

export function useSmartTips({ goals, transactions, isLoggedIn, dismissed }: UseSmartTipsOptions): SmartTip[] {
  const { pathname } = useLocation()

  return useMemo(() => {
    const tips: SmartTip[] = []
    const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount)
    const hasGoals = goals.length > 0
    const recentWeekTx = transactions.filter(t => {
      const d = new Date(t.date)
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      return d.getTime() >= weekAgo
    })

    if (pathname === '/') {
      if (!hasGoals) {
        tips.push({
          id: 'dash-first-goal',
          title: 'Pierwszy krok',
          body: 'Utwórz cel oszczędnościowy — nawet mała kwota tygodniowo robi różnicę.',
          priority: 10,
          actionLabel: 'Przejdź do celów',
          actionPath: '/cele',
        })
      } else if (recentWeekTx.length === 0) {
        tips.push({
          id: 'dash-no-recent-deposits',
          title: 'Wróć do nawyku',
          body: 'Od tygodnia nie dodano wpłaty. Dodaj nawet symboliczną kwotę, aby utrzymać tempo.',
          priority: 8,
          actionLabel: 'Zobacz historię',
          actionPath: '/historia',
        })
      }
      if (activeGoals.some(g => g.deadline)) {
        tips.push({
          id: 'dash-deadline',
          title: 'Termin na horyzoncie',
          body: 'Masz cel z terminem — sprawdź statystyki, czy tempo wpłat wystarczy na czas.',
          priority: 6,
          actionPath: '/statystyki',
          actionLabel: 'Statystyki',
        })
      }
    }

    if (pathname === '/cele') {
      if (activeGoals.length >= 3) {
        tips.push({
          id: 'goals-many-active',
          title: 'Priorytetyzacja',
          body: 'Masz kilka aktywnych celów. Rozważ skupienie wpłat na jednym, aby szybciej go domknąć.',
          priority: 5,
        })
      }
    }

    if (pathname === '/historia' && transactions.length === 0 && hasGoals) {
      tips.push({
        id: 'history-empty',
        title: 'Brak wpłat',
        body: 'Dodaj pierwszą wpłatę z poziomu karty celu — historia uzupełni się automatycznie.',
        priority: 7,
        actionPath: '/cele',
        actionLabel: 'Do celów',
      })
    }

    if (pathname === '/statystyki' && hasGoals && transactions.length < 3) {
      tips.push({
        id: 'stats-few-data',
        title: 'Więcej danych',
        body: 'Kilka wpłat w różnych dniach sprawi, że wykresy będą bardziej miarodajne.',
        priority: 4,
      })
    }

    if (pathname === '/ustawienia') {
      tips.push({
        id: 'settings-theme',
        title: 'Personalizacja',
        body: 'Wybierz kolor akcentu i tryb jasny/ciemny — aplikacja zapamięta Twój wybór.',
        priority: 3,
      })
      if (!isLoggedIn) {
        tips.push({
          id: 'settings-auth',
          title: 'Konto na tym urządzeniu',
          body: 'Zarejestruj się — profil i motyw zapiszą się lokalnie, tak jak cele oszczędnościowe.',
          priority: 9,
          actionPath: '/rejestracja',
          actionLabel: 'Utwórz konto',
        })
      }
    }

    if (pathname === '/konto' && isLoggedIn) {
      tips.push({
        id: 'profile-avatar',
        title: 'Twój profil',
        body: 'Dodaj zdjęcie lub link do awatara — będzie widoczny w menu bocznym.',
        priority: 5,
      })
    }

    return tips
      .filter(t => !dismissed.includes(t.id))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
  }, [pathname, goals, transactions, isLoggedIn, dismissed])
}
