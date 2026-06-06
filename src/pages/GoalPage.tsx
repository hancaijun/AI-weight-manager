import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlanStore } from '../store/usePlanStore'
import ProgressBar from '../components/ui/ProgressBar'
import SliderInput from '../components/ui/SliderInput'

const STEPS = ['基本信息', '身体数据', '目标设定', '确认计划', '你的计划']

export default function GoalPage() {
  const navigate = useNavigate()
  const { userData, goalData, setGoalData, setStep } = usePlanStore()
  const currentWeight = userData.weight || 70

  const [targetWeight, setTargetWeight] = useState(goalData.targetWeight || Math.round(currentWeight * 0.9))
  const [weeks, setWeeks] = useState(goalData.weeks || 8)

  const loss = currentWeight - targetWeight
  const weeklyLoss = weeks > 0 ? +(loss / weeks).toFixed(1) : 0
  const isHealthy = weeklyLoss <= 1 && weeklyLoss >= 0.25

  const handleBack = () => {
    setStep('input')
    navigate(-1)
  }

  const handleNext = () => {
    setGoalData({ targetWeight, weeks })
    setStep('summary')
    navigate('/summary')
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
          <ProgressBar current={1} total={4} labels={STEPS} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-1">你的目标是什么？🎯</h2>
        <p className="text-sm text-slate-400 mb-6">设定一个科学、可持续的目标</p>

        <SliderInput
          label="目标体重"
          value={targetWeight}
          min={Math.max(40, Math.round(currentWeight * 0.6))}
          max={currentWeight - 1}
          step={1}
          unit="kg"
          onChange={setTargetWeight}
        />

        <SliderInput
          label="期望时间"
          value={weeks}
          min={2}
          max={52}
          step={1}
          unit="周"
          onChange={setWeeks}
          hint={`约 ${Math.round(weeks / 4)} 个月`}
        />

        {/* Pace feedback */}
        <div className={`rounded-2xl p-4 mb-6 ${
          isHealthy ? 'bg-green-50 border border-green-200' :
          weeklyLoss > 1 ? 'bg-amber-50 border border-amber-200' :
          'bg-slate-50 border border-slate-200'
        }`}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-slate-600">预计每周减重</span>
            <motion.span
              key={weeklyLoss}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className={`text-2xl font-bold ${
                isHealthy ? 'text-green-600' :
                weeklyLoss > 1 ? 'text-amber-600' : 'text-slate-600'
              }`}
            >
              {weeklyLoss} <span className="text-base font-normal">kg</span>
            </motion.span>
          </div>
          <div className="text-xs">
            {isHealthy && <span className="text-green-600">✅ 速度健康，每周 0.25-1kg 是科学建议范围</span>}
            {weeklyLoss > 1 && <span className="text-amber-600">⚠️ 速度偏快，建议适当延长时间或提高目标体重</span>}
            {weeklyLoss < 0.25 && loss > 0 && <span className="text-slate-500">🐢 节奏很温和，细水长流</span>}
            {loss <= 0 && <span className="text-slate-500">目标体重需要低于当前体重才能减重哦~</span>}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={loss <= 0}
          className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all ${
            loss > 0
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          下一步 →
        </motion.button>
      </motion.div>
    </div>
  )
}
