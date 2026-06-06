import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlanStore } from '../store/usePlanStore'
import BottomNav from '../components/ui/BottomNav'
import DayCard from '../components/plan/DayCard'

export default function PlanPage() {
  const navigate = useNavigate()
  const planResult = usePlanStore((s) => s.planResult)
  const reset = usePlanStore((s) => s.reset)
  const [activeDay, setActiveDay] = useState(0)

  if (!planResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">还没有计划</h2>
        <p className="text-sm text-slate-400 mb-6">先输入你的身体数据，生成个性化计划吧</p>
        <button
          onClick={() => navigate('/input')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold"
        >
          开始 →
        </button>
        <div className="mt-8"><BottomNav /></div>
      </div>
    )
  }

  const { weeklyPlan, targetKcal, deficit, isHealthyPace } = planResult

  return (
    <div className="pb-20">
      {/* Header gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 pt-8 pb-5 rounded-b-3xl"
      >
        <p className="text-xs text-indigo-200 mb-1">📅 本周计划</p>
        <h1 className="text-xl font-bold mb-3">目标体重的健康之旅 💪</h1>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold">{targetKcal}</div>
            <div className="text-[10px] text-indigo-200">kcal/天</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold">{deficit}</div>
            <div className="text-[10px] text-indigo-200">缺口/天</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold">7</div>
            <div className="text-[10px] text-indigo-200">天计划</div>
          </div>
        </div>
        {!isHealthyPace && (
          <p className="text-xs text-amber-300 mt-2 text-center">⚠️ 减重速度偏快，建议调整目标</p>
        )}
      </motion.div>

      {/* Day tabs */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-slate-100 p-1 overflow-x-auto no-scrollbar">
          {weeklyPlan.map((day) => (
            <button
              key={day.dayIndex}
              onClick={() => setActiveDay(day.dayIndex)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeDay === day.dayIndex
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {day.dayLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Day content */}
      <div className="mt-4">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DayCard day={weeklyPlan[activeDay]} />
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-4 space-y-2">
        <button
          onClick={reset}
          className="w-full py-3 rounded-xl text-sm text-slate-500 font-medium border border-slate-200"
        >
          🔄 重新制定计划
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
