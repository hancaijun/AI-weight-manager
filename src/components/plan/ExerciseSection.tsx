import type { Exercise } from '../../lib/types'

interface Props { exercises: Exercise[] }

export default function ExerciseSection({ exercises }: Props) {
  if (exercises.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-slate-400">
        🛌 休息日 — 让身体恢复，可以做些轻度拉伸
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {exercises.map((ex, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">
            {ex.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-slate-700">{ex.name}</div>
            <div className="text-xs text-slate-400">{ex.durationMin} 分钟 · {ex.intensity}强度</div>
          </div>
          <div className="text-sm font-semibold text-emerald-600">~{ex.kcalBurned} kcal</div>
        </div>
      ))}
    </div>
  )
}
