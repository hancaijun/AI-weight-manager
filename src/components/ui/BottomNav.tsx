import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/input',  icon: '📝', label: '输入' },
  { path: '/plan',   icon: '📅', label: '计划' },
  { path: '/track',  icon: '👤', label: '我的' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 safe-area-bottom z-50">
      <div className="flex max-w-lg mx-auto">
        {TABS.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2 flex flex-col items-center text-xs transition-colors ${
                active ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
