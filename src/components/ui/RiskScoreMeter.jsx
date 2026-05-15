import { motion } from 'framer-motion'

const LEVEL_CONFIG = {
  LOW:      { color: '#00FF88', label: 'LOW RISK',      bg: 'bg-accent-green/10'  },
  MEDIUM:   { color: '#FFB800', label: 'MEDIUM RISK',   bg: 'bg-accent-amber/10'  },
  HIGH:     { color: '#FF3B3B', label: 'HIGH RISK',     bg: 'bg-accent-red/10'    },
  CRITICAL: { color: '#FF3B3B', label: 'CRITICAL RISK', bg: 'bg-accent-red/10'    },
}

export default function RiskScoreMeter({ score = 0, level = 'LOW', confidence = 0 }) {
  const cfg     = LEVEL_CONFIG[level] || LEVEL_CONFIG.LOW
  const radius  = 54
  const circ    = 2 * Math.PI * radius
  const offset  = circ - (score / 100) * circ

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular gauge */}
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="60" cy="60" r={radius}
            fill="none" stroke="#1E2D45" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${cfg.color}66)` }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display text-3xl font-bold"
            style={{ color: cfg.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-text-muted text-xs font-mono">/100</span>
        </div>
      </div>

      {/* Level badge */}
      <div className={`px-4 py-1.5 rounded-full ${cfg.bg} border`}
           style={{ borderColor: cfg.color + '44' }}>
        <span className="font-display text-sm tracking-widest"
              style={{ color: cfg.color }}>
          {cfg.label}
        </span>
      </div>

      {/* Confidence */}
      <p className="text-text-muted text-xs font-mono">
        Confidence: {Math.round(confidence * 100)}%
      </p>
    </div>
  )
}