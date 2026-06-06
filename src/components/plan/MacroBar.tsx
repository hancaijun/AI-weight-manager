import type { Macros } from '../../lib/types'

interface Props { macros: Macros }

export default function MacroBar({ macros }: Props) {
  const carbKcal = macros.carbsG * 4
  const proteinKcal = macros.proteinG * 4
  const fatKcal = macros.fatG * 9
  const total = carbKcal + proteinKcal + fatKcal

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 mb-2">
        <div className="bg-amber-400" style={{ width: `${(carbKcal/total)*100}%` }} />
        <div className="bg-rose-400" style={{ width: `${(proteinKcal/total)*100}%` }} />
        <div className="bg-emerald-400" style={{ width: `${(fatKcal/total)*100}%` }} />
      </div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>🟡 碳水 {macros.carbsG}g</span>
        <span>🔴 蛋白 {macros.proteinG}g</span>
        <span>🟢 脂肪 {macros.fatG}g</span>
      </div>
    </div>
  )
}
