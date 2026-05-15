import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data)
      toast.success(`Welcome back, ${res.data.name}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="scan-overlay" />

      {/* Background grid */}
      <div className="absolute inset-0"
           style={{
             backgroundImage: `linear-gradient(#1E2D4511 1px, transparent 1px),
                               linear-gradient(90deg, #1E2D4511 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30
                          flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Shield size={28} className="text-accent-cyan" />
          </div>
          <h1 className="font-display text-2xl text-accent-cyan tracking-widest">FRAUDSHIELD</h1>
          <p className="text-text-muted text-sm mt-1">AI-Powered Fraud Intelligence</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-text-primary font-semibold text-lg mb-6">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-bg-primary border border-bg-border rounded-lg
                           px-3 py-2.5 text-text-primary text-sm font-mono
                           focus:outline-none focus:border-accent-cyan/50
                           transition-colors placeholder-text-muted"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-bg-primary border border-bg-border rounded-lg
                             px-3 py-2.5 pr-10 text-text-primary text-sm font-mono
                             focus:outline-none focus:border-accent-cyan/50
                             transition-colors placeholder-text-muted"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30
                         text-accent-cyan font-display tracking-wider text-sm
                         hover:bg-accent-cyan/20 hover:glow-cyan
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
          <p className="mt-4 text-center text-text-muted text-sm">
            No account?{' '}
            <Link to="/register" className="text-accent-cyan hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}