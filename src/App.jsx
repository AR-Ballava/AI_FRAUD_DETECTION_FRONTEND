import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import History from './pages/History'
import ReportDetail from './pages/ReportDetail'

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
})

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard"      element={<Dashboard />}    />
              <Route path="/analyze"        element={<Analyze />}      />
              <Route path="/history"        element={<History />}      />
              <Route path="/reports/:id"    element={<ReportDetail />} />
            </Route>

            {/* Default */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#E8EDF5',
              border: '1px solid #1E2D45',
              fontFamily: 'DM Sans',
              fontSize: '14px',
            }
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}