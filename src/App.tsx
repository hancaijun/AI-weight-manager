import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { usePlanStore } from './store/usePlanStore'
import { supabase, isSupabaseConfigured } from './lib/supabase'

export default function App() {
  const { user } = useAuth()
  const planResult = usePlanStore((s) => s.planResult)
  const setUserData = usePlanStore((s) => s.setUserData)
  const setGoalData = usePlanStore((s) => s.setGoalData)
  const setStep = usePlanStore((s) => s.setStep)

  // On login, load user data from Supabase in background
  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      void supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            if (profile.height) {
              setUserData({
                gender: profile.gender || 'male',
                height: profile.height,
                weight: profile.weight,
                age: profile.age,
              })
            }
            if (profile.target_weight) {
              setGoalData({
                targetWeight: profile.target_weight,
                weeks: profile.weeks || 8,
              })
            }
          }
        })

      void supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data: plans }) => {
          if (plans?.[0]?.plan_data && !planResult) {
            setStep('plan')
          }
        })
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
