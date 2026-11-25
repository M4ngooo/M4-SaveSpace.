import { motion } from 'framer-motion'
import { useMinLoad } from '../hooks/useMinLoad'
import { DashboardSkeleton } from '../components/ui/Skeleton'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { EmptyState } from '../components/ui/EmptyState'
import {
  getMonthTotal,
  getCompletedGoals,
  getMostActiveGoal,
  getSavingsOverTime,
} from '../utils/calculations'
import { formatCurrency, formatMonthYear } from '../utils/format'

export function Statistics() {
  const { goals, transactions } = useApp()
  const ready = useMinLoad()

  if (!ready && transactions.length > 0) {
    return <DashboardSkeleton />
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="Brak danych statystycznych"
        description="Dodaj wpłaty, aby zobaczyć statystyki oszczędności."
      />
    )
  }

  const now = new Date()
  const thisMonth = getMonthTotal(transactions, now)
  const lastMonth = getMonthTotal(transactions, new Date(now.getFullYear(), now.getMonth() - 1))
  const totalDeposits = transactions.reduce((s, t) => s + t.amount, 0)
  const avgDeposit = Math.round(totalDeposits / transactions.length)
  const largestDeposit = Math.max(...transactions.map(t => t.amount))
  const mostActive = getMostActiveGoal(goals, transactions)
  const completed = getCompletedGoals(goals)
  const chartData = getSavingsOverTime(transactions).map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
  }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Statystyki</h1>
        <p className="text-text-secondary text-sm mt-1">Przegląd Twoich oszczędności</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label={`Oszczędności — ${formatMonthYear(now)}`}>
          <AnimatedCounter value={thisMonth} className="text-xl font-bold text-accent" />
        </StatCard>
        <StatCard label={`Oszczędności — ${formatMonthYear(new Date(now.getFullYear(), now.getMonth() - 1))}`}>
          <AnimatedCounter value={lastMonth} className="text-xl font-bold text-text" />
        </StatCard>
        <StatCard label="Łączna liczba wpłat">
          <AnimatedCounter value={transactions.length} format="number" className="text-xl font-bold text-text" />
        </StatCard>
        <StatCard label="Ukończone cele">
          <AnimatedCounter value={completed.length} format="number" className="text-xl font-bold text-text" />
        </StatCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Suma wpłat">
          <AnimatedCounter value={totalDeposits} className="text-xl font-bold text-accent" />
        </StatCard>
        <StatCard label="Średnia wpłata">
          <AnimatedCounter value={avgDeposit} className="text-xl font-bold text-text" />
        </StatCard>
        <StatCard label="Największa wpłata">
          <AnimatedCounter value={largestDeposit} className="text-xl font-bold text-text" />
        </StatCard>
      </div>

      {mostActive && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-8">
          <p className="text-xs text-text-secondary mb-1">Najaktywniejszy cel</p>
          <p className="text-lg font-semibold text-text">
            {mostActive.icon} {mostActive.name}
          </p>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-text-secondary mb-6">Oszczędności w czasie</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2A24" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6B7A72', fontSize: 11 }}
                  axisLine={{ stroke: '#1F2A24' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B7A72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v} zł`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#151C18',
                    border: '1px solid #1F2A24',
                    borderRadius: '12px',
                    color: '#F0F4F2',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Suma']}
                  labelFormatter={(label) => label}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#greenGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
      <p className="text-xs text-text-secondary mb-2 leading-snug">{label}</p>
      {children}
    </div>
  )
}
