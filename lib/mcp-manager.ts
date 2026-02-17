/**
 * MCP Connection Manager
 *
 * Manages connections to 3 MCP servers:
 *   1. 0nMCP — Universal AI API Orchestrator (545 tools, 26 services)
 *   2. Rocket+ — CRM enhancements (50+ tools)
 *   3. CRM — Direct CRM API (245 tools, 12 modules)
 */

import { getServiceClient } from "./supabase"

export type MCPServerKey = "0nmcp" | "rocket_plus" | "crm"

export interface MCPServer {
  server_key: MCPServerKey
  name: string
  description: string
  endpoint_url: string
  transport: string
  auth_type: string
  online: boolean
  last_health_check: string | null
  version: string | null
  tools_count: number
  services_count: number
  status: string
  error_message: string | null
}

export interface MCPHealthResult {
  server_key: MCPServerKey
  online: boolean
  version?: string
  tools?: number
  services?: number
  latency_ms: number
  error?: string
}

export interface MCPExecuteResult {
  server_key: MCPServerKey
  tool: string
  success: boolean
  data?: unknown
  error?: string
  duration_ms: number
}

// ─── SERVER CONFIGS ───────────────────────────────────────
const DEFAULT_ENDPOINTS: Record<MCPServerKey, string> = {
  "0nmcp": process.env.ONMCP_URL || "http://localhost:3001",
  "rocket_plus": process.env.ROCKET_PLUS_URL || "https://rocketadd.com/api",
  "crm": process.env.CRM_API_BASE || "https://services.leadconnectorhq.com",
}

// ─── HEALTH CHECKS ───────────────────────────────────────

export async function checkHealth(serverKey: MCPServerKey): Promise<MCPHealthResult> {
  const start = Date.now()
  const endpoint = DEFAULT_ENDPOINTS[serverKey]

  try {
    if (serverKey === "0nmcp") {
      const res = await fetch(`${endpoint}/api/health`, { signal: AbortSignal.timeout(5000) })
      const data = await res.json().catch(() => ({}))
      const latency = Date.now() - start
      return {
        server_key: serverKey,
        online: res.ok,
        version: data.version || "unknown",
        tools: data.tools || 545,
        services: data.services || 26,
        latency_ms: latency,
      }
    }

    if (serverKey === "rocket_plus") {
      const res = await fetch(`${endpoint}/health`, { signal: AbortSignal.timeout(5000) })
      const latency = Date.now() - start
      return {
        server_key: serverKey,
        online: res.ok,
        version: "1.0.0",
        tools: 50,
        services: 1,
        latency_ms: latency,
      }
    }

    if (serverKey === "crm") {
      // CRM health = can we reach the API with our key?
      const token = process.env.CRM_AGENCY_API_KEY || process.env.CRM_PIT_KEY || ""
      if (!token) {
        return {
          server_key: serverKey,
          online: false,
          latency_ms: Date.now() - start,
          error: "No CRM API key configured",
        }
      }
      const res = await fetch(`${endpoint}/locations/search?limit=1`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Version": process.env.CRM_API_VERSION || "2021-07-28",
        },
        signal: AbortSignal.timeout(5000),
      })
      const latency = Date.now() - start
      return {
        server_key: serverKey,
        online: res.ok,
        version: process.env.CRM_API_VERSION || "2021-07-28",
        tools: 245,
        services: 12,
        latency_ms: latency,
        error: res.ok ? undefined : `HTTP ${res.status}`,
      }
    }

    return { server_key: serverKey, online: false, latency_ms: Date.now() - start, error: "Unknown server" }
  } catch (err) {
    return {
      server_key: serverKey,
      online: false,
      latency_ms: Date.now() - start,
      error: err instanceof Error ? err.message : "Connection failed",
    }
  }
}

export async function checkAllHealth(): Promise<MCPHealthResult[]> {
  const results = await Promise.all([
    checkHealth("0nmcp"),
    checkHealth("rocket_plus"),
    checkHealth("crm"),
  ])

  // Update DB with results
  try {
    const db = getServiceClient()
    for (const result of results) {
      await db.from("mcp_servers").update({
        online: result.online,
        last_health_check: new Date().toISOString(),
        last_health_response: result,
        version: result.version || null,
        tools_count: result.tools || 0,
        services_count: result.services || 0,
        status: result.online ? "connected" : "disconnected",
        error_message: result.error || null,
      }).eq("server_key", result.server_key)
    }
  } catch {
    // DB update is best-effort
  }

  return results
}

