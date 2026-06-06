// src/lib/exercise-plan.ts
import type { Exercise } from './types'

const CARDIO_EXERCISES: { name: string; emoji: string; met: number; intensity: '低' | '中等' | '较高' | '高'; description: string }[] = [
  { name: '快走',   emoji: '🚶', met: 4.3, intensity: '中等', description: '保持 5-6 km/h 的速度，摆臂自然' },
  { name: '慢跑',   emoji: '🏃', met: 7.0, intensity: '较高', description: '心率保持在 130-150 bpm，能说话但不能唱歌' },
  { name: '跳绳',   emoji: '🪢', met: 11.0, intensity: '高', description: '每组 2 分钟，组间休息 30 秒' },
  { name: '游泳',   emoji: '🏊', met: 6.0, intensity: '中等', description: '蛙泳或自由泳，持续游动不休息' },
  { name: '骑行',   emoji: '🚴', met: 8.0, intensity: '较高', description: '保持 20-25 km/h 的巡航速度' },
  { name: '椭圆机', emoji: '🏋️', met: 5.0, intensity: '中等', description: '阻力和速度结合，保持心率稳定' },
]

const STRENGTH_EXERCISES: { name: string; emoji: string; met: number; intensity: '低' | '中等' | '较高' | '高'; description: string }[] = [
  { name: '深蹲',     emoji: '🦵', met: 5.0, intensity: '中等', description: '双脚与肩同宽，膝盖不超脚尖，3 组 × 15 次' },
  { name: '俯卧撑',   emoji: '💪', met: 3.8, intensity: '中等', description: '宽距或窄距，3 组 × 力竭' },
  { name: '平板支撑', emoji: '🧘', met: 3.0, intensity: '低', description: '核心收紧，3 组 × 30-60 秒' },
  { name: '卷腹',     emoji: '🏋️', met: 2.8, intensity: '低', description: '上背部离地，腰部贴紧地面，3 组 × 20 次' },
  { name: '箭步蹲',   emoji: '🦿', met: 4.5, intensity: '中等', description: '左右交替，3 组 × 12 次/侧' },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function calcKcal(met: number, weight: number, minutes: number): number {
  return Math.round(met * weight * (minutes / 60))
}

/**
 * Generate exercise plan for one day.
 * Pattern: Mon/Thu=cardio, Tue/Fri=strength, Wed=cardio, Sat=cardio+strength, Sun=rest
 */
export function generateDayExercises(dayIndex: number, weight: number): Exercise[] {
  // Sunday (day 6) = rest
  if (dayIndex === 6) return []

  const isCardio = [0, 2, 3, 5].includes(dayIndex)   // Mon, Wed, Thu, Sat
  const isStrength = [1, 4, 5].includes(dayIndex)     // Tue, Fri, Sat

  const exercises: Exercise[] = []

  if (isCardio) {
    const ex = pick(CARDIO_EXERCISES)
    const min = dayIndex === 5 ? 30 : 45  // Saturday: shorter cardio with strength
    exercises.push({
      name: ex.name, emoji: ex.emoji, durationMin: min,
      intensity: ex.intensity, met: ex.met,
      kcalBurned: calcKcal(ex.met, weight, min),
      description: ex.description,
    })
  }

  if (isStrength) {
    for (let i = 0; i < 2; i++) {
      const ex = pick(STRENGTH_EXERCISES)
      exercises.push({
        name: ex.name, emoji: ex.emoji, durationMin: 15,
        intensity: ex.intensity, met: ex.met,
        kcalBurned: calcKcal(ex.met, weight, 15),
        description: ex.description,
      })
    }
  }

  return exercises
}

/** Total exercise calories for a list */
export function totalExerciseKcal(exercises: Exercise[]): number {
  return exercises.reduce((s, e) => s + e.kcalBurned, 0)
}
