import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getLocalSessionUserId,
  getLocalUserById,
  localSignIn,
  localSignOut,
  localSignUp,
  localUpdateUser,
  localUserToProfile,
  type LocalUserRecord,
} from '../lib/localAuth'

export interface ProfileUpdate {
  display_name?: string | null
  avatar_url?: string | null
}

export interface AppUser {
  id: string
  email: string
}

export interface AppProfile {
  id: string
  display_name: string | null
  avatar_url: string | null
  theme_preset: string | null
  theme_custom_accent: string | null
  theme_mode: string | null
}

interface AuthErrorLike {
  message: string
  name: string
}

interface AuthContextType {
  user: AppUser | null
  profile: AppProfile | null
  loading: boolean
  /** Zawsze true — konto lokalne w przeglądarce */
  isConfigured: boolean
  authMode: 'local'
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{
    error: AuthErrorLike | null
    needsEmailConfirmation?: boolean
    sessionCreated?: boolean
  }>
  signIn: (email: string, password: string) => Promise<{ error: AuthErrorLike | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: ProfileUpdate) => Promise<{ error: string | null }>
  updateProfileTheme: (theme: {
    theme_preset: string
    theme_custom_accent: string
    theme_mode: string
  }) => Promise<void>
  refreshProfile: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function toAppUser(record: LocalUserRecord): AppUser {
  return { id: record.id, email: record.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<LocalUserRecord | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(() => {
    const sessionId = getLocalSessionUserId()
    if (!sessionId) {
      setLocalUser(null)
      return
    }
    setLocalUser(getLocalUserById(sessionId))
  }, [])

  useEffect(() => {
    refreshProfile()
    setLoading(false)
  }, [refreshProfile])

  const user = localUser ? toAppUser(localUser) : null
  const profile = localUser ? localUserToProfile(localUser) : null

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const { user: created, error } = await localSignUp(email, password, displayName)
    if (error) return { error }
    if (created) setLocalUser(created)
    return { error: null, sessionCreated: true, needsEmailConfirmation: false }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { user: loggedIn, error } = await localSignIn(email, password)
    if (error) return { error }
    if (loggedIn) setLocalUser(loggedIn)
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    localSignOut()
    setLocalUser(null)
  }, [])

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!localUser) return { error: 'Musisz być zalogowany, aby edytować profil.' }
      const { user: updated, error } = localUpdateUser(localUser.id, {
        displayName:
          updates.display_name !== undefined && updates.display_name !== null
            ? updates.display_name.trim() || 'Użytkownik'
            : localUser.displayName,
        avatarUrl: updates.avatar_url !== undefined ? updates.avatar_url : localUser.avatarUrl,
      })
      if (error) return { error: error.message }
      if (updated) setLocalUser(updated)
      return { error: null }
    },
    [localUser],
  )

  const updateProfileTheme = useCallback(
    async (theme: { theme_preset: string; theme_custom_accent: string; theme_mode: string }) => {
      if (!localUser) return
      const { user: updated } = localUpdateUser(localUser.id, {
        themePreset: theme.theme_preset,
        themeCustomAccent: theme.theme_custom_accent,
        themeMode: theme.theme_mode,
      })
      if (updated) setLocalUser(updated)
    },
    [localUser],
  )

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isConfigured: true,
      authMode: 'local' as const,
      signUp,
      signIn,
      signOut,
      updateProfile,
      updateProfileTheme,
      refreshProfile,
    }),
    [user, profile, loading, signUp, signIn, signOut, updateProfile, updateProfileTheme, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useAuthOptional() {
  return useContext(AuthContext)
}
