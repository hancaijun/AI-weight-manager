import { useNavigate } from 'react-router-dom'
import { usePlanStore } from '../store/usePlanStore'
import BottomNav from '../components/ui/BottomNav'
import Card from '../components/ui/Card'

export default function TrackerPage() {
  const navigate = useNavigate()
  const planResult = usePlanStore((s) => s.planResult)

  return (
    <div className="px-4 pt-8 pb-20">
      <h1 className="text-xl font-bold text-slate-800 mb-6">👤 我的</h1>

      {planResult ? (
        <Card>
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🏗️</div>
            <h3 className="font-semibold text-slate-700 mb-1">打卡追踪即将上线</h3>
            <p className="text-sm text-slate-400">每日体重记录、饮食完成度、运动打卡将在下一版本推出</p>
          </div>
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">BMI</span>
              <span className="font-semibold">{planResult.bmi}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">分类</span>
              <span className={`font-semibold ${planResult.bmiColor}`}>{planResult.bmiCategory}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">每日目标</span>
              <span className="font-semibold text-indigo-600">{planResult.targetKcal} kcal</span>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-3">⚖️</div>
            <p className="text-slate-400 text-sm">还没有制定计划</p>
            <button
              onClick={() => navigate('/input')}
              className="mt-4 text-indigo-600 font-semibold text-sm"
            >
              去制定计划 →
            </button>
          </div>
        </Card>
      )}

      <div className="mt-6">
        <Card>
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">💡 健康小贴士</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>· 每天喝 2L 水，有助于代谢</li>
            <li>· 保证 7-8 小时睡眠，减少压力激素</li>
            <li>· 饭前喝一杯水，有助控制食量</li>
            <li>· 记录饮食 3 天就能发现自己不知道的习惯</li>
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
