import { THEME_PRESETS, type ThemePresetId } from '../../utils/themeColors'
import { useTheme } from '../../context/ThemeContext'
import { useApp } from '../../context/AppContext'

const presetIds = Object.keys(THEME_PRESETS) as Exclude<ThemePresetId, 'custom'>[]

interface ThemeSwitcherProps {
  compact?: boolean
  onSaved?: () => void
}

export function ThemeSwitcher({ compact, onSaved }: ThemeSwitcherProps) {
  const { settings, setPreset, setCustomAccent, setMode, persistTheme } = useTheme()
  const { showToast } = useApp()

  const handleSave = async () => {
    await persistTheme()
    showToast('Motyw zapisany')
    onSaved?.()
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div>
        <p className="text-xs text-text-muted mb-2">Tryb wyświetlania</p>
        <div className="flex gap-2">
          <ModeButton active={settings.mode === 'dark'} onClick={() => setMode('dark')} label="Ciemny" />
          <ModeButton active={settings.mode === 'light'} onClick={() => setMode('light')} label="Jasny" />
        </div>
      </div>

      <div>
        <p className="text-xs text-text-muted mb-2">Kolor akcentu</p>
        <div className="flex flex-wrap gap-2">
          {presetIds.map(id => {
            const p = THEME_PRESETS[id]
            const active = settings.preset === id
            return (
              <button
                key={id}
                type="button"
                title={p.label}
                onClick={() => setPreset(id)}
                className={`w-10 h-10 rounded-xl border-2 transition-transform hover:scale-105 ${
                  active ? 'border-text scale-105' : 'border-transparent'
                }`}
                style={{ backgroundColor: p.accent }}
                aria-label={p.label}
              />
            )
          })}
          <label
            className={`relative w-10 h-10 rounded-xl border-2 overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
              settings.preset === 'custom' ? 'border-text scale-105' : 'border-border'
            }`}
            title="Własny kolor"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-accent to-accent-hover opacity-80" />
            <input
              type="color"
              value={settings.customAccent}
              onChange={e => setCustomAccent(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Wybierz własny kolor"
            />
          </label>
        </div>
        <p className="text-xs text-text-secondary mt-2">
          Wybrany: {settings.preset === 'custom' ? 'Własny' : THEME_PRESETS[settings.preset as keyof typeof THEME_PRESETS]?.label ?? settings.preset}
        </p>
      </div>

      {!compact && (
        <button
          type="button"
          onClick={() => void handleSave()}
          className="text-sm font-medium text-accent hover:underline"
        >
          Zapisz motyw do konta lokalnego
        </button>
      )}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
        active
          ? 'bg-accent/15 border-accent/40 text-accent'
          : 'bg-card border-border text-text-secondary hover:border-border-light'
      }`}
    >
      {label}
    </button>
  )
}