// ─── EXECUTE ──────────────────────────────────────────────

export async function execute(
  serverKey: MCPServerKey,
  tool: string,
  input: Record<string, unknown> = {},
  locationToken?: string
): Promise<MCPExecuteResult> {
  const start = Date.now()

  try {
    if (serverKey === "0nmcp") {
      const endpoint = DEFAULT_ENDPOINTS["0nmcp"]
      const res = await fetch(`${endpoint}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input }),
        signal: AbortSignal.timeout(30000),
      })
      const data = await res.json().catch(() => ({}))
      const duration = Date.now() - start

      // Log execution
      logExecution(serverKey, tool, input, data, res.ok, duration)

      return {
        server_key: serverKey,
        tool,
        success: res.ok,
        data,
        duration_ms: duration,
        error: res.ok ? undefined : data.error || `HTTP ${res.status}`,
      }
    }

    if (serverKey === "crm") {
      // CRM execution = direct API call
      const token = locationToken || process.env.CRM_AGENCY_API_KEY || process.env.CRM_PIT_KEY || ""
      if (!token) {
        return {
          server_key: serverKey,
          tool,
          success: false,
          duration_ms: Date.now() - start,
          error: "No CRM API key",
        }
      }

      // Map tool name to endpoint (simplified — 0nMCP handles the full mapping)
      const endpoint = DEFAULT_ENDPOINTS["crm"]
      const res = await fetch(`${endpoint}${input.endpoint || "/"}`, {
        method: (input.method as string) || "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Version": process.env.CRM_API_VERSION || "2021-07-28",
          "Content-Type": "application/json",
        },
        body: input.body ? JSON.stringify(input.body) : undefined,
        signal: AbortSignal.timeout(15000),
      })
      const data = await res.json().catch(() => ({}))
      const duration = Date.now() - start

      logExecution(serverKey, tool, input, data, res.ok, duration)

      return {
        server_key: serverKey,
        tool,
        success: res.ok,
        data,
        duration_ms: duration,
        error: res.ok ? undefined : `CRM API ${res.status}`,
      }
    }

    return {
      server_key: serverKey,
      tool,
      success: false,
      duration_ms: Date.now() - start,
      error: `Server ${serverKey} execution not implemented`,
    }
  } catch (err) {
    const duration = Date.now() - start
    return {
      server_key: serverKey,
      tool,
      success: false,
      duration_ms: duration,
      error: err instanceof Error ? err.message : "Execution failed",
    }
  }
}

// ─── EXECUTION LOGGING ────────────────────────────────────

async function logExecution(
  serverKey: MCPServerKey,
  tool: string,
  input: Record<string, unknown>,
  output: unknown,
  success: boolean,
  durationMs: number
) {
  try {
    const db = getServiceClient()
    await db.from("mcp_execution_log").insert({
      server_key: serverKey,
      tool_name: tool,
      input,
      output: output || {},
      status: success ? "success" : "error",
      duration_ms: durationMs,
    })
  } catch {
    // Logging is best-effort
  }
}

// ─── GET SERVERS FROM DB ──────────────────────────────────

export async function getServers(): Promise<MCPServer[]> {
  try {
    const db = getServiceClient()
    const { data, error } = await db
      .from("mcp_servers")
      .select("*")
      .order("server_key")
    if (error) throw error
    return (data || []) as MCPServer[]
  } catch {
    // Fallback to defaults
    return [
      { server_key: "0nmcp", name: "0nMCP Orchestrator", description: "545 tools, 26 services", endpoint_url: DEFAULT_ENDPOINTS["0nmcp"], transport: "http", auth_type: "none", online: false, last_health_check: null, version: null, tools_count: 545, services_count: 26, status: "configured", error_message: null },
      { server_key: "rocket_plus", name: "Rocket+", description: "50+ tools", endpoint_url: DEFAULT_ENDPOINTS["rocket_plus"], transport: "http", auth_type: "bearer", online: false, last_health_check: null, version: null, tools_count: 50, services_count: 1, status: "configured", error_message: null },
      { server_key: "crm", name: "CRM Direct", description: "245 tools, 12 modules", endpoint_url: DEFAULT_ENDPOINTS["crm"], transport: "http", auth_type: "bearer", online: false, last_health_check: null, version: null, tools_count: 245, services_count: 12, status: "configured", error_message: null },
    ]
  }
}
