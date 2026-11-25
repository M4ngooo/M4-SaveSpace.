export function SupabaseSetupHint() {
  return (
    <div className="max-w-md mx-auto glass-panel rounded-2xl border border-warning/30 bg-warning/5 p-6 sm:p-8">
      <h1 className="text-xl font-bold text-text">Rejestracja niedostępna</h1>
      <p className="text-text-secondary text-sm mt-2 leading-relaxed">
        Aplikacja nie widzi kluczy Supabase. Cele działają lokalnie, ale konto w chmurze wymaga konfiguracji.
      </p>
      <ol className="mt-4 space-y-2 text-sm text-text-secondary list-decimal list-inside">
        <li>Skopiuj plik <code className="text-accent">.env.example</code> jako <code className="text-accent">.env</code> w folderze projektu.</li>
        <li>Wklej <strong className="text-text">VITE_SUPABASE_URL</strong> i <strong className="text-text">VITE_SUPABASE_ANON_KEY</strong> z panelu Supabase (Settings → API).</li>
        <li>W Supabase uruchom SQL z pliku <code className="text-accent">supabase/schema.sql</code>.</li>
        <li>Zatrzymaj i ponownie uruchom serwer (<code className="text-accent">npm run dev</code> lub <code className="text-accent">start.ps1</code>).</li>
      </ol>
      <p className="text-xs text-text-muted mt-4">
        Po restarcie odśwież stronę — formularz rejestracji pojawi się automatycznie.
      </p>
    </div>
  )
}
