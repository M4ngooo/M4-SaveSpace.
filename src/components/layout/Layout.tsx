import { Outlet } from 'react-router-dom'
import { Sidebar, MobileNav } from './Navigation'
import { ToastContainer } from '../ui/Toast'
import { SmartTipsWidget } from '../tips/SmartTipsWidget'
import { AnimatedBackground } from './AnimatedBackground'
import { FloatingParticles } from './FloatingParticles'

export function Layout() {
  return (
    <div className="relative flex min-h-screen bg-transparent transition-colors duration-300">
      <AnimatedBackground />
      <FloatingParticles />
      <Sidebar />
      <main className="relative z-10 flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <SmartTipsWidget />
          <Outlet />
        </div>
      </main>
      <MobileNav />
      <ToastContainer />
    </div>
  )
}
