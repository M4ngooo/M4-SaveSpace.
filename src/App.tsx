import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuthOptional } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Dashboard } from './pages/Dashboard'
import { Goals } from './pages/Goals'
import { GoalDetails } from './pages/GoalDetails'
import { History } from './pages/History'
import { Statistics } from './pages/Statistics'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Account } from './pages/Account'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cele" element={<Goals />} />
          <Route path="/cele/:id" element={<GoalDetails />} />
          <Route path="/historia" element={<History />} />
          <Route path="/statystyki" element={<Statistics />} />
          <Route path="/ustawienia" element={<Settings />} />
          <Route path="/logowanie" element={<Login />} />
          <Route path="/rejestracja" element={<Register />} />
          <Route
            path="/konto"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function AppBoot() {
  const auth = useAuthOptional()
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    const minDelay = new Promise<void>(r => setTimeout(r, 900))
    const authReady = new Promise<void>(r => {
      if (!auth?.loading) {
        r()
        return
      }
      const id = setInterval(() => {
        if (!auth.loading) {
          clearInterval(id)
          r()
        }
      }, 50)
    })
    void Promise.all([minDelay, authReady]).then(() => setBootDone(true))
  }, [auth?.loading])

  return (
    <>
      <AnimatePresence mode="wait">{!bootDone && <LoadingScreen key="boot" />}</AnimatePresence>
      {bootDone && <AppRoutes />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <AppBoot />
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
