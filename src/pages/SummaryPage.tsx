import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlanStore } from '../store/usePlanStore'
import { calcSummary } from '../lib/tdee'
import ProgressBar from '../components/ui/ProgressBar'
import Card from '../components/ui/Card'

const STEPS = ['基本信息', '身体数据', '目标设定', '确认计划', '你的计划']

export default function SummaryPage() {
  const navigate = useNavigate()
  const { userData, goalData, generatePlan, setStep } = usePlanStore()
  const user = userData as Required<typeof userData>
  const goal = goalData as Required<typeof goalData>

  const s = calcSummary(user, goal)

  const handleBack = () => {
    setStep('goal')
    navigate(-1)
  }

  const handleGenerate = () => {
    generatePlan()
    navigate('/plan')
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-1 mb-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 active:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
          aria-label="返回"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16L6 10L12 4" />
          </svg>
        </button>
        <div className="flex-1">
          <ProgressBar current={2} total={4} labels={STEPS} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-1">📊 你的身体分析</h2>
        <p className="text-sm text-slate-400 mb-5">基于科学公式，这是你的个性化数据</p>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card className="text-center !p-3" delay={0.1}>
            <div className="text-2xl font-bold text-indigo-600">{s.bmi}</div>
            <div className="text-xs text-slate-500 mt-1">BMI</div>
            <span className={`text-[10px] font-medium ${s.bmiColor}`}>{s.bmiCategory}</span>
          </Card>
          <Card className="text-center !p-3" delay={0.2}>
            <div className="text-2xl font-bold text-green-600">{s.tdee}</div>
            <div className="text-xs text-slate-500 mt-1">每日消耗</div>
            <span className="text-[10px] text-slate-400">TDEE kcal</span>
          </Card>
          <Card className="text-center !p-3" delay={0.3}>
            <div className="text-2xl font-bold text-rose-500">-{s.deficit}</div>
            <div className="text-xs text-slate-500 mt-1">热量缺口</div>
            <span className="text-[10px] text-slate-400">每日 kcal</span>
          </Card>
        </div>

        {/* Detail breakdown */}
        <Card className="mb-4" delay={0.4}>
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">📋 计划详情</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">当前体重</span>
              <span className="font-semibold">{user.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">目标体重</span>
              <span className="font-semibold">{goal.targetWeight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">需要减重</span>
              <span className="font-semibold text-indigo-600">{(user.weight - goal.targetWeight).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">预计时间</span>
              <span className="font-semibold text-green-600">{goal.weeks} 周</span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between">
              <span className="text-slate-500">每日摄入目标</span>
              <span className="font-semibold text-indigo-600 text-lg">{s.targetKcal} kcal</span>
            </div>
            <div className="flex gap-2 text-xs text-slate-400">
              <span>碳水 {s.macros.carbsG}g</span>
              <span>·</span>
              <span>蛋白 {s.macros.proteinG}g</span>
              <span>·</span>
              <span>脂肪 {s.macros.fatG}g</span>
            </div>
          </div>
        </Card>

        {/* Health verdict */}
        {s.isHealthyPace ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center mb-6">
            <p className="text-green-600 font-semibold">✅ 计划健康可行</p>
            <p className="text-green-500 text-sm mt-1">每周减重 {s.weeklyLossKg.toFixed(1)}kg，在安全范围内</p>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center mb-6">
            <p className="text-amber-600 font-semibold">⚠️ 需要调整</p>
            <p className="text-amber-500 text-sm mt-1">{s.healthWarning}</p>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl text-lg font-semibold bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        >
          🚀 生成我的周计划
        </motion.button>
      </motion.div>
    </div>
  )
}
