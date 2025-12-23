import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export function useLogStream(enabled: boolean = true) {
  const qc = useQueryClient()

  React.useEffect(() => {
    if (!enabled) return
    const url = API_BASE.replace(/\/$/, '') + '/logs/stream'
    const es = new EventSource(url)

    es.onmessage = () => {
      // Any new log should refresh tables that read from entries endpoint
      qc.invalidateQueries({ queryKey: ['entries'] })
    }

    // Keep the connection resilient; browser retries automatically
    es.onerror = () => {}

    return () => es.close()
  }, [qc, enabled])
}
