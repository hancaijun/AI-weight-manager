import { motion } from 'framer-motion'

interface Props {
  current: number   // 0-indexed current step
  total: number
  labels: string[]
}

export default function ProgressBar({ current, total, labels }: Props) {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-1 mb-1">
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full flex-1"
            animate={{ backgroundColor: i <= current ? '#6366f1' : '#e2e8f0' }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-slate-500">{labels[current]}</span>
        <span className="text-xs text-slate-400">{current + 1}/{total}</span>
      </div>
    </div>
  )
}
