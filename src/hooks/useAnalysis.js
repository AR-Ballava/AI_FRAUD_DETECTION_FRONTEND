import { useState, useEffect } from 'react'
import { analysisAPI } from '../services/api'
import { wsService } from '../services/websocket'
import toast from 'react-hot-toast'

export function useAnalysis() {
  const [jobId,    setJobId]    = useState(null)
  const [status,   setStatus]   = useState(null)   // QUEUED | PROCESSING | COMPLETED | FAILED
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!jobId) return

    // Listen for progress updates
    const unsubProgress = wsService.on('PROGRESS', (data) => {
      if (data.job_id === jobId) setStatus(data.status)
    })

    // Listen for final result
    const unsubComplete = wsService.on('ANALYSIS_COMPLETE', (data) => {
      if (data.job_id === jobId) {
        setResult(data.result)
        setStatus('COMPLETED')
        setLoading(false)
        toast.success('Analysis complete!')
      }
    })

    // Listen for failure
    const unsubFailed = wsService.on('ANALYSIS_FAILED', (data) => {
      if (data.job_id === jobId) {
        setStatus('FAILED')
        setLoading(false)
        toast.error('Analysis failed. Please try again.')
      }
    })

    return () => {
      unsubProgress()
      unsubComplete()
      unsubFailed()
    }
  }, [jobId])

  const submit = async (formData) => {
    setLoading(true)
    setResult(null)
    setStatus('QUEUED')
    try {
      const res = await analysisAPI.submit(formData)
      setJobId(res.data.job_id)
      toast.success('Analysis queued!')
    } catch (err) {
      setLoading(false)
      setStatus(null)
      toast.error(err.response?.data?.detail || 'Submission failed')
    }
  }

  const reset = () => {
    setJobId(null)
    setStatus(null)
    setResult(null)
    setLoading(false)
  }

  return { submit, status, result, loading, reset }
}