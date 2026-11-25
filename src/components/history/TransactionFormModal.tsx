import { useState, useEffect, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { Transaction, Goal } from '../../types'

interface TransactionFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (updates: Partial<Transaction>) => void
  transaction: Transaction | null
  goals: Goal[]
}

export function TransactionFormModal({ open, onClose, onSubmit, transaction, goals }: TransactionFormModalProps) {
  const [amount, setAmount] = useState('')
  const [goalId, setGoalId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && transaction) {
      setAmount(transaction.amount.toString())
      setGoalId(transaction.goalId)
      setNote(transaction.note || '')
      setDate(transaction.date.slice(0, 16))
      setErrors({})
    }
  }, [open, transaction])

  const handleClose = () => {
    onClose()
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) e.amount = 'Podaj prawidłową kwotę'
    if (!goalId) e.goalId = 'Wybierz cel'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      amount: parseFloat(amount),
      goalId,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    })
    handleClose()
  }

  const inputClass = "w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-text text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"

  if (!transaction) return null

  return (
    <Modal open={open} onClose={handleClose} title="Edytuj transakcję" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Kwota</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="1" className={inputClass} />
          {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Cel</label>
          <select value={goalId} onChange={e => setGoalId(e.target.value)} className={inputClass}>
            {goals.map(g => (
              <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
            ))}
          </select>
          {errors.goalId && <p className="text-danger text-xs mt-1">{errors.goalId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Data i godzina</label>
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Notatka (opcjonalnie)</label>
          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Notatka..." className={inputClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} fullWidth>Anuluj</Button>
          <Button type="submit" fullWidth>Zapisz</Button>
        </div>
      </form>
    </Modal>
  )
}
