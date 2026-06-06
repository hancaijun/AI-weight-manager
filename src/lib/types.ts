export interface UserData {
  height: number       // cm
  weight: number       // kg
  age: number
  gender: 'male' | 'female'
}

export interface GoalData {
  targetWeight: number // kg
  weeks: number
}

export interface Macros {
  carbsG: number
  proteinG: number
  fatG: number
}

export interface MealItem {
  name: string
  grams: number
  kcal: number
  carbs: number
  protein: number
  fat: number
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  label: string       // 早餐/午餐/晚餐/加餐
  kcalTarget: number
  percent: number      // 热量占比
  items: MealItem[]
}

export interface Exercise {
  name: string
  emoji: string
  durationMin: number
  intensity: '低' | '中等' | '高'
  met: number
  kcalBurned: number
  description: string
}

export interface DayPlan {
  dayIndex: number     // 0-6
  dayLabel: string     // 周一
  dateLabel: string    // 第1天
  meals: Meal[]
  exercises: Exercise[]
  totalMealKcal: number
  totalExerciseKcal: number
  isRestDay: boolean
}

export interface PlanResult {
  bmi: number
  bmiCategory: '偏瘦' | '正常' | '超重' | '肥胖'
  bmiColor: string      // tailwind color class
  tdee: number
  targetKcal: number
  deficit: number
  macros: Macros
  weeklyPlan: DayPlan[]
  isHealthyPace: boolean
  healthWarning: string | null
}

export type AppStep = 'welcome' | 'input' | 'goal' | 'summary' | 'plan'
