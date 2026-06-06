import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { usePlanStore } from '../store/usePlanStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, signUp, isConfigured } = useAuth()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码')
      return
    }
    if (password.length < 6) {
      setError('密码至少需要6位')
      return
    }

    setLoading(true)
    const result = mode === 'login' ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      setError(null)
      setMode('login')
      setPassword('')
    } else {
      // Login success — jump to plan if data exists, else start onboarding
      const planResult = usePlanStore.getState().planResult
      if (planResult?.weeklyPlan?.length) {
        navigate('/plan')
      } else {
        navigate('/input')
      }
    }
  }

  return (
    <div className="px-4 pt-4 min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 -ml-2 text-slate-400 hover:text-slate-600 active:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
        aria-label="返回"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16L6 10L12 4" />
        </svg>
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-1">
          {mode === 'login' ? '欢迎回来 👋' : '创建账号 ✨'}
        </h2>
        <p className="text-sm text-slate-400 mb-8">
          {mode === 'login' ? '登录以同步你的数据' : '注册后数据永久保存到云端'}
        </p>

        {!isConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-600 text-sm font-medium">⚠️ Supabase 未配置</p>
            <p className="text-amber-500 text-xs mt-1">
              请在项目根目录创建 .env 文件，填入 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-slate-600 mb-2 block">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              inputMode="email"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-600 mb-2 block">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? '至少6位密码' : '输入密码'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-xl p-3"
              >
                <p className="text-rose-600 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-4 rounded-2xl text-lg font-semibold bg-indigo-600 text-white shadow-lg shadow-indigo-200 disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                处理中...
              </span>
            ) : mode === 'login' ? (
              '登录'
            ) : (
              '注册'
            )}
          </motion.button>
        </form>

        {/* Toggle mode */}
        <div className="text-center mt-6">
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
            className="text-sm text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            {mode === 'login' ? '还没有账号？立即注册 →' : '已有账号？去登录 →'}
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-slate-300 mt-6">
          数据安全存储在 Supabase，仅你本人可访问
        </p>
      </motion.div>
    </div>
  )
}
