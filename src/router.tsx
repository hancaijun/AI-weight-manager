import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import WelcomePage from './pages/WelcomePage'
import InputPage from './pages/InputPage'
import GoalPage from './pages/GoalPage'
import SummaryPage from './pages/SummaryPage'
import PlanPage from './pages/PlanPage'
import TrackerPage from './pages/TrackerPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: 'welcome', element: <WelcomePage /> },
      { path: 'input', element: <InputPage /> },
      { path: 'goal', element: <GoalPage /> },
      { path: 'summary', element: <SummaryPage /> },
      { path: 'plan', element: <PlanPage /> },
      { path: 'track', element: <TrackerPage /> },
    ],
  },
])
