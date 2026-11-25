import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { TransactionItem } from '../components/history/TransactionItem'
import { TransactionFormModal } from '../components/history/TransactionFormModal'
import { EmptyState } from '../components/ui/EmptyState'
import type { Transaction } from '../types'

export function History() {
  const { goals, transactions, updateTransaction, deleteTransaction } = useApp()
  const [filterGoal, setFilterGoal] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Transaction | null>(null)

  const sorted = useMemo(() => {
    return [...transactions]
      .filter(tx => {
        if (filterGoal && tx.goalId !== filterGoal) return false
        if (filterDate && !tx.date.startsWith(filterDate)) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, filterGoal, filterDate])

  const inputClass = "bg-bg-secondary border border-border rounded-xl px-3 py-2 text-text text-sm focus:outline-none focus:border-accent/50"

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Brak transakcji"
        description="Dodaj pierwszą wpłatę, aby rozpocząć śledzenie swoich oszczędności."
      />
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Historia</h1>
        <p className="text-text-secondary text-sm mt-1">Wszystkie wpłaty i transakcje</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filterGoal} onChange={e => setFilterGoal(e.target.value)} className={inputClass}>
          <option value="">Wszystkie cele</option>
          {goals.map(g => (
            <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className={inputClass}
        />
        {(filterGoal || filterDate) && (
          <button
            onClick={() => { setFilterGoal(''); setFilterDate('') }}
            className="text-sm text-accent hover:underline px-2"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-text-secondary">Brak transakcji pasujących do filtrów</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(tx => {
            const goal = goals.find(g => g.id === tx.goalId)
            return (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                goal={goal}
                onEdit={setEditTx}
                onDelete={setConfirmDelete}
              />
            )
          })}
        </div>
      )}

      <TransactionFormModal
        open={!!editTx}
        onClose={() => setEditTx(null)}
        transaction={editTx}
        goals={goals}
        onSubmit={(updates) => editTx && updateTransaction(editTx.id, updates)}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-text mb-2">Usunąć transakcję?</h3>
            <p className="text-text-secondary text-sm mb-6">
              Transakcja zostanie usunięta, a kwota celu zostanie zaktualizowana.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text text-sm transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => { deleteTransaction(confirmDelete.id); setConfirmDelete(null) }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-danger/10 text-danger border border-danger/20 text-sm font-medium hover:bg-danger/20 transition-colors"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
