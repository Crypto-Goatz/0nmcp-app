import { NextResponse } from "next/server"
import { checkAllHealth, getServers } from "@/lib/mcp-manager"

/**
 * GET /api/mcp/status — Health check all 3 MCP servers
 * Returns current status + live health check results
 */

export async function GET() {
  try {
    // Run health checks in parallel
    const [servers, healthResults] = await Promise.all([
      getServers(),
      checkAllHealth(),
    ])

    // Merge server configs with health results
    const merged = servers.map(server => {
      const health = healthResults.find(h => h.server_key === server.server_key)
      return {
        ...server,
        online: health?.online ?? server.online,
        latency_ms: health?.latency_ms ?? null,
        live_error: health?.error ?? null,
        last_health_check: new Date().toISOString(),
      }
    })

    const onlineCount = merged.filter(s => s.online).length

    return NextResponse.json({
      servers: merged,
      summary: {
        total: merged.length,
        online: onlineCount,
        offline: merged.length - onlineCount,
        total_tools: merged.reduce((sum, s) => sum + (s.tools_count || 0), 0),
        total_services: merged.reduce((sum, s) => sum + (s.services_count || 0), 0),
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Health check failed" },
      { status: 500 }
    )
  }
}
