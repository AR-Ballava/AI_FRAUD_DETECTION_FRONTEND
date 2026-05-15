import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

const SEV = {
  high:   { icon: AlertTriangle, color: 'text-accent-red',   bg: 'bg-accent-red/5',   border: 'border-accent-red/20'   },
  medium: { icon: AlertCircle,   color: 'text-accent-amber', bg: 'bg-accent-amber/5', border: 'border-accent-amber/20' },
  low:    { icon: Info,          color: 'text-accent-cyan',  bg: 'bg-accent-cyan/5',  border: 'border-accent-cyan/20'  },
}

export default function ThreatReasons({ reasons = [] }) {
  if (!reasons.length) return (
    <p className="text-text-muted text-sm text-center py-6">No threat indicators found</p>
  )

  // Sort: high first
  const sorted = [...reasons].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  })

  return (
    <div className="space-y-2">
      {sorted.map((reason, i) => {
        const cfg  = SEV[reason.severity] || SEV.low
        const Icon = cfg.icon
        return (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}
          >
            <div className="flex items-start gap-3">
              <Icon size={15} className={`${cfg.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-xs font-bold ${cfg.color}`}>
                    {reason.code}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    {reason.severity}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {reason.description}
                </p>
                {reason.evidence && (
                  <p className="mt-1.5 font-mono text-xs text-text-muted
                                bg-bg-primary px-2 py-1 rounded border border-bg-border truncate">
                    Evidence: {reason.evidence}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}