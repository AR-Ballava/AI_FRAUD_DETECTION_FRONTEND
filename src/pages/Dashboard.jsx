import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/ui/StatusBadge'
import { Shield, AlertTriangle, CheckCircle, Search, ArrowRight } from 'lucide-react'

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -2 }}
                className="glass rounded-xl p-5 border border-bg-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-sm">{label}</span>
        <Icon size={16} style={{ color }} />
      </div>
      <p className="font-display text-3xl" style={{ color }}>{value}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn:  () => reportsAPI.getAll().then(r => r.data)
  })

  const reports   = data || []
  const total     = reports.length
  const critical  = reports.filter(r => r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH').length
  const safe      = reports.filter(r => r.risk_level === 'LOW').length
  const recent    = reports.slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-8">
        <p className="text-text-muted text-sm font-mono mb-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-2xl font-semibold text-text-primary">
          Welcome, {user?.name}
        </h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Scans"     value={total}    color="#00D4FF" icon={Shield}        />
        <StatCard label="Threats Found"   value={critical} color="#FF3B3B" icon={AlertTriangle} />
        <StatCard label="Clean Results"   value={safe}     color="#00FF88" icon={CheckCircle}   />
      </div>

      {/* Quick analyze CTA */}
      <motion.div whileHover={{ scale: 1.005 }}
                  className="mb-8 glass rounded-xl p-6 border border-accent-cyan/20 glow-cyan
                             flex items-center justify-between">
        <div>
          <h2 className="text-text-primary font-semibold mb-1">Run a new fraud analysis</h2>
          <p className="text-text-secondary text-sm">
            Analyze recruiter emails, websites, or company names
          </p>
        </div>
        <Link to="/analyze"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg
                         bg-accent-cyan/10 border border-accent-cyan/30
                         text-accent-cyan font-display text-sm tracking-wider
                         hover:bg-accent-cyan/20 transition-all flex-shrink-0">
          <Search size={15} />
          ANALYZE
        </Link>
      </motion.div>

      {/* Recent reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary font-semibold">Recent Scans</h2>
          <Link to="/history" className="text-accent-cyan text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 glass rounded-xl border border-bg-border animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass rounded-xl border border-bg-border p-10 text-center">
            <Shield size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No scans yet. Run your first analysis.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link to={`/reports/${r.id}`}
                      className="flex items-center justify-between p-4 glass rounded-xl
                                 border border-bg-border hover:border-accent-cyan/20
                                 transition-all duration-200 group">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-text-primary text-sm font-mono truncate">
                      {r.entity_name || r.url || r.email_text?.substring(0, 60) || 'Analysis'}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">{r.created_at?.substring(0, 10)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {r.risk_score !== null && (
                      <span className="font-mono font-bold text-sm"
                            style={{ color: r.risk_score >= 60 ? '#FF3B3B' : r.risk_score >= 35 ? '#FFB800' : '#00FF88' }}>
                        {Math.round(r.risk_score)}
                      </span>
                    )}
                    <StatusBadge status={r.status} />
                    <ArrowRight size={14} className="text-text-muted group-hover:text-accent-cyan transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}