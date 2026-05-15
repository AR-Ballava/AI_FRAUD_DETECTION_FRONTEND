import { motion } from 'framer-motion'

const ENGINE_LABELS = {
  email_fraud_engine_v1:       { label: 'Email Analysis',    weight: '35%' },
  website_fraud_engine_v1:     { label: 'Website Analysis',  weight: '20%' },
  social_reputation_engine_v1: { label: 'Social Reputation', weight: '20%' },
  offer_letter_engine_v1:      { label: 'Offer Letter',      weight: '15%' },
  fraud_graph_engine_v1:       { label: 'Fraud Graph',       weight: '10%' },
}

function scoreColor(score) {
  if (score >= 80) return '#FF3B3B'
  if (score >= 60) return '#FF3B3B'
  if (score >= 35) return '#FFB800'
  return '#00FF88'
}

export default function EngineBreakdown({ breakdowns = [] }) {
  if (!breakdowns.length) return null

  return (
    <div className="space-y-3">
      {breakdowns.map((bd, i) => {
        const meta  = ENGINE_LABELS[bd.engine_name] || { label: bd.engine_name, weight: '' }
        const color = scoreColor(bd.score)
        return (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-text-secondary text-sm">{meta.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-text-muted text-xs font-mono">
                  weight {meta.weight}
                </span>
                <span className="font-mono text-sm font-bold"
                      style={{ color }}>
                  {Math.round(bd.score)}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color,
                         boxShadow: `0 0 8px ${color}66` }}
                initial={{ width: 0 }}
                animate={{ width: `${bd.score}%` }}
                transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}