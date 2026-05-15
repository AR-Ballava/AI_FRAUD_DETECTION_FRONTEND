import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="scan-overlay" />
      <div className="absolute inset-0"
           style={{
             backgroundImage: `linear-gradient(#1E2D4511 1px, transparent 1px),
                               linear-gradient(90deg, #1E2D4511 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30
                          flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Shield size={28} className="text-accent-cyan" />
          </div>
          <h1 className="font-display text-2xl text-accent-cyan tracking-widest">FRAUDSHIELD</h1>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-text-primary font-semibold text-lg mb-6">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',     label: 'Full name',   type: 'text',     placeholder: 'John Doe'          },
              { key: 'email',    label: 'Email',        type: 'email',    placeholder: 'you@example.com'   },
              { key: 'password', label: 'Password',     type: 'password', placeholder: '••••••••'          },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-text-secondary text-sm mb-1.5">{label}</label>
                <input
                  type={type} required
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-bg-primary border border-bg-border rounded-lg
                             px-3 py-2.5 text-text-primary text-sm font-mono
                             focus:outline-none focus:border-accent-cyan/50
                             transition-colors placeholder-text-muted"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30
                               text-accent-cyan font-display tracking-wider text-sm
                               hover:bg-accent-cyan/20 disabled:opacity-50 transition-all duration-200">
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>
          <p className="mt-4 text-center text-text-muted text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-accent-cyan hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}