"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings, Server, Zap, Shield, RefreshCw, Check, X,
  AlertTriangle, ChevronRight, Globe, Key, Lock,
  Radio, Wifi, WifiOff, Clock, BarChart3, Users,
  Building2, MapPin, Phone, Mail, ExternalLink,
  CheckCircle2, XCircle, Loader2, ArrowRight,
  Database, Layers, ChevronDown, Search, Rocket
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────
interface MCPServer {
  server_key: string
  name: string
  description: string
  endpoint_url: string
  online: boolean
  tools_count: number
  services_count: number
  status: string
  latency_ms?: number | null
  live_error?: string | null
  version?: string | null
}

interface AgencyConfig {
  agency_name: string
  agency_id: string | null
  status: string
  locations_count: number
  last_sync_at: string | null
}

interface AgencyKeys {
  agency_api_key: boolean
  pit_key: boolean
  client_id: boolean
  client_secret: boolean
  pit_value: string | null
}

interface CRMLocation {
  id: string
  location_id: string
  name: string
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  connected: boolean
  status: string
  last_sync_at: string | null
  contacts_count: number
  mcp_0nmcp_enabled: boolean
  mcp_rocket_enabled: boolean
  mcp_crm_enabled: boolean
}

type Tab = "mcp" | "crm" | "locations"

