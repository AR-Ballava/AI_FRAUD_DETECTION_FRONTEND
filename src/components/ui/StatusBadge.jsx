import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'

const STATUS = {
  PENDING:    { icon: Clock,     color: 'text-text-muted',    bg: 'bg-bg-border/30',      label: 'Pending'    },
  QUEUED:     { icon: Clock,     color: 'text-accent-cyan',   bg: 'bg-accent-cyan/10',    label: 'Queued'     },
  PROCESSING: { icon: Loader2,   color: 'text-accent-amber',  bg: 'bg-accent-amber/10',   label: 'Processing', spin: true },
  COMPLETED:  { icon: CheckCircle, color: 'text-accent-green', bg: 'bg-accent-green/10',  label: 'Completed'  },
  FAILED:     { icon: XCircle,   color: 'text-accent-red',    bg: 'bg-accent-red/10',     label: 'Failed'     },
}

export default function StatusBadge({ status = 'PENDING' }) {
  const cfg  = STATUS[status] || STATUS.PENDING
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                      rounded-full text-xs font-mono ${cfg.color} ${cfg.bg}`}>
      <Icon size={11} className={cfg.spin ? 'animate-spin' : ''} />
      {cfg.label}
    </span>
  )
}