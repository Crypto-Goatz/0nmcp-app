"use client"

import { useEffect, useState } from "react"
import { Server, Wifi, WifiOff } from "lucide-react"

interface HealthData {
  online: boolean
  version?: string
  tools?: number
  services?: number
  uptime?: number
}

export function useServerHealth() {
  const [health, setHealth] = useState<HealthData>({ online: false })

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        const res = await fetch("/api/health")
        const data = await res.json()
        if (mounted) setHealth(data)
      } catch {
        if (mounted) setHealth({ online: false })
      }
    }
    check()
    const interval = setInterval(check, 15000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  return health
}

export default function ServerStatus() {
  const health = useServerHealth()

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
      health.online
        ? "bg-neon/10 text-neon"
        : "bg-red/10 text-red"
    }`}>
      {health.online ? (
        <>
          <Wifi size={12} />
          <span>0nMCP Live</span>
          {health.version && <span className="text-text-muted">v{health.version}</span>}
        </>
      ) : (
        <>
          <WifiOff size={12} />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}
