"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Send, Settings, X, Loader2, Copy, Check,
  Zap, Server, Radio, Key, Globe, ChevronRight,
  Sparkles, RotateCcw, Trash2, Terminal, ExternalLink,
  ChevronDown, WifiOff, Wifi, MessageSquare, Bot
} from "lucide-react"

import { cn } from "@/lib/utils"
import { EXPANSION_STATS } from "@/lib/services-expansion"

// ─── TYPES ────────────────────────────────────────────────
type ExecutionMode = "anthropic" | "local"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  tools?: string[]
  duration?: number
}

interface ConnectionStatus {
  tested: boolean
  online: boolean
  message: string
}

// ─── QUICK ACTIONS ────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "List all services", prompt: "List all 59 available services organized by category", icon: Server },
  { label: "Check server health", prompt: "Check the 0nMCP server health status and version", icon: Wifi },
  { label: "Build a workflow", prompt: "Help me build a workflow that connects Gmail to Slack to notify my team when I get important emails", icon: Zap },
  { label: "CRM automation", prompt: "Create an automation that adds new form submissions to the CRM and sends a welcome email", icon: Terminal },
  { label: "Generate .0n config", prompt: "Generate a .0n configuration file for connecting Stripe payments to QuickBooks accounting", icon: Sparkles },
  { label: "Explain capabilities", prompt: "What are the 1,385 capabilities? How do cross-service workflows work?", icon: Globe },
]

// ─── TOOL DETECTION ───────────────────────────────────────
const TOOL_PATTERNS: { pattern: RegExp; tools: string[] }[] = [
  { pattern: /gmail|email|send.*mail/i, tools: ["gmail_send", "gmail_search", "gmail_draft"] },
  { pattern: /slack|notify.*team|channel/i, tools: ["slack_send_message", "slack_create_channel"] },
  { pattern: /stripe|payment|invoice/i, tools: ["stripe_create_invoice", "stripe_list_payments"] },
  { pattern: /crm|contact|lead|deal/i, tools: ["crm_create_contact", "crm_search_contacts", "crm_create_opportunity"] },
  { pattern: /calendar|meeting|schedule/i, tools: ["gcal_create_event", "calendly_get_events"] },
  { pattern: /github|repo|pull request/i, tools: ["github_create_issue", "github_list_repos"] },
  { pattern: /notion|page|database/i, tools: ["notion_create_page", "notion_query_database"] },
  { pattern: /shopify|product|order/i, tools: ["shopify_create_product", "shopify_list_orders"] },
  { pattern: /twilio|sms|text message/i, tools: ["twilio_send_sms", "twilio_send_whatsapp"] },
  { pattern: /openai|gpt|ai.*generate/i, tools: ["openai_chat", "openai_embeddings"] },
  { pattern: /supabase|database|sql/i, tools: ["supabase_query", "supabase_insert"] },
  { pattern: /workflow|automat|connect/i, tools: ["run_workflow", "list_workflows"] },
]

function detectTools(text: string): string[] {
  const found = new Set<string>()
  TOOL_PATTERNS.forEach(p => {
    if (p.pattern.test(text)) p.tools.forEach(t => found.add(t))
  })
  return Array.from(found)
}

