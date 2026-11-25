import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' zł'
}

export function formatPercent(value: number): string {
  return `${Math.min(100, Math.round(value))}%`
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr)
  return format(date, 'd MMMM yyyy', { locale: pl })
}

export function formatDateTime(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) {
    return `Dzisiaj, ${format(date, 'HH:mm', { locale: pl })}`
  }
  if (isYesterday(date)) {
    return `Wczoraj, ${format(date, 'HH:mm', { locale: pl })}`
  }
  return format(date, 'd MMM yyyy, HH:mm', { locale: pl })
}

export function formatDaysRemaining(deadline: string): string {
  const days = Math.ceil((parseISO(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Termin minął'
  if (days === 1) return 'Pozostał 1 dzień'
  if (days < 5) return `Pozostały ${days} dni`
  return `Pozostało ${days} dni`
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: pl })
}

export function formatMonthYear(date: Date): string {
  return format(date, 'LLLL yyyy', { locale: pl })
}
