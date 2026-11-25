/** Mapuje komunikaty Supabase Auth na polski. */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Nieprawidłowy e-mail lub hasło.'
  if (m.includes('email not confirmed')) return 'Potwierdź adres e-mail — sprawdź skrzynkę (także spam).'
  if (m.includes('user already registered')) return 'Ten adres e-mail jest już zarejestrowany.'
  if (m.includes('password should be at least')) return 'Hasło jest za krótkie (minimum 6 znaków).'
  if (m.includes('unable to validate email')) return 'Nieprawidłowy adres e-mail.'
  if (m.includes('signup is disabled')) return 'Rejestracja jest wyłączona w panelu Supabase.'
  if (m.includes('email rate limit') || m.includes('rate limit')) {
    return 'Zbyt wiele prób — odczekaj chwilę i spróbuj ponownie.'
  }
  if (m.includes('failed to fetch') || m.includes('network')) {
    return 'Brak połączenia z Supabase. Sprawdź URL w pliku .env i połączenie z internetem.'
  }
  if (m.includes('supabase nie jest skonfigurowane')) return message
  return message
}
