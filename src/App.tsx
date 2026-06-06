import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto min-h-screen relative pb-16">
        <Outlet />
      </div>
    </div>
  )
}
