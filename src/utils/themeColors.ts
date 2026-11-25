export type ThemePresetId = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'custom'

export type ColorMode = 'dark' | 'light'

export interface ThemeSettings {
  preset: ThemePresetId
  customAccent: string
  mode: ColorMode
}

export const THEME_STORAGE_KEY = 'oszczednosci-theme'

export const THEME_PRESETS: Record<
  Exclude<ThemePresetId, 'custom'>,
  { label: string; accent: string; hover: string; muted: string }
> = {
  green: { label: 'Zielony', accent: '#22C55E', hover: '#16A34A', muted: '#22C55E33' },
  blue: { label: 'Niebieski', accent: '#3B82F6', hover: '#2563EB', muted: '#3B82F633' },
  purple: { label: 'Fioletowy', accent: '#A855F7', hover: '#9333EA', muted: '#A855F733' },
  orange: { label: 'Pomarańczowy', accent: '#F97316', hover: '#EA580C', muted: '#F9731633' },
  red: { label: 'Czerwony', accent: '#EF4444', hover: '#DC2626', muted: '#EF444433' },
}

const DARK_SURFACES = {
  bg: '#0B0F0D',
  bgSecondary: '#111916',
  card: '#151C18',
  cardHover: '#1A221E',
  border: '#1F2A24',
  borderLight: '#2A3830',
  text: '#F0F4F2',
  textSecondary: '#9CA89F',
  textMuted: '#6B7A72',
}

const LIGHT_SURFACES = {
  bg: '#F4F7F5',
  bgSecondary: '#E8EEEA',
  card: '#FFFFFF',
  cardHover: '#F0F4F2',
  border: '#D1DDD6',
  borderLight: '#B8C9BE',
  text: '#0F1411',
  textSecondary: '#4A5C52',
  textMuted: '#6B7A72',
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return null
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  if ([r, g, b].some(n => Number.isNaN(n))) return null
  return { r, g, b }
}

export function deriveHoverColor(accent: string): string {
  const rgb = hexToRgb(accent)
  if (!rgb) return accent
  const factor = 0.85
  const r = Math.round(rgb.r * factor)
  const g = Math.round(rgb.g * factor)
  const b = Math.round(rgb.b * factor)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function deriveMutedColor(accent: string): string {
  const rgb = hexToRgb(accent)
  if (!rgb) return `${accent}33`
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
}

export function resolveAccent(settings: ThemeSettings): { accent: string; hover: string; muted: string } {
  if (settings.preset !== 'custom' && settings.preset in THEME_PRESETS) {
    const p = THEME_PRESETS[settings.preset]
    return { accent: p.accent, hover: p.hover, muted: p.muted }
  }
  const accent = settings.customAccent || THEME_PRESETS.green.accent
  return {
    accent,
    hover: deriveHoverColor(accent),
    muted: deriveMutedColor(accent),
  }
}

export function applyThemeToDocument(settings: ThemeSettings) {
  const root = document.documentElement
  const { accent, hover, muted } = resolveAccent(settings)
  const surfaces = settings.mode === 'light' ? LIGHT_SURFACES : DARK_SURFACES

  root.style.setProperty('--color-accent', accent)
  root.style.setProperty('--color-accent-hover', hover)
  root.style.setProperty('--color-accent-muted', muted)
  root.style.setProperty('--color-bg', surfaces.bg)
  root.style.setProperty('--color-bg-secondary', surfaces.bgSecondary)
  root.style.setProperty('--color-card', surfaces.card)
  root.style.setProperty('--color-card-hover', surfaces.cardHover)
  root.style.setProperty('--color-border', surfaces.border)
  root.style.setProperty('--color-border-light', surfaces.borderLight)
  root.style.setProperty('--color-text', surfaces.text)
  root.style.setProperty('--color-text-secondary', surfaces.textSecondary)
  root.style.setProperty('--color-text-muted', surfaces.textMuted)
  root.style.setProperty('--glow-accent', muted)
  root.dataset.colorMode = settings.mode
}

export function loadThemeFromStorage(): ThemeSettings {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ThemeSettings
      if (parsed.preset && parsed.mode) return parsed
    }
  } catch {
    /* ignore */
  }
  return { preset: 'green', customAccent: '#22C55E', mode: 'dark' }
}

export function saveThemeToStorage(settings: ThemeSettings) {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings))
}
