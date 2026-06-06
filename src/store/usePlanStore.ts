// src/store/usePlanStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserData, GoalData, PlanResult, AppStep } from '../lib/types'
import { calcSummary } from '../lib/tdee'
import { generateDailyMeals } from '../lib/meal-plan'
import { generateDayExercises, totalExerciseKcal } from '../lib/exercise-plan'

const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

interface PlanState {
  step: AppStep
  userData: Partial<UserData>
  goalData: Partial<GoalData>
  planResult: PlanResult | null

  setStep: (step: AppStep) => void
  setUserData: (data: Partial<UserData>) => void
  setGoalData: (data: Partial<GoalData>) => void
  generatePlan: () => void
  reset: () => void
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

      generatePlan: () => {
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
      },

      reset: () => set({ step: 'welcome', userData: {}, goalData: {}, planResult: null }),
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
