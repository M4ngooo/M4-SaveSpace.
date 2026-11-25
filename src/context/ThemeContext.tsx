import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  applyThemeToDocument,
  loadThemeFromStorage,
  saveThemeToStorage,
  type ColorMode,
  type ThemePresetId,
  type ThemeSettings,
} from '../utils/themeColors'
import { useAuthOptional } from './AuthContext'

interface ThemeContextType {
  settings: ThemeSettings
  setPreset: (preset: ThemePresetId) => void
  setCustomAccent: (hex: string) => void
  setMode: (mode: ColorMode) => void
  persistTheme: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const auth = useAuthOptional()
  const [settings, setSettings] = useState<ThemeSettings>(() => loadThemeFromStorage())

  useEffect(() => {
    applyThemeToDocument(settings)
    saveThemeToStorage(settings)
  }, [settings])

  const profileThemeSynced = useRef<string | null>(null)

  useEffect(() => {
    if (!auth?.user) profileThemeSynced.current = null
  }, [auth?.user])

  useEffect(() => {
    const userId = auth?.user?.id
    const p = auth?.profile
    if (!userId || !p) return
    if (profileThemeSynced.current === userId) return
    profileThemeSynced.current = userId
    setSettings({
      preset: (p.theme_preset as ThemePresetId) || 'green',
      customAccent: p.theme_custom_accent || '#22C55E',
      mode: (p.theme_mode as ColorMode) || 'dark',
    })
  }, [auth?.user?.id, auth?.profile])

  const setPreset = useCallback((preset: ThemePresetId) => {
    setSettings(prev => ({ ...prev, preset }))
  }, [])

  const setCustomAccent = useCallback((hex: string) => {
    setSettings(prev => ({ ...prev, preset: 'custom', customAccent: hex }))
  }, [])

  const setMode = useCallback((mode: ColorMode) => {
    setSettings(prev => ({ ...prev, mode }))
  }, [])

  const persistTheme = useCallback(async () => {
    saveThemeToStorage(settings)
    if (auth?.user && auth.updateProfileTheme) {
      await auth.updateProfileTheme({
        theme_preset: settings.preset,
        theme_custom_accent: settings.customAccent,
        theme_mode: settings.mode,
      })
    }
  }, [auth?.user, auth?.updateProfileTheme, settings])

  const value = useMemo(
    () => ({ settings, setPreset, setCustomAccent, setMode, persistTheme }),
    [settings, setPreset, setCustomAccent, setMode, persistTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