// ─── COMPONENT ────────────────────────────────────────────
export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("mcp")
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [healthChecking, setHealthChecking] = useState(false)

  // MCP state
  const [servers, setServers] = useState<MCPServer[]>([])
  const [mcpSummary, setMcpSummary] = useState({ total: 0, online: 0, total_tools: 0, total_services: 0 })

  // CRM state
  const [agencyConfig, setAgencyConfig] = useState<AgencyConfig | null>(null)
  const [agencyKeys, setAgencyKeys] = useState<AgencyKeys | null>(null)
  const [configured, setConfigured] = useState(false)

  // Locations state
  const [locations, setLocations] = useState<CRMLocation[]>([])
  const [locationSearch, setLocationSearch] = useState("")
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null)

  // ─── DATA LOADING ───────────────────────────────
  const loadMCPStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/mcp/status")
      const data = await res.json()
      if (data.servers) setServers(data.servers)
      if (data.summary) setMcpSummary(data.summary)
    } catch {}
  }, [])

  const loadAgencyConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/agency")
      const data = await res.json()
      setAgencyConfig(data.config)
      setAgencyKeys(data.keys)
      setConfigured(data.configured)
    } catch {}
  }, [])

  const loadLocations = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/locations")
      const data = await res.json()
      if (data.locations) setLocations(data.locations)
    } catch {}
  }, [])

  useEffect(() => {
    Promise.all([loadMCPStatus(), loadAgencyConfig(), loadLocations()])
      .finally(() => setLoading(false))
  }, [loadMCPStatus, loadAgencyConfig, loadLocations])

  // ─── ACTIONS ────────────────────────────────────
  const refreshHealth = async () => {
    setHealthChecking(true)
    await loadMCPStatus()
    setHealthChecking(false)
  }

  const syncLocations = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/crm/locations", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        await loadLocations()
        await loadAgencyConfig()
      }
    } catch {}
    setSyncing(false)
  }

  const initAgency = async () => {
    try {
      await fetch("/api/crm/agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agency_name: "0nORK Agency" }),
      })
      await loadAgencyConfig()
    } catch {}
  }

  // ─── COMPUTED ───────────────────────────────────
  const filteredLocations = locations.filter(l =>
    !locationSearch || l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.city?.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.location_id.includes(locationSearch)
  )

  const serverIcon = (key: string) => {
    switch (key) {
      case "0nmcp": return Zap
      case "rocket_plus": return Rocket
      case "crm": return Database
      default: return Server
    }
  }

  const serverColor = (key: string) => {
    switch (key) {
      case "0nmcp": return "#00ff88"
      case "rocket_plus": return "#ff6b35"
      case "crm": return "#00d4ff"
      default: return "#9945ff"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-neon animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-neon/15">
            <Settings size={28} className="text-neon" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Integration Hub</h1>
            <p className="text-sm text-text-dim">
              3 MCP Servers &middot; CRM Agency Tie-In &middot; {locations.length} Locations
            </p>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "MCP Servers", value: `${mcpSummary.online}/${mcpSummary.total}`, color: "#00ff88", sub: "online" },
            { label: "Total Tools", value: mcpSummary.total_tools.toLocaleString(), color: "#00d4ff", sub: "across all MCPs" },
            { label: "Locations", value: locations.length, color: "#ff6b35", sub: "sub-accounts" },
            { label: "Connected", value: locations.filter(l => l.connected).length, color: "#9945ff", sub: "active" },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{s.label}</div>
              <div className="text-[9px] text-text-muted mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { id: "mcp" as Tab, label: "MCP Servers", icon: Server, badge: `${mcpSummary.online}/${mcpSummary.total}` },
            { id: "crm" as Tab, label: "CRM Agency", icon: Shield, badge: configured ? "Active" : "Setup" },
            { id: "locations" as Tab, label: "Locations", icon: Building2, badge: String(locations.length) },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                tab === t.id
                  ? "bg-neon/10 text-neon border border-neon/30"
                  : "glass-card text-text-dim hover:text-text"
              )}
            >
              <t.icon size={14} />
              {t.label}
              <span className={cn(
                "text-[9px] px-1.5 py-0.5 rounded-full",
                tab === t.id ? "bg-neon/20 text-neon" : "bg-white/5 text-text-muted"
              )}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* ─── MCP SERVERS TAB ─────────────────────── */}
        {tab === "mcp" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">MCP Server Connections</h2>
              <button
                onClick={refreshHealth}
                disabled={healthChecking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-xs font-bold text-text-dim hover:text-text transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={cn(healthChecking && "animate-spin")} />
                {healthChecking ? "Checking..." : "Health Check"}
              </button>
            </div>

            {servers.map(server => {
              const Icon = serverIcon(server.server_key)
              const color = serverColor(server.server_key)
              return (
                <div key={server.server_key} className="glass-card rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "15" }}>
                      <Icon size={24} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{server.name}</h3>
                        <div className={cn(
                          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                          server.online ? "bg-neon/15 text-neon" : "bg-red/15 text-red"
                        )}>
                          {server.online ? <Wifi size={8} /> : <WifiOff size={8} />}
                          {server.online ? "Connected" : "Offline"}
                        </div>
                      </div>
                      <p className="text-xs text-text-dim mb-3">{server.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-surface/50 rounded-lg p-2.5 text-center">
                          <div className="text-sm font-black" style={{ color }}>{server.tools_count}</div>
                          <div className="text-[9px] text-text-muted">Tools</div>
                        </div>
                        <div className="bg-surface/50 rounded-lg p-2.5 text-center">
                          <div className="text-sm font-black" style={{ color }}>{server.services_count}</div>
                          <div className="text-[9px] text-text-muted">Services</div>
                        </div>
                        <div className="bg-surface/50 rounded-lg p-2.5 text-center">
                          <div className="text-sm font-black text-text-dim">{server.latency_ms ?? "—"}ms</div>
                          <div className="text-[9px] text-text-muted">Latency</div>
                        </div>
                        <div className="bg-surface/50 rounded-lg p-2.5 text-center">
                          <div className="text-sm font-black text-text-dim">{server.version || "—"}</div>
                          <div className="text-[9px] text-text-muted">Version</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 text-[10px] text-text-muted">
                        <span className="flex items-center gap-1"><Globe size={10} /> {server.endpoint_url}</span>
                        {server.live_error && (
                          <span className="flex items-center gap-1 text-red">
                            <AlertTriangle size={10} /> {server.live_error}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* ─── CRM AGENCY TAB ──────────────────────── */}
        {tab === "crm" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-lg font-bold">CRM Agency Configuration</h2>

            {/* Key status */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Key size={14} className="text-cyan" /> API Key Scopes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Agency API Key", key: "agency_api_key", desc: "Full agency access — list/manage all sub-accounts", color: "#00ff88", scope: "Agency" },
                  { label: "PIT Key", key: "pit_key", desc: "Private Integration Token — marketplace app access", color: "#00d4ff", scope: "Marketplace", extra: agencyKeys?.pit_value },
                  { label: "OAuth Client ID", key: "client_id", desc: "Marketplace OAuth flow — user-authorized access", color: "#9945ff", scope: "OAuth" },
                  { label: "OAuth Client Secret", key: "client_secret", desc: "OAuth secret for token exchange", color: "#ff6b35", scope: "OAuth" },
                ].map(k => (
                  <div key={k.key} className="flex items-start gap-3 p-4 rounded-xl bg-surface/50">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      agencyKeys?.[k.key as keyof AgencyKeys] ? "bg-neon/15" : "bg-red/15"
                    )}>
                      {agencyKeys?.[k.key as keyof AgencyKeys] ? (
                        <CheckCircle2 size={14} className="text-neon" />
                      ) : (
                        <XCircle size={14} className="text-red" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{k.label}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: k.color + "15", color: k.color }}>
                          {k.scope}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">{k.desc}</p>
                      {k.extra && (
                        <code className="text-[9px] text-cyan font-mono mt-1 block">{k.extra}</code>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-surface/30 border border-border">
                <p className="text-[10px] text-text-muted">
                  <Lock size={10} className="inline mr-1" />
                  API keys are stored as environment variables on the server. Set them in Vercel:
                  <code className="text-cyan ml-1">CRM_AGENCY_API_KEY</code>,
                  <code className="text-cyan ml-1">CRM_PIT_KEY</code>,
                  <code className="text-cyan ml-1">CRM_CLIENT_ID</code>,
                  <code className="text-cyan ml-1">CRM_CLIENT_SECRET</code>
                </p>
              </div>
            </div>

            {/* Agency status */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Building2 size={14} className="text-orange" /> Agency Status
              </h3>

              {agencyConfig ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-surface/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-neon">{agencyConfig.locations_count}</div>
                      <div className="text-[9px] text-text-muted">Locations</div>
                    </div>
                    <div className="bg-surface/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-cyan">{agencyConfig.status}</div>
                      <div className="text-[9px] text-text-muted">Status</div>
                    </div>
                    <div className="bg-surface/50 rounded-lg p-3 text-center">
                      <div className="text-[11px] font-bold text-text-dim">
                        {agencyConfig.last_sync_at ? new Date(agencyConfig.last_sync_at).toLocaleDateString() : "Never"}
                      </div>
                      <div className="text-[9px] text-text-muted">Last Sync</div>
                    </div>
                    <div className="bg-surface/50 rounded-lg p-3 text-center">
                      <div className="text-[11px] font-bold text-text-dim">{agencyConfig.agency_name}</div>
                      <div className="text-[9px] text-text-muted">Agency</div>
                    </div>
                  </div>

                  <button
                    onClick={syncLocations}
                    disabled={syncing || !configured}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg text-sm font-bold hover:shadow-lg hover:shadow-neon/20 transition-all disabled:opacity-30"
                  >
                    {syncing ? (
                      <><RefreshCw size={14} className="animate-spin" /> Syncing Locations...</>
                    ) : (
                      <><RefreshCw size={14} /> Sync All Locations from CRM</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield size={32} className="mx-auto mb-3 text-text-muted opacity-30" />
                  <p className="text-sm text-text-dim mb-4">Agency not initialized yet</p>
                  <button
                    onClick={initAgency}
                    disabled={!configured}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon text-bg text-xs font-bold hover:bg-neon/90 transition-all mx-auto disabled:opacity-30"
                  >
                    <Zap size={12} /> Initialize Agency
                  </button>
                  {!configured && (
                    <p className="text-[10px] text-red mt-2">Set CRM_AGENCY_API_KEY in environment first</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── LOCATIONS TAB ──────────────────────── */}
        {tab === "locations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Sub-Account Locations ({locations.length})</h2>
              <button
                onClick={syncLocations}
                disabled={syncing || !configured}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-xs font-bold text-text-dim hover:text-text transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={cn(syncing && "animate-spin")} />
                {syncing ? "Syncing..." : "Sync"}
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                placeholder="Search locations..."
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-neon/30 transition-all"
              />
            </div>

            {/* Location list */}
            {filteredLocations.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Building2 size={40} className="mx-auto mb-3 text-text-muted opacity-20" />
                <p className="text-sm text-text-dim mb-2">
                  {locations.length === 0 ? "No locations synced yet" : "No matching locations"}
                </p>
                {locations.length === 0 && configured && (
                  <button
                    onClick={syncLocations}
                    disabled={syncing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neon text-bg text-xs font-bold hover:bg-neon/90 transition-all mx-auto"
                  >
                    <RefreshCw size={12} /> Sync from CRM
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLocations.map(loc => (
                  <div key={loc.id} className="glass-card rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedLocation(expandedLocation === loc.id ? null : loc.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        loc.connected ? "bg-neon/15" : "bg-surface"
                      )}>
                        <Building2 size={18} className={loc.connected ? "text-neon" : "text-text-muted"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold truncate">{loc.name}</span>
                          <span className={cn(
                            "text-[8px] font-bold px-1.5 py-0.5 rounded-full",
                            loc.status === "active" ? "bg-neon/15 text-neon" : "bg-red/15 text-red"
                          )}>
                            {loc.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-text-muted mt-0.5">
                          {loc.city && <span className="flex items-center gap-0.5"><MapPin size={8} /> {loc.city}{loc.state ? `, ${loc.state}` : ""}</span>}
                          {loc.phone && <span className="flex items-center gap-0.5"><Phone size={8} /> {loc.phone}</span>}
                          <code className="text-text-muted/50">{loc.location_id.slice(0, 12)}...</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {loc.mcp_crm_enabled && <div className="w-2 h-2 rounded-full bg-cyan" title="CRM" />}
                        {loc.mcp_0nmcp_enabled && <div className="w-2 h-2 rounded-full bg-neon" title="0nMCP" />}
                        {loc.mcp_rocket_enabled && <div className="w-2 h-2 rounded-full bg-orange" title="Rocket+" />}
                      </div>
                      <ChevronDown size={14} className={cn(
                        "text-text-muted transition-transform shrink-0",
                        expandedLocation === loc.id && "rotate-180"
                      )} />
                    </button>

                    <AnimatePresence>
                      {expandedLocation === loc.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-border">
                            <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
                              <div className="bg-surface/50 rounded-lg p-2 text-center">
                                <div className="text-sm font-bold text-cyan">{loc.contacts_count}</div>
                                <div className="text-[8px] text-text-muted">Contacts</div>
                              </div>
                              <div className="bg-surface/50 rounded-lg p-2 text-center">
                                <div className="text-[10px] font-bold text-text-dim">
                                  {loc.last_sync_at ? new Date(loc.last_sync_at).toLocaleDateString() : "Never"}
                                </div>
                                <div className="text-[8px] text-text-muted">Last Sync</div>
                              </div>
                              <div className="bg-surface/50 rounded-lg p-2 text-center">
                                <div className={cn("text-sm font-bold", loc.connected ? "text-neon" : "text-text-muted")}>
                                  {loc.connected ? "Yes" : "No"}
                                </div>
                                <div className="text-[8px] text-text-muted">Connected</div>
                              </div>
                            </div>

                            {/* MCP toggles */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-text-muted uppercase tracking-wider">MCP Connections</span>
                              {[
                                { key: "mcp_crm_enabled", label: "CRM Direct", color: "#00d4ff", enabled: loc.mcp_crm_enabled },
                                { key: "mcp_0nmcp_enabled", label: "0nMCP Orchestrator", color: "#00ff88", enabled: loc.mcp_0nmcp_enabled },
                                { key: "mcp_rocket_enabled", label: "Rocket+", color: "#ff6b35", enabled: loc.mcp_rocket_enabled },
                              ].map(mcp => (
                                <div key={mcp.key} className="flex items-center justify-between p-2 rounded-lg bg-surface/30">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: mcp.enabled ? mcp.color : "#484e78" }} />
                                    <span className="text-[10px] font-bold">{mcp.label}</span>
                                  </div>
                                  <span className={cn(
                                    "text-[9px] font-bold",
                                    mcp.enabled ? "text-neon" : "text-text-muted"
                                  )}>
                                    {mcp.enabled ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <code className="text-[9px] text-text-muted font-mono flex-1">{loc.location_id}</code>
                              {loc.email && (
                                <span className="text-[9px] text-text-muted flex items-center gap-0.5">
                                  <Mail size={8} /> {loc.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
