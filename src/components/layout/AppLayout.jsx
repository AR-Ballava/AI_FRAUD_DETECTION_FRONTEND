import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <div className="scan-overlay" />
      <Sidebar />
      <main className="flex-1 ml-16 lg:ml-56 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}