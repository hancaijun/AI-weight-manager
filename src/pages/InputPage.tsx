import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlanStore } from '../store/usePlanStore'
import { calcBMI, getBMICategory } from '../lib/tdee'
import ProgressBar from '../components/ui/ProgressBar'
import type { UserData } from '../lib/types'

const STEPS = ['基本信息', '身体数据', '目标设定', '确认计划', '你的计划']

export default function InputPage() {
  const navigate = useNavigate()
  const { userData, setUserData, setStep } = usePlanStore()

  const [gender, setGender] = useState<'male' | 'female'>(userData.gender || 'male')
  const [height, setHeight] = useState(userData.height?.toString() || '')
  const [weight, setWeight] = useState(userData.weight?.toString() || '')
  const [age, setAge] = useState(userData.age?.toString() || '')

  const h = Number(height) || 0
  const w = Number(weight) || 0
  const bmi = h > 0 && w > 0 ? calcBMI(w, h) : null
  const bmiCat = bmi ? getBMICategory(bmi) : null

  const canNext = gender && Number(height) > 100 && Number(weight) > 30 && Number(age) > 10

  const handleNext = () => {
    const data: UserData = { gender, height: Number(height), weight: Number(weight), age: Number(age) }
    setUserData(data)
    setStep('goal')
    navigate('/goal')
  }

  return (
    <div className="px-4 pt-4">
      <ProgressBar current={0} total={4} labels={STEPS} />

      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-1">告诉我你的身体状况 👋</h2>
        <p className="text-sm text-slate-400 mb-6">这些数据帮你制定最合适的计划</p>

        {/* Gender selector */}
        <div className="mb-5">
          <label className="text-sm text-slate-600 mb-2 block">性别</label>
          <div className="flex gap-3">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-xl text-base font-medium transition-all ${
                  gender === g
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {g === 'male' ? '👨 男' : '👩 女'}
              </button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div className="mb-4">
          <label className="text-sm text-slate-600 mb-2 block">身高 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="例如 175"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            inputMode="numeric"
          />
        </div>

        {/* Weight */}
        <div className="mb-4">
          <label className="text-sm text-slate-600 mb-2 block">体重 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="例如 82"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            inputMode="decimal"
          />
        </div>

        {/* Age */}
        <div className="mb-6">
          <label className="text-sm text-slate-600 mb-2 block">年龄</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="例如 28"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            inputMode="numeric"
          />
        </div>

        {/* BMI display */}
        <AnimatePresence>
          {bmi !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-50 rounded-2xl p-4 text-center mb-6"
            >
              <p className="text-xs text-indigo-400 mb-1">你的 BMI</p>
              <motion.span
                className="text-4xl font-bold text-indigo-600"
                key={bmi}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {bmi}
              </motion.span>
              {bmiCat && (
                <p className={`text-sm mt-1 font-medium ${bmiCat.color}`}>
                  {bmiCat.category} · 正常范围 18.5 - 24
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={!canNext}
          className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all ${
            canNext
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
