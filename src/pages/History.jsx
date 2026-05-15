import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import StatusBadge from '../components/ui/StatusBadge'
import { ArrowRight, Trash2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function History() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn:  () => reportsAPI.getAll().then(r => r.data)
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => reportsAPI.deleteOne(id),
    onSuccess:  () => {
      qc.invalidateQueries(['reports'])
      toast.success('Report deleted')
    }
  })

  const reports = data || []

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Scan History</h1>
        <p className="text-text-secondary text-sm">{reports.length} total scans</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 glass rounded-xl border border-bg-border animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="glass rounded-xl border border-bg-border p-16 text-center">
          <FileText size={40} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary mb-2">No scans yet</p>
          <Link to="/analyze" className="text-accent-cyan text-sm hover:underline">
            Run your first analysis →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 glass rounded-xl border border-bg-border
                         hover:border-accent-cyan/20 transition-all group">

              {/* Score circle */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{
                     background: r.risk_score >= 60 ? '#FF3B3B11' : r.risk_score >= 35 ? '#FFB80011' : '#00FF8811',
                     border: `1px solid ${r.risk_score >= 60 ? '#FF3B3B33' : r.risk_score >= 35 ? '#FFB80033' : '#00FF8833'}`
                   }}>
                <span className="font-mono text-xs font-bold"
                      style={{ color: r.risk_score >= 60 ? '#FF3B3B' : r.risk_score >= 35 ? '#FFB800' : '#00FF88' }}>
                  {r.risk_score !== null ? Math.round(r.risk_score) : '—'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-mono truncate">
                  {r.entity_name || r.url || r.email_text || 'Analysis'}
                </p>
                <p className="text-text-muted text-xs mt-0.5">{r.created_at?.substring(0, 10)}</p>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={r.status} />
                <button
                  onClick={() => deleteMutation.mutate(r.id)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-accent-red
                             hover:bg-accent-red/5 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={13} />
                </button>
                <Link to={`/reports/${r.id}`}
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent-cyan
                                 hover:bg-accent-cyan/5 transition-all">
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}