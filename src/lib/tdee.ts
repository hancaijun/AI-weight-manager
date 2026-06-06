import type { UserData, GoalData, Macros } from './types'

/** BMI = weight / (height/100)² */
export function calcBMI(weight: number, height: number): number {
  const h = height / 100
  return +(weight / (h * h)).toFixed(1)
}

export function getBMICategory(bmi: number): { category: '偏瘦' | '正常' | '超重' | '肥胖'; color: string } {
  if (bmi < 18.5) return { category: '偏瘦', color: 'text-blue-500' }
  if (bmi < 24)   return { category: '正常', color: 'text-green-500' }
  if (bmi < 28)   return { category: '超重', color: 'text-amber-500' }
  return { category: '肥胖', color: 'text-red-500' }
}

/** BMR via Mifflin-St Jeor */
export function calcBMR(user: UserData): number {
  const base = 10 * user.weight + 6.25 * user.height - 5 * user.age
  return Math.round(user.gender === 'male' ? base + 5 : base - 161)
}

/** TDEE = BMR × activity multiplier (default sedentary 1.2) */
export function calcTDEE(bmr: number, multiplier: number = 1.2): number {
  return Math.round(bmr * multiplier)
}

/** Daily deficit needed to reach goal */
export function calcDeficit(currentWeight: number, targetWeight: number, weeks: number): number {
  const totalLoss = currentWeight - targetWeight
  if (totalLoss <= 0) return 0
  return Math.round((totalLoss * 7700) / (weeks * 7))
}

/** Macros in grams based on ratios: carbs 50%, protein 25%, fat 25% */
export function calcMacros(kcal: number): Macros {
  return {
    carbsG: Math.round((kcal * 0.50) / 4),
    proteinG: Math.round((kcal * 0.25) / 4),
    fatG: Math.round((kcal * 0.25) / 9),
  }
}

/** Safety checks */
export function getHealthWarning(
  _deficit: number, dailyKcal: number, gender: 'male' | 'female',
  weeklyLossKg: number, bmi: number
): string | null {
  if (bmi < 18.5) return '你的 BMI 属于偏瘦范围，不建议继续减重。建议先咨询医生或营养师。'
  if (dailyKcal < (gender === 'male' ? 1500 : 1200))
    return `每日摄入 ${dailyKcal} kcal 低于安全下限（${gender === 'male' ? '1500' : '1200'} kcal），这是不可持续的。请延长时间或调整目标。`
  if (weeklyLossKg > 1)
    return `每周减重 ${weeklyLossKg.toFixed(1)}kg 超过了安全上限 1kg/周。建议放慢节奏，保护身体。`
  return null
}

/** Check if plan is healthy */
export function isHealthy(
  dailyKcal: number, gender: 'male' | 'female', weeklyLossKg: number, bmi: number
): boolean {
  const floor = gender === 'male' ? 1500 : 1200
  return dailyKcal >= floor && weeklyLossKg <= 1 && bmi >= 18.5
}

/** Summary stats for display */
export function calcSummary(user: UserData, goal: GoalData): {
  bmi: number; bmiCategory: '偏瘦' | '正常' | '超重' | '肥胖'; bmiColor: string
  bmr: number; tdee: number; deficit: number
  targetKcal: number; macros: Macros
  weeklyLossKg: number; isHealthyPace: boolean; healthWarning: string | null
} {
  const bmi = calcBMI(user.weight, user.height)
  const { category, color } = getBMICategory(bmi)
  const bmr = calcBMR(user)
  const tdee = calcTDEE(bmr)
  const deficit = calcDeficit(user.weight, goal.targetWeight, goal.weeks)
  const targetKcal = Math.max(tdee - deficit, user.gender === 'male' ? 1500 : 1200)
  const macros = calcMacros(targetKcal)
  const weeklyLossKg = (user.weight - goal.targetWeight) / goal.weeks
  const isHealthyPace = isHealthy(targetKcal, user.gender, weeklyLossKg, bmi)
  const healthWarning = getHealthWarning(deficit, targetKcal, user.gender, weeklyLossKg, bmi)

  return { bmi, bmiCategory: category, bmiColor: color, bmr, tdee, deficit, targetKcal, macros, weeklyLossKg, isHealthyPace, healthWarning }
}
