import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useAuthOptional } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher'

export function Settings() {
  const { goals, transactions, loadDemoData, clearAllData, hasDemoData } = useApp()
  const auth = useAuthOptional()
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Ustawienia</h1>
        <p className="text-text-secondary text-sm mt-1">Zarządzaj aplikacją i danymi</p>
      </div>

      <div className="space-y-4 max-w-lg">
        <SettingsSection title="Wygląd i motyw">
          <ThemeSwitcher />
        </SettingsSection>

        <SettingsSection title="Konto użytkownika">
          {auth?.user ? (
            <div className="space-y-3">
              <p className="text-text-secondary text-sm">
                Jesteś zalogowany jako <strong className="text-text">{auth.user.email}</strong>.
              </p>
              <Link to="/konto">
                <Button variant="secondary" fullWidth>Edytuj profil i awatar</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-text-secondary text-sm">
                Utwórz konto lokalne — profil i motyw zapiszą się w tej przeglądarce (localStorage), obok celów i transakcji.
              </p>
              <div className="flex gap-2">
                <Link to="/logowanie" className="flex-1">
                  <Button variant="primary" fullWidth>Zaloguj się</Button>
                </Link>
                <Link to="/rejestracja" className="flex-1">
                  <Button variant="secondary" fullWidth>Rejestracja</Button>
                </Link>
              </div>
            </div>
          )}
        </SettingsSection>

        <SettingsSection title="Informacje">
          <div className="space-y-3">
            <InfoRow label="Cele" value={goals.length.toString()} />
            <InfoRow label="Transakcje" value={transactions.length.toString()} />
            <InfoRow label="Przechowywanie" value="localStorage (ten komputer)" />
          </div>
        </SettingsSection>

        <SettingsSection title="Dane demonstracyjne">
          <p className="text-text-secondary text-sm mb-4">
            Załaduj przykładowe cele i transakcje, aby zobaczyć aplikację w działaniu.
          </p>
          <Button variant="secondary" onClick={loadDemoData} disabled={hasDemoData && goals.length > 0}>
            {hasDemoData && goals.length > 0 ? 'Dane demo już załadowane' : 'Załaduj dane demonstracyjne'}
          </Button>
        </SettingsSection>

        <SettingsSection title="Zarządzanie danymi">
          <p className="text-text-secondary text-sm mb-4">
            Usuń wszystkie cele, transakcje i statystyki. Tej operacji nie można cofnąć.
          </p>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>
            Usuń wszystkie dane
          </Button>
        </SettingsSection>

        <SettingsSection title="O aplikacji">
          <p className="text-text-secondary text-sm leading-relaxed">
            Oszczędności — aplikacja do śledzenia celów finansowych.
            Twórz cele, dodawaj wpłaty i obserwuj postęp w czasie rzeczywistym.
          </p>
          <p className="text-text-muted text-xs mt-3">Wersja 2.0.0</p>
        </SettingsSection>
      </div>

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmClear(false)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-text mb-2">Usunąć wszystkie dane?</h3>
            <p className="text-text-secondary text-sm mb-6">
              Wszystkie cele, transakcje i statystyki zostaną trwale usunięte. Tej operacji nie można cofnąć.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setConfirmClear(false)}>Anuluj</Button>
              <Button variant="danger" fullWidth onClick={() => { clearAllData(); setConfirmClear(false) }}>
                Usuń wszystko
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-text mb-4">{title}</h2>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text">{value}</span>
    </div>
  )
}
