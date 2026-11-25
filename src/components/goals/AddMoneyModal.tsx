import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Confetti } from '../ui/Confetti'
import { QUICK_AMOUNTS } from '../../types'
import type { Goal } from '../../types'
import { formatCurrency } from '../../utils/format'
import { getProgress, isGoalCompleted } from '../../utils/calculations'

interface AddMoneyModalProps {
  open: boolean
  onClose: () => void
  goal: Goal | null
  onDeposit: (goalId: string, amount: number) => boolean
}

export function AddMoneyModal({ open, onClose, goal, onDeposit }: AddMoneyModalProps) {
  const [customAmount, setCustomAmount] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  if (!goal) return null

  const progress = getProgress(goal.currentAmount, goal.targetAmount)

  const handleDeposit = (amount: number) => {
    const wasCompleted = isGoalCompleted(goal)
    const success = onDeposit(goal.id, amount)
    if (success) {
      if (!wasCompleted && goal.currentAmount + amount >= goal.targetAmount) {
        setShowConfetti(true)
      }
      setCustomAmount('')
      setShowCustom(false)
      onClose()
    }
  }

  const handleCustomSubmit = () => {
    const amount = parseFloat(customAmount)
    if (isNaN(amount) || amount <= 0) return
    handleDeposit(amount)
  }

  const handleClose = () => {
    setCustomAmount('')
    setShowCustom(false)
    onClose()
  }

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Modal open={open} onClose={handleClose} title="Dodaj pieniądze" size="sm">
        <div className="text-center mb-6">
          <span className="text-3xl">{goal.icon}</span>
          <h3 className="font-semibold text-text mt-2">{goal.name}</h3>
          <p className="text-text-secondary text-sm mt-1">
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)} · {Math.round(progress)}%
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {QUICK_AMOUNTS.map(amount => (
            <Button
              key={amount}
              variant="quick"
              size="md"
              onClick={() => handleDeposit(amount)}
            >
              +{amount} zł
            </Button>
          ))}
        </div>

        {!showCustom ? (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowCustom(true)}
          >
            Własna kwota
          </Button>
        ) : (
          <div className="space-y-3">
            <input
              type="number"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              placeholder="Wpisz kwotę..."
              min="1"
              autoFocus
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-text text-center text-lg font-semibold placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
            />
            <div className="flex gap-2">
              <Button variant="secondary" fullWidth onClick={() => { setShowCustom(false); setCustomAmount('') }}>
                Anuluj
              </Button>
              <Button fullWidth onClick={handleCustomSubmit} disabled={!customAmount || parseFloat(customAmount) <= 0}>
                Dodaj
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
