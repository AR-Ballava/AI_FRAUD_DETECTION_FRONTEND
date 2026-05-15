import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Globe, Building, Loader2, RotateCcw } from 'lucide-react'
import { useAnalysis } from '../hooks/useAnalysis'
import RiskScoreMeter from '../components/ui/RiskScoreMeter'
import ThreatReasons from '../components/ui/ThreatReasons'
import EngineBreakdown from '../components/ui/EngineBreakdown'
import EntityBadges from '../components/ui/EntityBadges'
import FraudGraph from '../components/ui/FraudGraph'

export default function Analyze() {
  const { submit, status, result, loading, reset } = useAnalysis()
  const [form, setForm] = useState({ email_text: '', url: '', entity_name: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {}
    if (form.email_text.trim())  payload.email_text  = form.email_text.trim()
    if (form.url.trim())         payload.url          = form.url.trim()
    if (form.entity_name.trim()) payload.entity_name  = form.entity_name.trim()
    submit(payload)
  }

  const handleReset = () => {
    reset()
    setForm({ email_text: '', url: '', entity_name: '' })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Fraud Analysis</h1>
        <p className="text-text-secondary text-sm">
          Submit any combination of email, URL, or company name for AI analysis
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result ? (
          /* ── Input form ── */
          <motion.div key="form"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="glass rounded-xl border border-bg-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={15} className="text-accent-cyan" />
                  <span className="text-text-primary text-sm font-medium">Recruiter Email</span>
                  <span className="text-text-muted text-xs">(optional)</span>
                </div>
                <textarea
                  rows={5}
                  value={form.email_text}
                  onChange={e => setForm(p => ({ ...p, email_text: e.target.value }))}
                  placeholder="Paste the full email text here..."
                  className="w-full bg-bg-primary border border-bg-border rounded-lg
                             px-3 py-2.5 text-text-primary text-sm font-mono
                             focus:outline-none focus:border-accent-cyan/50
                             resize-none transition-colors placeholder-text-muted"
                />
              </div>

              {/* URL */}
              <div className="glass rounded-xl border border-bg-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={15} className="text-accent-amber" />
                  <span className="text-text-primary text-sm font-medium">Company / Job Website</span>
                  <span className="text-text-muted text-xs">(optional)</span>
                </div>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                  placeholder="https://example-company.com"
                  className="w-full bg-bg-primary border border-bg-border rounded-lg
                             px-3 py-2.5 text-text-primary text-sm font-mono
                             focus:outline-none focus:border-accent-amber/50
                             transition-colors placeholder-text-muted"
                />
              </div>

              {/* Company name */}
              <div className="glass rounded-xl border border-bg-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building size={15} className="text-accent-green" />
                  <span className="text-text-primary text-sm font-medium">Recruiter / Company Name</span>
                  <span className="text-text-muted text-xs">(optional)</span>
                </div>
                <input
                  type="text"
                  value={form.entity_name}
                  onChange={e => setForm(p => ({ ...p, entity_name: e.target.value }))}
                  placeholder="e.g. TechHire Solutions Pvt Ltd"
                  className="w-full bg-bg-primary border border-bg-border rounded-lg
                             px-3 py-2.5 text-text-primary text-sm font-mono
                             focus:outline-none focus:border-accent-green/50
                             transition-colors placeholder-text-muted"
                />
              </div>

              <button
                type="submit"
                disabled={loading || (!form.email_text && !form.url && !form.entity_name)}
                className="w-full py-3.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30
                           text-accent-cyan font-display tracking-widest text-sm
                           hover:bg-accent-cyan/20 hover:glow-cyan
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {status === 'PROCESSING' ? 'AI ENGINES RUNNING...' : 'QUEUING ANALYSIS...'}
                  </>
                ) : 'RUN FRAUD ANALYSIS'}
              </button>
            </form>

            {/* Live progress */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 glass rounded-xl border border-accent-amber/20 p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-accent-amber" />
                    <div>
                      <p className="text-accent-amber text-sm font-mono">
                        {status === 'PROCESSING' ? 'AI engines analysing...' : 'Job queued...'}
                      </p>
                      <p className="text-text-muted text-xs mt-0.5">
                        Result will appear automatically via WebSocket
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        ) : (
          /* ── Result view ── */
          <motion.div key="result"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text-primary font-semibold">Analysis Result</h2>
              <button onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg
                                 bg-bg-card border border-bg-border text-text-secondary
                                 hover:text-text-primary hover:border-accent-cyan/30
                                 text-sm transition-all">
                <RotateCcw size={13} />
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left — score */}
              <div className="glass rounded-xl border border-bg-border p-6 flex flex-col items-center">
                <RiskScoreMeter
                  score={result.risk_score}
                  level={result.risk_level}
                  confidence={result.confidence}
                />
                <div className="mt-4 w-full">
                  <p className="text-text-secondary text-xs text-center leading-relaxed">
                    {result.threat_summary}
                  </p>
                </div>
              </div>

              {/* Right — details */}
              <div className="lg:col-span-2 space-y-4">
                {/* Engine breakdown */}
                <div className="glass rounded-xl border border-bg-border p-5">
                  <h3 className="text-text-primary text-sm font-semibold mb-4">Engine Scores</h3>
                  <EngineBreakdown breakdowns={result.engine_breakdowns} />
                </div>

                {/* Threat reasons */}
                <div className="glass rounded-xl border border-bg-border p-5">
                  <h3 className="text-text-primary text-sm font-semibold mb-4">
                    Threat Indicators ({result.reasons?.length || 0})
                  </h3>
                  <ThreatReasons reasons={result.reasons} />
                </div>
              </div>
            </div>

            {/* Entities */}
            {result.entities?.length > 0 && (
              <div className="mt-4 glass rounded-xl border border-bg-border p-5">
                <h3 className="text-text-primary text-sm font-semibold mb-4">
                  Extracted Entities
                </h3>
                <EntityBadges entities={result.entities} />
              </div>
            )}

            {/* Graph */}
            {result.graph_data?.nodes?.length > 0 && (
              <div className="mt-4 glass rounded-xl border border-bg-border p-5">
                <h3 className="text-text-primary text-sm font-semibold mb-4">
                  Fraud Relationship Graph
                </h3>
                <FraudGraph graphData={result.graph_data} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}