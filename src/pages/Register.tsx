import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'

export function Register() {
  const { signUp } = useAuth()
  const { showToast } = useApp()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim() || !email.trim() || password.length < 6) {
      showToast('Podaj nazwę, e-mail i hasło (min. 6 znaków)', 'error')
      return
    }
    setSubmitting(true)
    try {
      const { error } = await signUp(email.trim(), password, displayName.trim())
      if (error) {
        showToast(error.message, 'error')
        return
      }
      showToast('Konto zapisane na tym komputerze — witaj!')
      navigate('/konto', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <div className="glass-panel rounded-2xl border border-border p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-text">Utwórz konto lokalne</h1>
        <p className="text-text-secondary text-sm mt-1 leading-relaxed">
          Login i hasło są zapisywane tylko w tej przeglądarce (localStorage) — tak jak Twoje cele. Bez chmury i bez e-maila aktywacyjnego.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <label className="block">
            <span className="text-sm text-text-secondary mb-1.5 block">Nazwa wyświetlana</span>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="auth-input"
              placeholder="Jan Kowalski"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-sm text-text-secondary mb-1.5 block">E-mail (identyfikator)</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
              placeholder="twoj@email.pl"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-sm text-text-secondary mb-1.5 block">Hasło</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Minimum 6 znaków"
              autoComplete="new-password"
            />
          </label>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? 'Tworzenie konta…' : 'Zarejestruj się'}
          </Button>
        </form>
        <p className="text-center text-sm text-text-secondary mt-6">
          Masz już konto?{' '}
          <Link to="/logowanie" className="text-accent font-medium hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
