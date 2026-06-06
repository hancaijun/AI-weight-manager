import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlanStore } from '../store/usePlanStore'
import { useAuth } from '../hooks/useAuth'
import BottomNav from '../components/ui/BottomNav'
import Card from '../components/ui/Card'

export default function TrackerPage() {
  const navigate = useNavigate()
  const planResult = usePlanStore((s) => s.planResult)
  const reset = usePlanStore((s) => s.reset)
  const { user, signOut, isConfigured } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOut()
    reset()
    setLoggingOut(false)
    navigate('/')
  }

  return (
    <div className="px-4 pt-8 pb-20">
      <h1 className="text-xl font-bold text-slate-800 mb-6">👤 我的</h1>

      {/* Auth section */}
      <Card className="mb-4">
        {user ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  已登录 · 数据云端同步
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-2.5 rounded-xl text-sm text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {loggingOut ? '退出中...' : '退出登录'}
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-sm text-slate-500 mb-3">登录后数据永久保存到云端</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              disabled={!isConfigured}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 text-white shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {isConfigured ? '登录 / 注册' : '云端同步暂未配置'}
            </motion.button>
          </div>
        )}
      </Card>

      {/* Plan summary */}
      {planResult ? (
        <Card className="mb-4">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">📊 当前计划</h3>
          <div className="space-y-3">
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
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">热量缺口</span>
              <span className="font-semibold text-rose-500">-{planResult.deficit} kcal</span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-4">
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⚖️</div>
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

      {/* Coming soon */}
      <Card className="mb-4">
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🏗️</div>
          <h3 className="font-semibold text-slate-700 mb-1 text-sm">打卡追踪即将上线</h3>
          <p className="text-xs text-slate-400">每日体重记录、饮食完成度、运动打卡</p>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-slate-700 mb-3 text-sm">💡 健康小贴士</h3>
        <ul className="space-y-2 text-sm text-slate-500">
          <li>· 每天喝 2L 水，有助于代谢</li>
          <li>· 保证 7-8 小时睡眠，减少压力激素</li>
          <li>· 饭前喝一杯水，有助控制食量</li>
          <li>· 记录饮食 3 天就能发现自己不知道的习惯</li>
        </ul>
      </Card>

      <BottomNav />
    </div>
  )
}
