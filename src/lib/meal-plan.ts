// src/lib/meal-plan.ts
import type { Meal, MealItem } from './types'
import { FOOD_DB, type FoodItem } from './foods'

const MEAL_CONFIG: { type: Meal['type']; label: string; percent: number }[] = [
  { type: 'breakfast', label: '早餐', percent: 0.30 },
  { type: 'lunch',     label: '午餐', percent: 0.35 },
  { type: 'dinner',    label: '晚餐', percent: 0.25 },
  { type: 'snack',     label: '加餐', percent: 0.10 },
]

/** Round to nearest 10 for readability */
function r10(n: number): number {
  return Math.round(n / 10) * 10
}

/** Select food items matching a category, returning reasonable grams */
function pickFood(category: FoodItem['category'], targetKcal: number): MealItem {
  const pool = FOOD_DB.filter(f => f.category === category)
  const food = pool[Math.floor(Math.random() * pool.length)]
  if (!food) {
    // fallback to any food
    const f = FOOD_DB[0]
    const grams = Math.round((targetKcal / f.kcalPer100g) * 100)
    return { name: f.name, grams, kcal: r10(targetKcal), carbs: Math.round(f.carbsPer100g * grams / 100), protein: Math.round(f.proteinPer100g * grams / 100), fat: Math.round(f.fatPer100g * grams / 100) }
  }
  const grams = Math.max(30, Math.round((targetKcal / food.kcalPer100g) * 100))
  return {
    name: food.name,
    grams,
    kcal: r10(Math.round(food.kcalPer100g * grams / 100)),
    carbs: Math.round(food.carbsPer100g * grams / 100),
    protein: Math.round(food.proteinPer100g * grams / 100),
    fat: Math.round(food.fatPer100g * grams / 100),
  }
}

/** Generate one meal from scratch */
function generateMeal(type: Meal['type'], label: string, percent: number, dailyKcal: number): Meal {
  const kcalTarget = Math.round(dailyKcal * percent)

  const items: MealItem[] = []
  switch (type) {
    case 'breakfast':
      items.push(pickFood('staple', kcalTarget * 0.5))
      items.push(pickFood('dairy', kcalTarget * 0.3))
      items.push(pickFood('fruit', kcalTarget * 0.2))
      break
    case 'lunch':
      items.push(pickFood('staple', kcalTarget * 0.35))
      items.push(pickFood('protein', kcalTarget * 0.45))
      items.push(pickFood('vegetable', kcalTarget * 0.2))
      break
    case 'dinner':
      items.push(pickFood('staple', kcalTarget * 0.25))
      items.push(pickFood('protein', kcalTarget * 0.5))
      items.push(pickFood('vegetable', kcalTarget * 0.25))
      break
    case 'snack':
      items.push(pickFood('fruit', kcalTarget * 0.5))
      items.push(pickFood('snack', kcalTarget * 0.5))
      break
  }

  return { type, label, kcalTarget, percent, items }
}

/** Generate all 4 meals for a day */
export function generateDailyMeals(dailyKcal: number): Meal[] {
  return MEAL_CONFIG.map(({ type, label, percent }) => generateMeal(type, label, percent, dailyKcal))
}

/** Total kcal from all meals */
export function totalMealKcal(meals: Meal[]): number {
  return meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.kcal, 0), 0)
}
