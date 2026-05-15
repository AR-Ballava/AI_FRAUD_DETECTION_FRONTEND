import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { reportsAPI } from '../services/api'
import RiskScoreMeter from '../components/ui/RiskScoreMeter'
import ThreatReasons from '../components/ui/ThreatReasons'
import EngineBreakdown from '../components/ui/EngineBreakdown'
import EntityBadges from '../components/ui/EntityBadges'
import FraudGraph from '../components/ui/FraudGraph'
import StatusBadge from '../components/ui/StatusBadge'

export default function ReportDetail() {
  const { id } = useParams()
  const { data: report, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn:  () => reportsAPI.getOne(id).then(r => r.data)
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  if (!report) return (
    <div className="text-center py-20 text-text-muted">Report not found</div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Back */}
        <Link to="/history"
              className="inline-flex items-center gap-2 text-text-secondary
                         hover:text-accent-cyan text-sm mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to history
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-text-primary mb-1">
              {report.entity_name || report.url || 'Email Analysis'}
            </h1>
            <p className="text-text-muted text-xs font-mono">{report.created_at}</p>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {report.status !== 'COMPLETED' ? (
          <div className="glass rounded-xl border border-bg-border p-10 text-center">
            <p className="text-text-secondary">
              This report is <StatusBadge status={report.status} />.
              {report.status === 'PROCESSING' && ' Refresh in a moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="glass rounded-xl border border-bg-border p-6 flex flex-col items-center">
                <RiskScoreMeter
                  score={report.risk_score}
                  level={report.risk_level}
                  confidence={report.confidence}
                />
                <p className="mt-4 text-text-secondary text-xs text-center">
                  {report.threat_summary}
                </p>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="glass rounded-xl border border-bg-border p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Engine Scores</h3>
                  <EngineBreakdown breakdowns={report.engine_results?.map(e => ({
                    engine_name: e.engineId,
                    score: e.riskScore,
                    weight: 0,
                    weighted_contribution: 0
                  })) || []} />
                </div>
                <div className="glass rounded-xl border border-bg-border p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">
                    Threat Indicators ({report.reasons?.length || 0})
                  </h3>
                  <ThreatReasons reasons={report.reasons} />
                </div>
              </div>
            </div>

            {report.entities?.length > 0 && (
              <div className="glass rounded-xl border border-bg-border p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Entities</h3>
                <EntityBadges entities={report.entities} />
              </div>
            )}

            {report.graph_data?.nodes?.length > 0 && (
              <div className="glass rounded-xl border border-bg-border p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Fraud Relationship Graph
                </h3>
                <FraudGraph graphData={report.graph_data} />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}