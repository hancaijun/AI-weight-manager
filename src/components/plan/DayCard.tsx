import type { DayPlan } from '../../lib/types'
import Card from '../ui/Card'
import MacroBar from './MacroBar'
import MealSection from './MealSection'
import ExerciseSection from './ExerciseSection'
import { usePlanStore } from '../../store/usePlanStore'

interface Props { day: DayPlan }

export default function DayCard({ day }: Props) {
  const macros = usePlanStore((s) => s.planResult?.macros)

  return (
    <Card className="min-w-[calc(100vw-48px)] max-w-[calc(100vw-48px)] mx-2 snap-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-semibold text-slate-800">{day.dayLabel}</span>
          <span className="text-xs text-slate-400 ml-2">{day.dateLabel}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-indigo-600">{day.totalMealKcal}</span>
          <span className="text-xs text-slate-400 ml-1">kcal</span>
        </div>
      </div>

      {/* Macro bar */}
      {macros && <div className="mb-3"><MacroBar macros={macros} totalKcal={day.totalMealKcal} /></div>}

      {/* Meals */}
      <div className="mb-1">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">🍽️ 饮食</h4>
        {day.meals.map((meal) => (
          <MealSection key={meal.type} meal={meal} />
        ))}
      </div>

      {/* Exercise */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">🏃 运动</h4>
        <ExerciseSection exercises={day.exercises} />
        {day.totalExerciseKcal > 0 && (
          <p className="text-xs text-slate-400 mt-2">预计消耗 {day.totalExerciseKcal} kcal</p>
        )}
      </div>
    </Card>
  )
}
