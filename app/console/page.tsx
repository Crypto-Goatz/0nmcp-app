"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Terminal, Zap, CheckCircle2, XCircle, Loader2,
  Sparkles, Server, ChevronRight, Clock, Copy, Check
} from "lucide-react"
import Nav from "@/components/Nav"
import { useServerHealth } from "@/components/ServerStatus"
import { STATS, SERVICES } from "@/lib/catalog"

interface Message {
  id: string
  role: "user" | "system"
  text: string
  source?: "0nmcp" | "local"
  status?: "completed" | "failed" | "loading"
  steps?: number
  services?: string[]
  duration?: number
  timestamp: number
}

const SUGGESTIONS = [
  "Send an email via SendGrid to hello@example.com",
  "Create a Stripe customer for John Doe",
  "List all GitHub repos for 0nork",
  "Schedule a Zoom meeting for tomorrow at 2pm",
  "Create a contact in the CRM with name Jane Smith",
  "Post a message to Slack #general channel",
  "Generate an image with DALL-E of a neon circuit board",
  "List all Shopify products with inventory below 10",
]

export default function ConsolePage() {
  const health = useServerHealth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      text: `Welcome to the 0nMCP Console. ${STATS.tools} tools across ${STATS.services} services are ready. Type a natural language command to execute anything.`,
      source: "local",
      status: "completed",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const messagesEnd = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async (text?: string) => {
    const task = text || input.trim()
    if (!task || sending) return
    setInput("")
    setSending(true)

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: task,
      timestamp: Date.now(),
    }

    const loadingMsg: Message = {
      id: crypto.randomUUID(),
      role: "system",
      text: "Executing...",
      status: "loading",
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg, loadingMsg])

    try {
      const start = Date.now()
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      })
      const data = await res.json()
      const duration = Date.now() - start

      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? {
                ...m,
                text: data.result || data.output || data.error || "Execution complete",
                status: data.error ? "failed" : "completed",
                source: data.source || (res.ok ? "0nmcp" : "local"),
                steps: data.steps,
                services: data.services,
                duration,
              }
            : m
        )
      )
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? {
                ...m,
                text: "0nMCP server is offline. Start it with: npx 0nmcp serve --port 3001",
                status: "failed",
                source: "local",
              }
            : m
        )
      )
    }

    setSending(false)
    inputRef.current?.focus()
  }

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex flex-col pt-16 max-w-5xl mx-auto w-full px-4 sm:px-6">
        {/* Status bar */}
        <div className="flex items-center justify-between py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Terminal size={20} className="text-neon" />
            <h1 className="text-xl font-black tracking-tight">Console</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              health.online ? "bg-neon/10 text-neon" : "bg-red/10 text-red"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${health.online ? "bg-neon animate-pulse" : "bg-red"}`} />
              {health.online ? "Connected" : "Offline"}
            </div>
            <span className="text-xs text-text-muted">{STATS.tools} tools</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 min-h-0" style={{ maxHeight: "calc(100vh - 220px)" }}>
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-neon/10 border border-neon/20"
                    : "glass-card"
                }`}>
                  {/* Message header */}
                  {msg.role === "system" && msg.status !== "loading" && (
                    <div className="flex items-center gap-2 mb-1.5 text-[10px] uppercase tracking-wider text-text-muted">
                      {msg.status === "completed" ? (
                        <CheckCircle2 size={10} className="text-neon" />
                      ) : msg.status === "failed" ? (
                        <XCircle size={10} className="text-red" />
                      ) : null}
                      {msg.source === "0nmcp" && <span className="text-neon font-bold">0nMCP</span>}
                      {msg.duration && <span>{msg.duration}ms</span>}
                      {msg.steps && <span>{msg.steps} steps</span>}
                    </div>
                  )}

                  {/* Loading state */}
                  {msg.status === "loading" ? (
                    <div className="flex items-center gap-2 text-text-dim">
                      <Loader2 size={14} className="animate-spin text-cyan" />
                      <span className="text-sm">Executing across {STATS.services} services...</span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Services used */}
                  {msg.services && msg.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {msg.services.map(s => {
                        const svc = SERVICES.find(sv => sv.id === s)
                        return (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">
                            {svc?.name || s}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* Copy button */}
                  {msg.role === "system" && msg.status !== "loading" && (
                    <button
                      onClick={() => copyText(msg.id, msg.text)}
                      className="mt-2 flex items-center gap-1 text-[10px] text-text-muted hover:text-text transition-colors"
                    >
                      {copied === msg.id ? <Check size={10} /> : <Copy size={10} />}
                      {copied === msg.id ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEnd} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="pb-3">
            <p className="text-xs text-text-muted mb-2">Try something:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full glass-card text-text-dim hover:text-text hover:bg-white/[0.06] transition-all"
                >
                  <ChevronRight size={10} className="inline mr-1" />
                  {s.length > 45 ? s.slice(0, 45) + "..." : s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="py-4 border-t border-border">
          <form
            onSubmit={e => { e.preventDefault(); send() }}
            className="flex items-center gap-3"
          >
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={health.online ? "Describe what you want to do..." : "0nMCP offline — start with: npx 0nmcp serve"}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all"
                disabled={sending}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {health.online && (
                  <span className="text-[10px] text-neon/60 hidden sm:inline">
                    {STATS.tools} tools ready
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-neon to-cyan text-bg disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-neon/20 transition-all"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
