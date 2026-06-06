import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Meal } from '../../lib/types'

interface Props { meal: Meal }

export default function MealSection({ meal }: Props) {
  const [open, setOpen] = useState(false)
  const totalKcal = meal.items.reduce((s, i) => s + i.kcal, 0)

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm">
          <span className="mr-2">
            {meal.type === 'breakfast' ? '🥣' : meal.type === 'lunch' ? '🍱' : meal.type === 'dinner' ? '🌙' : '🍎'}
          </span>
          <span className="font-medium text-slate-700">{meal.label}</span>
        </span>
        <span className="text-sm text-slate-400">
          {totalKcal} kcal <span className="text-xs ml-1">{Math.round(meal.percent * 100)}%</span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-8 space-y-1.5">
              {meal.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-slate-500">
                  <span>{item.name} · {item.grams}g</span>
                  <span className="font-medium text-slate-600">{item.kcal} kcal</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
