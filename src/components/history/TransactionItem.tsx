import type { Transaction, Goal } from '../../types'
import { formatDateTime, formatCurrency } from '../../utils/format'
import { Button } from '../ui/Button'

interface TransactionItemProps {
  transaction: Transaction
  goal?: Goal
  onEdit?: (tx: Transaction) => void
  onDelete?: (tx: Transaction) => void
  compact?: boolean
}

export function TransactionItem({ transaction, goal, onEdit, onDelete, compact = false }: TransactionItemProps) {
  return (
    <div className={`flex items-center gap-4 ${compact ? 'py-3' : 'py-4 px-4 bg-card border border-border rounded-xl'}`}>
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg shrink-0">
        {goal?.icon || '💰'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-accent">+{formatCurrency(transaction.amount)}</span>
          {!compact && (
            <span className="text-xs text-text-muted shrink-0">{formatDateTime(transaction.date)}</span>
          )}
        </div>
        <p className="text-sm text-text-secondary truncate">
          {goal?.name || 'Nieznany cel'} {goal?.icon}
        </p>
        {transaction.note && !compact && (
          <p className="text-xs text-text-muted mt-0.5 truncate">{transaction.note}</p>
        )}
        {compact && (
          <span className="text-xs text-text-muted">{formatDateTime(transaction.date)}</span>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-1 shrink-0">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)}>Edytuj</Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(transaction)} className="text-danger hover:text-danger">Usuń</Button>
          )}
        </div>
      )}
    </div>
  )
}
