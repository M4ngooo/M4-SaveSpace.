import { useState, useEffect, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { GOAL_ICONS } from '../../types'
import type { Goal } from '../../types'

interface GoalFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    targetAmount: number
    currentAmount: number
    deadline?: string
    icon: string
    description?: string
  }) => void
  editGoal?: Goal | null
}

export function GoalFormModal({ open, onClose, onSubmit, editGoal }: GoalFormModalProps) {
  const [name, setName] = useState(editGoal?.name || '')
  const [targetAmount, setTargetAmount] = useState(editGoal?.targetAmount?.toString() || '')
  const [currentAmount, setCurrentAmount] = useState(editGoal?.currentAmount?.toString() || '0')
  const [deadline, setDeadline] = useState(editGoal?.deadline?.split('T')[0] || '')
  const [icon, setIcon] = useState(editGoal?.icon || '💰')
  const [description, setDescription] = useState(editGoal?.description || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (editGoal) {
        setName(editGoal.name)
        setTargetAmount(editGoal.targetAmount.toString())
        setCurrentAmount(editGoal.currentAmount.toString())
        setDeadline(editGoal.deadline?.split('T')[0] || '')
        setIcon(editGoal.icon)
        setDescription(editGoal.description || '')
      } else {
        setName('')
        setTargetAmount('')
        setCurrentAmount('0')
        setDeadline('')
        setIcon('💰')
        setDescription('')
      }
      setErrors({})
    }
  }, [open, editGoal])

  const handleClose = () => {
    onClose()
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nazwa celu jest wymagana'
    const target = parseFloat(targetAmount)
    if (!targetAmount || isNaN(target) || target <= 0) e.targetAmount = 'Podaj prawidłową kwotę docelową'
    const current = parseFloat(currentAmount)
    if (isNaN(current) || current < 0) e.currentAmount = 'Podaj prawidłową kwotę początkową'
    if (current > target) e.currentAmount = 'Kwota początkowa nie może przekraczać kwoty docelowej'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: deadline || undefined,
      icon,
      description: description.trim() || undefined,
    })
    handleClose()
  }

  const inputClass = "w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={editGoal ? 'Edytuj cel' : 'Nowy cel'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Nazwa celu</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="np. Wakacje, Nowy iPhone..."
            className={inputClass}
          />
          {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Kwota docelowa</label>
            <input
              type="number"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              placeholder="5000"
              min="1"
              className={inputClass}
            />
            {errors.targetAmount && <p className="text-danger text-xs mt-1">{errors.targetAmount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Kwota początkowa</label>
            <input
              type="number"
              value={currentAmount}
              onChange={e => setCurrentAmount(e.target.value)}
              placeholder="0"
              min="0"
              className={inputClass}
            />
            {errors.currentAmount && <p className="text-danger text-xs mt-1">{errors.currentAmount}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Termin (opcjonalnie)</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Ikona celu</label>
          <div className="flex flex-wrap gap-2">
            {GOAL_ICONS.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  icon === i
                    ? 'bg-accent/20 border-2 border-accent scale-110'
                    : 'bg-bg-secondary border border-border hover:border-border-light'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Opis (opcjonalnie)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Krótki opis celu..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} fullWidth>Anuluj</Button>
          <Button type="submit" fullWidth>{editGoal ? 'Zapisz' : 'Utwórz cel'}</Button>
        </div>
      </form>
    </Modal>
  )
}