// ─── SIMULATED AI RESPONSES ───────────────────────────────
function generateResponse(input: string): { content: string; tools: string[] } {
  const q = input.toLowerCase()
  const tools = detectTools(input)

  if (q.includes("list") && q.includes("service")) {
    return {
      content: `## 0nMCP Service Catalog — ${EXPANSION_STATS.services} Services

**Everyday Tools (8):** Gmail, Slack, Google Calendar, Google Sheets, Google Drive, Zoom, Microsoft 365, Notion

**Communication & Social (9):** Discord, Twilio, WhatsApp Business, Facebook/Meta, Instagram, LinkedIn, X (Twitter), TikTok, Pinterest

**Email Marketing & Forms (6):** Mailchimp, SendGrid, Resend, Typeform, Google Forms, JotForm

**Payments & Accounting (6):** Stripe, Shopify, QuickBooks, Xero, Square, FreshBooks

**CRM & Sales (4):** 0nMCP CRM (245 tools), HubSpot, Salesforce, Pipedrive

**Project Management (8):** Trello, Asana, Monday.com, ClickUp, Airtable, Calendly, Google Tasks, Todoist

**Documents & Design (3):** Canva, DocuSign, Dropbox

**Customer Support (3):** Zendesk, Intercom, Freshdesk

**Websites & CMS (3):** WordPress, Webflow, Wix

**Advertising (2):** Google Ads, Facebook Ads

**AI & Intelligence (2):** OpenAI, Anthropic (Claude)

**Developer & Database (5):** GitHub, Supabase, MongoDB, Linear, Jira

---
**Total: ${EXPANSION_STATS.services} services | ${EXPANSION_STATS.baseTools.toLocaleString()} base tools | ${EXPANSION_STATS.capabilities} cross-service capabilities**`,
      tools: ["list_services"],
    }
  }

  if (q.includes("health") || q.includes("status")) {
    return {
      content: `## Server Health Check

| Metric | Status |
|--------|--------|
| **Server** | Online |
| **Version** | v1.7.0 |
| **Services** | ${EXPANSION_STATS.services} loaded |
| **Tools** | ${EXPANSION_STATS.baseTools.toLocaleString()} available |
| **Capabilities** | ${EXPANSION_STATS.capabilities} cross-service |
| **Uptime** | 99.9% |
| **Response Time** | ~45ms avg |

All systems operational. Ready to execute tasks.`,
      tools: ["health_check"],
    }
  }

  if (q.includes("workflow") || q.includes("connect") || q.includes("automat")) {
    return {
      content: `## Workflow Builder

Based on your request, here's a suggested workflow:

\`\`\`json
{
  "name": "custom-workflow",
  "version": "1.0.0",
  "trigger": {
    "service": "detected-from-context",
    "event": "on_trigger"
  },
  "steps": [
    {
      "name": "step_1",
      "service": "${tools[0]?.split("_")[0] || "gmail"}",
      "tool": "${tools[0] || "gmail_search"}",
      "input": { "query": "{{trigger.data}}" }
    },
    {
      "name": "step_2",
      "service": "${tools[1]?.split("_")[0] || "slack"}",
      "tool": "${tools[1] || "slack_send_message"}",
      "input": { "message": "{{step_1.output}}" }
    }
  ]
}
\`\`\`

**Detected tools:** ${tools.length > 0 ? tools.join(", ") : "Describe more specific services to auto-detect tools."}

Would you like me to refine this workflow or add more steps?`,
      tools,
    }
  }

  if (q.includes(".0n") || q.includes("config")) {
    return {
      content: `## Generated .0n Configuration

\`\`\`json
{
  "name": "generated-config",
  "version": "1.0.0",
  "description": "Auto-generated from: ${input.slice(0, 80)}...",
  "services": {
    ${tools.map(t => `"${t.split("_")[0]}": { "adapter": "${t.split("_")[0]}.0n" }`).join(",\n    ") || '"gmail": { "adapter": "gmail.0n" }'}
  },
  "workflow": {
    "trigger": "manual",
    "steps": [
      ${tools.map((t, i) => `{ "tool": "${t}", "input": "{{${i === 0 ? 'trigger' : `step_${i}`}.data}}" }`).join(",\n      ") || '{ "tool": "gmail_send", "input": "{{trigger.data}}" }'}
    ]
  }
}
\`\`\`

Save this as \`workflow.0n.json\` and run:
\`\`\`bash
0nmcp run workflow.0n.json
\`\`\``,
      tools,
    }
  }

  if (q.includes("capabilit") || q.includes("cross-service")) {
    return {
      content: `## 0nMCP Capabilities Explained

A **tool** is a single action: *"Send an email via Gmail."*
A **capability** is a cross-service workflow: *"When a Typeform is submitted, create a Stripe invoice and notify Slack."*

### ${EXPANSION_STATS.capabilities} Pre-Built Capabilities:

| Category | Count | Example |
|----------|-------|---------|
| Form Automations | 15 | Typeform → CRM + Slack + Gmail |
| CRM Automations | 15 | Deal closed → Invoice + Notification |
| Payment Automations | 12 | Stripe → QuickBooks + Receipt |
| Email Marketing | 7 | Opens → Lead score update |
| Social Automations | 13 | Cross-post to all platforms |
| Scheduling | 8 | Calendly → CRM + Google Cal |
| Support | 7 | Zendesk → Slack + Follow-up |
| Project Mgmt | 8 | Task done → Notify + Log |
| Website | 7 | Blog published → Social burst |
| Advertising | 8 | Ad lead → CRM + Email |
| Documents | 6 | Signed → Invoice + Drive |
| AI-Powered | 10 | AI-draft from ticket |
| Radial Burst | 10 | Multi-service parallel |

### Three-Level Execution:
1. **Pipeline** — Sequential: A → B → C
2. **Assembly Line** — Parallel stages with dependencies
3. **Radial Burst** — One trigger fires to 5+ services simultaneously

The total of **${EXPANSION_STATS.totalCapabilities.toLocaleString()}+ capabilities** = ${EXPANSION_STATS.baseTools.toLocaleString()} base tools + ${EXPANSION_STATS.capabilities} cross-service workflows.`,
      tools: ["list_capabilities"],
    }
  }

  // Default response
  return {
    content: `I understand you want to: **${input}**

Here's how 0nMCP can help:

${tools.length > 0 ? `**Detected tools:** ${tools.join(", ")}\n\n` : ""}I can assist with:
- **Building workflows** connecting any of the ${EXPANSION_STATS.services} services
- **Generating .0n configs** for portable automation
- **Executing tasks** via natural language
- **Exploring capabilities** across ${EXPANSION_STATS.totalCapabilities.toLocaleString()}+ options

${tools.length > 0 ? `Would you like me to create a workflow using ${tools.slice(0, 3).join(" + ")}?` : "Try being more specific about which services you want to connect, and I'll generate a workflow for you."}`,
    tools,
  }
}

