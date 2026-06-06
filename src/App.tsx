import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { usePlanStore } from './store/usePlanStore'

export default function App() {
  const { user } = useAuth()

  // On login, load user data from Supabase
  useEffect(() => {
    if (user) {
      void usePlanStore.getState().loadFromCloud()
    }
  }, [user?.id])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto min-h-screen relative pb-16">
        <Outlet />
      </div>
    </div>
  )
}
