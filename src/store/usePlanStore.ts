// src/store/usePlanStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserData, GoalData, PlanResult, AppStep } from '../lib/types'
import { calcSummary } from '../lib/tdee'
import { generateDailyMeals } from '../lib/meal-plan'
import { generateDayExercises, totalExerciseKcal } from '../lib/exercise-plan'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

/** Upsert user profile to Supabase. Returns error message or null. */
async function upsertProfile(
  userId: string,
  email: string | undefined,
  userData: Partial<UserData>,
  goalData: Partial<GoalData>,
) {
  const u = userData as UserData
  const g = goalData as GoalData
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    email: email ?? null,
    gender: u.gender || null,
    height: u.height || null,
    weight: u.weight || null,
    age: u.age || null,
    target_weight: g.targetWeight || null,
    weeks: g.weeks || null,
    updated_at: new Date().toISOString(),
  })
  return error?.message ?? null
}

interface PlanState {
  step: AppStep
  userData: Partial<UserData>
  goalData: Partial<GoalData>
  planResult: PlanResult | null

  setStep: (step: AppStep) => void
  setUserData: (data: Partial<UserData>) => void
  setGoalData: (data: Partial<GoalData>) => void
  generatePlan: () => Promise<void>
  reset: () => void
  setPlanResult: (planResult: PlanResult) => void
  syncToCloud: () => Promise<{ error: string | null }>
  loadFromCloud: () => Promise<boolean>
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      step: 'welcome',
      userData: {},
      goalData: {},
      planResult: null,

      setStep: (step) => set({ step }),

      setUserData: (data) => set((s) => ({ userData: { ...s.userData, ...data } })),

      setGoalData: (data) => set((s) => ({ goalData: { ...s.goalData, ...data } })),

      generatePlan: async () => {
        const { userData, goalData } = get()
        const user = userData as UserData
        const goal = goalData as GoalData

        const summary = calcSummary(user, goal)

        const weeklyPlan = summary.isHealthyPace
          ? Array.from({ length: 7 }, (_, i) => {
              const meals = generateDailyMeals(summary.targetKcal)
              const exercises = generateDayExercises(i, user.weight)
              const totalMealKcal = meals.reduce((s, m) => s + m.items.reduce((ss, it) => ss + it.kcal, 0), 0)
              return {
                dayIndex: i,
                dayLabel: DAY_LABELS[i],
                dateLabel: `第${i + 1}天`,
                meals,
                exercises,
                totalMealKcal,
                totalExerciseKcal: totalExerciseKcal(exercises),
                isRestDay: i === 6,
              }
            })
          : []

        set({
          step: 'plan',
          planResult: {
            bmi: summary.bmi,
            bmiCategory: summary.bmiCategory,
            bmiColor: summary.bmiColor,
            tdee: summary.tdee,
            targetKcal: summary.targetKcal,
            deficit: summary.deficit,
            macros: summary.macros,
            weeklyPlan,
            isHealthyPace: summary.isHealthyPace,
            healthWarning: summary.healthWarning,
          },
        })

        // Sync to cloud — await so we know it succeeded
        if (isSupabaseConfigured()) {
          try {
            const { data: authData } = await supabase.auth.getUser()
            if (authData.user) {
              const profileErr = await upsertProfile(authData.user.id, authData.user.email, userData, goalData)
              if (profileErr) {
                console.error('Cloud sync: profile failed:', profileErr)
              }
              const { planResult } = get()
              if (planResult) {
                const { error: planError } = await supabase.from('plans').insert({
                  user_id: authData.user.id,
                  plan_data: planResult,
                  created_at: new Date().toISOString(),
                })
                if (planError) {
                  console.error('Cloud sync: plan insert failed:', planError.message)
                } else {
                  console.log('Cloud sync: plan saved OK')
                }
              }
            }
          } catch (e) {
            console.error('Cloud sync: unexpected error:', e)
          }
        }
      },

      reset: () => set({ step: 'welcome', userData: {}, goalData: {}, planResult: null }),

      setPlanResult: (planResult) => set({ step: 'plan', planResult }),

      syncToCloud: async () => {
        if (!isSupabaseConfigured()) return { error: 'Supabase 未配置' }
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: '未登录' }

        const { userData, goalData, planResult } = get()

        const profileErr = await upsertProfile(user.id, user.email, userData, goalData)
        if (profileErr) return { error: profileErr }

        if (planResult) {
          const { error: planError } = await supabase.from('plans').insert({
            user_id: user.id,
            plan_data: planResult,
            created_at: new Date().toISOString(),
          })
          if (planError) return { error: planError.message }
        }

        return { error: null }
      },

      loadFromCloud: async () => {
        if (!isSupabaseConfigured()) {
          console.warn('loadFromCloud: Supabase not configured')
          return false
        }
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.warn('loadFromCloud: no authenticated user')
          return false
        }

        // Load profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.warn('loadFromCloud: profile fetch error:', profileError.message)
        }

        if (profile) {
          if (profile.height) {
            set({
              userData: {
                gender: profile.gender || 'male',
                height: profile.height,
                weight: profile.weight,
                age: profile.age,
              },
            })
          }
          if (profile.target_weight) {
            set({
              goalData: {
                targetWeight: profile.target_weight,
                weeks: profile.weeks || 8,
              },
            })
          }
          console.log('loadFromCloud: profile restored OK')
        } else {
          console.log('loadFromCloud: no profile found for user')
        }

        // Load latest plan
        const { data: plans, error: plansError } = await supabase
          .from('plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (plansError) {
          console.warn('loadFromCloud: plans fetch error:', plansError.message)
        }

        if (plans?.[0]?.plan_data) {
          set({ step: 'plan', planResult: plans[0].plan_data as PlanResult })
          console.log('loadFromCloud: plan restored OK')
        } else {
          console.log('loadFromCloud: no plan found for user')
        }

        return true
      },
    }),
    {
      name: 'weight-manager-plan',
      partialize: (state) => ({
        step: state.step,
        userData: state.userData,
        goalData: state.goalData,
        planResult: state.planResult,
      }),
    }
  )
)
