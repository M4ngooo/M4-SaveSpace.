import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher'

export function Account() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const { showToast } = useApp()

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [email] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '')
    setAvatarUrl(profile?.avatar_url ?? '')
  }, [profile?.display_name, profile?.avatar_url])

  const onSave = async () => {
    setSaving(true)
    const { error } = await updateProfile({
      display_name: displayName.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    })
    setSaving(false)
    if (error) {
      showToast(error, 'error')
      return
    }
    showToast('Profil zaktualizowany')
  }

  const onAvatarFile = (file: File | null) => {
    if (!file) return
    if (file.size > 512_000) {
      showToast('Zdjęcie jest za duże (max 512 KB). Użyj URL.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Twoje konto</h1>
        <p className="text-text-secondary text-sm mt-1">Profil zapisany tylko na tym komputerze</p>
      </div>

      <div className="max-w-lg space-y-4">
        <section className="glass-panel rounded-2xl border border-border p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 overflow-hidden flex items-center justify-center text-2xl shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Awatar" className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <p className="font-semibold text-text">{displayName || 'Użytkownik'}</p>
              <p className="text-sm text-text-muted">{email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-text-secondary mb-1.5 block">Nazwa wyświetlana</span>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="auth-input"
                placeholder="Twoja nazwa"
              />
            </label>
            <label className="block">
              <span className="text-sm text-text-secondary mb-1.5 block">Adres URL awatara</span>
              <input
                value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="auth-input"
                placeholder="https://…"
              />
            </label>
            <label className="block">
              <span className="text-sm text-text-secondary mb-1.5 block">Lub wgraj małe zdjęcie</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => onAvatarFile(e.target.files?.[0] ?? null)}
                className="text-sm text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-accent/15 file:text-accent"
              />
            </label>
            <Button onClick={() => void onSave()} disabled={saving} fullWidth>
              {saving ? 'Zapisywanie…' : 'Zapisz profil'}
            </Button>
          </div>
        </section>

        <section className="glass-panel rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text mb-4">Motyw aplikacji</h2>
          <ThemeSwitcher />
        </section>

        <Button variant="secondary" onClick={() => void signOut().then(() => showToast('Wylogowano', 'info'))}>
          Wyloguj się
        </Button>
      </div>
    </motion.div>
  )
}
