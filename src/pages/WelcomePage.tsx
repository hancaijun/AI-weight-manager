import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlanStore } from '../store/usePlanStore'

export default function WelcomePage() {
  const navigate = useNavigate()
  const setStep = usePlanStore((s) => s.setStep)

  const handleStart = () => {
    setStep('input')
    navigate('/input')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="text-7xl mb-6"
      >
        ⚖️
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-bold text-slate-800 mb-3"
      >
        和你一起，健康地变轻
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-slate-500 mb-2 leading-relaxed"
      >
        减重不是挨饿，是学会和食物做朋友。
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-slate-400 text-sm mb-10"
      >
        输入你的数据，我们将为你定制一份科学、可持续的每周计划。
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        onClick={handleStart}
        className="w-full max-w-xs bg-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
      >
        开始定制计划 →
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs text-slate-400 mt-6"
      >
        🧑‍⚕️ 基于 Mifflin-St Jeor 科学公式 · 数据仅保存在你的设备上
      </motion.p>
    </div>
  )
}
