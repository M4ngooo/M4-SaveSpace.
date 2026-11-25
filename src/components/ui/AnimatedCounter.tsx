import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import { formatCurrency } from '../../utils/format'

interface AnimatedCounterProps {
  value: number
  format?: 'currency' | 'number' | 'percent'
  className?: string
}

export function AnimatedCounter({ value, format = 'currency', className = '' }: AnimatedCounterProps) {
  const animated = useAnimatedNumber(value)

  const display = format === 'currency'
    ? formatCurrency(animated)
    : format === 'percent'
    ? `${animated}%`
    : animated.toString()

  return <span className={className}>{display}</span>
}
