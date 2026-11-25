import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'

export function Login() {
  const { signIn } = useAuth()
  const { showToast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/konto'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      showToast('Wypełnij e-mail i hasło', 'error')
      return
    }
    setSubmitting(true)
    try {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        showToast(error.message, 'error')
        return
      }
      showToast('Zalogowano pomyślnie')
      navigate(from, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Zaloguj się" subtitle="Konto zapisane lokalnie na tym komputerze">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="E-mail">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
            placeholder="twoj@email.pl"
          />
        </Field>
        <Field label="Hasło">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Logowanie…' : 'Zaloguj się'}
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary mt-6">
        Nie masz konta?{' '}
        <Link to="/rejestracja" className="text-accent font-medium hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </AuthShell>
  )
}

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <div className="glass-panel rounded-2xl border border-border p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </motion.div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-text-secondary mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