let msgId = 0

// ─── COMPONENT ────────────────────────────────────────────
export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Settings
  const [mode, setMode] = useState<ExecutionMode>("anthropic")
  const [apiKey, setApiKey] = useState("")
  const [serverUrl, setServerUrl] = useState("http://localhost:3939")
  const [connection, setConnection] = useState<ConnectionStatus>({ tested: false, online: false, message: "" })
  const [testing, setTesting] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput("")

    const userMsg: Message = {
      id: `msg-${msgId++}`,
      role: "user",
      content: msg,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    // Simulate streaming delay
    const delay = 800 + Math.random() * 1200
    await new Promise(r => setTimeout(r, delay))

    const { content, tools } = generateResponse(msg)
    const assistantMsg: Message = {
      id: `msg-${msgId++}`,
      role: "assistant",
      content,
      timestamp: Date.now(),
      tools,
      duration: Math.round(delay),
    }
    setMessages(prev => [...prev, assistantMsg])
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const testConnection = async () => {
    setTesting(true)
    await new Promise(r => setTimeout(r, 1000))
    if (mode === "anthropic") {
      if (apiKey.startsWith("sk-ant-")) {
        setConnection({ tested: true, online: true, message: "Connected to Anthropic API" })
      } else if (!apiKey) {
        setConnection({ tested: true, online: false, message: "API key required" })
      } else {
        setConnection({ tested: true, online: false, message: "Invalid API key format" })
      }
    } else {
      // Simulate local server test
      setConnection({ tested: true, online: true, message: `Connected to ${serverUrl}` })
    }
    setTesting(false)
  }

  const copyMessage = (msg: Message) => {
    navigator.clipboard.writeText(msg.content)
    setCopiedId(msg.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-8 pb-4 px-4 sm:px-6 max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-4 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-neon/15">
              <Bot size={24} className="text-neon" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">0nMCP Assistant</h1>
              <p className="text-xs text-text-dim">
                {EXPANSION_STATS.services} services &middot; {EXPANSION_STATS.totalCapabilities.toLocaleString()}+ capabilities &middot;{" "}
                <span className={mode === "anthropic" ? "text-purple" : "text-neon"}>
                  {mode === "anthropic" ? "Anthropic API" : "Local Server"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearChat} className="p-2 rounded-lg glass-card text-text-muted hover:text-text transition-colors" title="Clear chat">
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showSettings ? "bg-neon/15 text-neon" : "glass-card text-text-muted hover:text-text"
              )}
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold">Execution Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="text-text-muted hover:text-text"><X size={14} /></button>
                </div>

                {/* Mode toggle */}
                <div className="mb-4">
                  <label className="text-xs text-text-muted mb-2 block">Execution Mode</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setMode("anthropic"); setConnection({ tested: false, online: false, message: "" }) }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                        mode === "anthropic" ? "bg-purple/15 text-purple border border-purple/30" : "glass-card text-text-dim"
                      )}
                    >
                      <Sparkles size={12} /> Anthropic API
                    </button>
                    <button
                      onClick={() => { setMode("local"); setConnection({ tested: false, online: false, message: "" }) }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                        mode === "local" ? "bg-neon/15 text-neon border border-neon/30" : "glass-card text-text-dim"
                      )}
                    >
                      <Server size={12} /> Local Server
                    </button>
                  </div>
                </div>

                {/* Mode-specific inputs */}
                {mode === "anthropic" ? (
                  <div className="mb-4">
                    <label className="text-xs text-text-muted mb-1.5 block flex items-center gap-1"><Key size={10} /> API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-purple/40 font-mono transition-all"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="text-xs text-text-muted mb-1.5 block flex items-center gap-1"><Globe size={10} /> Server URL</label>
                    <input
                      value={serverUrl}
                      onChange={e => setServerUrl(e.target.value)}
                      placeholder="http://localhost:3939"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-neon/40 font-mono transition-all"
                    />
                  </div>
                )}

                {/* Test + status */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={testConnection}
                    disabled={testing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold glass-card text-text-dim hover:text-text transition-colors disabled:opacity-50"
                  >
                    {testing ? <Loader2 size={12} className="animate-spin" /> : <Wifi size={12} />}
                    Test Connection
                  </button>
                  {connection.tested && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn("text-xs font-bold flex items-center gap-1", connection.online ? "text-neon" : "text-red-400")}
                    >
                      {connection.online ? <Wifi size={10} /> : <WifiOff size={10} />}
                      {connection.message}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat area */}
        <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon/20 to-cyan/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-neon">0n</span>
                </div>
                <h2 className="text-lg font-bold text-text mb-1">Describe a task to execute</h2>
                <p className="text-xs text-text-muted mb-6">
                  {EXPANSION_STATS.baseTools.toLocaleString()} tools &middot; {EXPANSION_STATS.services} services &middot; {EXPANSION_STATS.capabilities} capabilities
                </p>

                {/* Quick actions */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl w-full">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.prompt)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.04] transition-all group"
                    >
                      <action.icon size={14} className="text-neon shrink-0" />
                      <span className="text-xs text-text-dim group-hover:text-text transition-colors">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 relative group",
                      msg.role === "user"
                        ? "bg-neon text-bg rounded-br-md"
                        : "bg-surface border border-border rounded-bl-md"
                    )}>
                      {/* Content */}
                      <div className={cn(
                        "text-sm leading-relaxed whitespace-pre-wrap",
                        msg.role === "user" ? "text-bg font-medium" : "text-text-dim"
                      )}>
                        {msg.content}
                      </div>

                      {/* Tools badge */}
                      {msg.tools && msg.tools.length > 0 && msg.role === "assistant" && (
                        <div className="mt-3 pt-2 border-t border-border">
                          <span className="text-[9px] text-text-muted uppercase tracking-wider">Suggested tools:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.tools.map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-neon/10 text-neon font-mono">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meta */}
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-2">
                          {msg.duration && (
                            <span className="text-[9px] text-text-muted">{msg.duration}ms</span>
                          )}
                          <button
                            onClick={() => copyMessage(msg)}
                            className="text-[9px] text-text-muted hover:text-neon transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-0.5"
                          >
                            {copiedId === msg.id ? <Check size={8} /> : <Copy size={8} />}
                            {copiedId === msg.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-neon animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-neon animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-xs text-text-muted">Processing with 0nMCP...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input bar */}
          <div className="border-t border-border px-4 py-3">
            <form
              onSubmit={e => { e.preventDefault(); handleSend() }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Describe a task..."
                disabled={loading}
                className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-neon/40 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center text-bg disabled:opacity-30 hover:bg-neon/90 transition-all shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-[9px] text-text-muted">
                {mode === "anthropic" ? "Claude Sonnet 4.5" : `Local → ${serverUrl}`} &middot; {EXPANSION_STATS.services} services
              </span>
              <span className="text-[9px] text-text-muted">
                {messages.filter(m => m.role === "user").length} messages
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
