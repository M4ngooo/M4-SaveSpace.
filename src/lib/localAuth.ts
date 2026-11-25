import { v4 as uuidv4 } from 'uuid'

const USERS_KEY = 'oszczednosci-local-users'
const SESSION_KEY = 'oszczednosci-local-session'

export interface LocalUserRecord {
  id: string
  email: string
  displayName: string
  passwordSalt: string
  passwordHash: string
  avatarUrl: string | null
  themePreset: string
  themeCustomAccent: string
  themeMode: string
  createdAt: string
}

export interface LocalAuthError {
  message: string
  name: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function loadUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw) as LocalUserRecord[]
  } catch {
    /* ignore */
  }
  return []
}

function saveUsers(users: LocalUserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getLocalSessionUserId(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { userId?: string }
    return parsed.userId ?? null
  } catch {
    return null
  }
}

function setLocalSession(userId: string | null) {
  if (!userId) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 120_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return Array.from(new Uint8Array(bits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function getLocalUserById(id: string): LocalUserRecord | null {
  return loadUsers().find(u => u.id === id) ?? null
}

export async function localSignUp(
  email: string,
  password: string,
  displayName: string,
): Promise<{ user: LocalUserRecord | null; error: LocalAuthError | null }> {
  const normalized = normalizeEmail(email)
  if (!normalized || !password || password.length < 6) {
    return { user: null, error: { message: 'Podaj poprawny e-mail i hasło (min. 6 znaków).', name: 'Validation' } }
  }
  if (!displayName.trim()) {
    return { user: null, error: { message: 'Podaj nazwę wyświetlaną.', name: 'Validation' } }
  }

  const users = loadUsers()
  if (users.some(u => u.email === normalized)) {
    return {
      user: null,
      error: { message: 'Ten adres e-mail jest już zarejestrowany na tym komputerze.', name: 'Duplicate' },
    }
  }

  const salt = uuidv4()
  const passwordHash = await hashPassword(password, salt)
  const user: LocalUserRecord = {
    id: uuidv4(),
    email: normalized,
    displayName: displayName.trim(),
    passwordSalt: salt,
    passwordHash,
    avatarUrl: null,
    themePreset: 'green',
    themeCustomAccent: '#22C55E',
    themeMode: 'dark',
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, user])
  setLocalSession(user.id)
  return { user, error: null }
}

export async function localSignIn(
  email: string,
  password: string,
): Promise<{ user: LocalUserRecord | null; error: LocalAuthError | null }> {
  const normalized = normalizeEmail(email)
  const users = loadUsers()
  const user = users.find(u => u.email === normalized)
  if (!user) {
    return { user: null, error: { message: 'Nieprawidłowy e-mail lub hasło.', name: 'Auth' } }
  }

  const hash = await hashPassword(password, user.passwordSalt)
  if (hash !== user.passwordHash) {
    return { user: null, error: { message: 'Nieprawidłowy e-mail lub hasło.', name: 'Auth' } }
  }

  setLocalSession(user.id)
  return { user, error: null }
}

export function localSignOut() {
  setLocalSession(null)
}

export function localUpdateUser(
  userId: string,
  updates: Partial<
    Pick<LocalUserRecord, 'displayName' | 'avatarUrl' | 'themePreset' | 'themeCustomAccent' | 'themeMode'>
  >,
): { user: LocalUserRecord | null; error: LocalAuthError | null } {
  const users = loadUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) {
    return { user: null, error: { message: 'Nie znaleziono użytkownika.', name: 'NotFound' } }
  }
  const updated: LocalUserRecord = { ...users[idx], ...updates }
  users[idx] = updated
  saveUsers(users)
  return { user: updated, error: null }
}

export function localUserToProfile(user: LocalUserRecord) {
  return {
    id: user.id,
    display_name: user.displayName,
    avatar_url: user.avatarUrl,
    theme_preset: user.themePreset,
    theme_custom_accent: user.themeCustomAccent,
    theme_mode: user.themeMode,
  }
}
