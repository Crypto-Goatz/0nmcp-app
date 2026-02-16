"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart3, Copy, Check, ArrowLeft, Shield, Eye,
  Zap, Globe, Code, Smartphone, ShoppingCart, Terminal
} from "lucide-react"
import Nav from "@/components/Nav"
import { cn } from "@/lib/utils"

type ConsentMode = "gdpr" | "ccpa" | "essential" | "disabled"

const CONSENT_MODES: { id: ConsentMode; label: string; desc: string; icon: typeof Shield }[] = [
  { id: "gdpr", label: "GDPR", desc: "Shows consent banner. No data until accepted. EU/UK compliant.", icon: Shield },
  { id: "ccpa", label: "CCPA", desc: "Full tracking by default. Honors GPC signal. California compliant.", icon: Eye },
  { id: "essential", label: "Essential", desc: "No consent banner. Anonymous aggregate metrics only.", icon: Zap },
  { id: "disabled", label: "Disabled", desc: "Full tracking, no consent. Internal use only.", icon: Terminal },
]

const PLATFORMS = [
  { id: "html", label: "HTML", icon: Code },
  { id: "react", label: "Next.js / React", icon: Globe },
  { id: "wordpress", label: "WordPress", icon: Globe },
  { id: "shopify", label: "Shopify", icon: ShoppingCart },
  { id: "crm", label: "CRM", icon: Smartphone },
  { id: "gtm", label: "Google Tag Manager", icon: Code },
]

const METRICS = [
  { consent: "Granted", count: 147, desc: "Full behavioral tracking" },
  { consent: "Denied", count: 23, desc: "Aggregate metrics only" },
  { consent: "Essential", count: 19, desc: "Performance only" },
  { consent: "Pending", count: 0, desc: "Waiting for decision" },
]

function generateCode(apiKey: string, consent: ConsentMode, platform: string): string {
  const key = apiKey || "YOUR_API_KEY"

  if (platform === "react") {
    return `// app/layout.tsx
import Script from 'next/script'

<Script
  src="https://cdn.cro9.app/tracker.min.js"
  data-api-key="${key}"
  data-consent-mode="${consent}"
  strategy="afterInteractive"
/>`
  }

  if (platform === "wordpress") {
    return `<?php if (!is_admin()): ?>
<script
  src="https://cdn.cro9.app/tracker.min.js"
  data-api-key="${key}"
  data-consent-mode="${consent}">
</script>
<?php endif; ?>`
  }

  if (platform === "shopify") {
    return `<!-- theme.liquid before </body> -->
<script
  src="https://cdn.cro9.app/tracker.min.js"
  data-api-key="{{ shop.metafields.cro9.api_key }}"
  data-consent-mode="${consent}">
</script>`
  }

  if (platform === "crm") {
    return `<!-- Settings → Tracking Code → Footer -->
<script
  src="https://cdn.cro9.app/tracker.min.js"
  data-api-key="{{location.custom_values.cro9_api_key}}"
  data-consent-mode="${consent}">
</script>`
  }

  if (platform === "gtm") {
    return `<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.cro9.app/tracker.min.js';
  s.setAttribute('data-api-key', '${key}');
  s.setAttribute('data-consent-mode', '${consent}');
  document.body.appendChild(s);
})();
</script>`
  }

  // HTML default
  return `<script
  src="https://cdn.cro9.app/tracker.min.js"
  data-api-key="${key}"
  data-endpoint="https://api.cro9.app/collect"
  data-consent-mode="${consent}">
</script>`
}

export default function CRO9Page() {
  const [apiKey, setApiKey] = useState("")
  const [consent, setConsent] = useState<ConsentMode>("gdpr")
  const [platform, setPlatform] = useState("html")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"install" | "api" | "metrics">("install")

  const code = generateCode(apiKey, consent, platform)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <Link href="/apps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text mb-6 transition-colors">
          <ArrowLeft size={12} /> All Apps
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-orange/15">
            <BarChart3 size={28} className="text-orange" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">CRO9</h1>
            <p className="text-sm text-text-dim">Behavioral Tracker — 147 metrics, GDPR/CCPA compliant, one-line install</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {METRICS.map(m => (
            <div key={m.consent} className="glass-card rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-orange">{m.count}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{m.consent}</div>
              <div className="text-[9px] text-text-muted mt-0.5">{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "install" as const, label: "Installation" },
            { id: "api" as const, label: "JavaScript API" },
            { id: "metrics" as const, label: "Metrics" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "text-xs font-bold px-4 py-2 rounded-lg transition-all",
                activeTab === tab.id ? "bg-orange/15 text-orange" : "glass-card text-text-dim hover:text-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "install" && (
          <div className="space-y-6">
            {/* API Key */}
            <div className="glass-card rounded-xl p-5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">API Key</label>
              <input
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your CRO9 API key..."
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-orange/40 transition-all font-mono"
              />
            </div>

            {/* Consent Mode */}
            <div className="glass-card rounded-xl p-5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 block">Consent Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {CONSENT_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setConsent(mode.id)}
                    className={cn(
                      "text-left rounded-xl p-3 transition-all",
                      consent === mode.id ? "bg-orange/10 border border-orange/30" : "glass-card hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <mode.icon size={12} className={consent === mode.id ? "text-orange" : "text-text-muted"} />
                      <span className={cn("text-xs font-bold", consent === mode.id ? "text-orange" : "text-text-dim")}>{mode.label}</span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-tight">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="glass-card rounded-xl p-5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 block">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      platform === p.id ? "bg-orange/15 text-orange" : "glass-card text-text-dim hover:text-text"
                    )}
                  >
                    <p.icon size={12} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Code */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Installation Code</span>
                <button onClick={copyCode} className="flex items-center gap-1 text-xs font-bold text-orange hover:text-text transition-colors">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-5 text-sm font-mono text-neon leading-relaxed overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-4">
            {[
              { title: "Track Custom Events", code: `CRO9.track('button_click', {\n  buttonId: 'pricing-cta',\n  variant: 'A'\n});` },
              { title: "Identify Users", code: `CRO9.identify('user_123', {\n  email: 'user@example.com',\n  plan: 'pro'\n});` },
              { title: "Consent Management", code: `CRO9.showConsentBanner();\nconst status = CRO9.getConsentStatus();\n// 'granted' | 'denied' | 'essential' | 'pending'` },
              { title: "Exit Intent Hook", code: `window.addEventListener('cro9:exitIntent', () => {\n  showExitPopup();\n});` },
              { title: "Consent Change Hook", code: `window.addEventListener('cro9:consent', (e) => {\n  if (e.detail.status === 'granted') {\n    initFacebookPixel();\n    initGoogleAnalytics();\n  }\n});` },
            ].map(item => (
              <div key={item.title} className="glass-card rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border">
                  <span className="text-xs font-bold text-text">{item.title}</span>
                </div>
                <pre className="p-5 text-sm font-mono text-cyan leading-relaxed overflow-x-auto">
                  <code>{item.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-bold mb-4">What CRO9 Tracks</h3>
            <div className="space-y-4">
              {[
                { category: "Engagement", metrics: ["Time on page", "Scroll depth", "Click heatmaps", "Rage clicks", "Dead clicks", "Form interactions", "Hover patterns", "Attention zones"], color: "#00ff88" },
                { category: "Navigation", metrics: ["Page flow", "Exit pages", "Bounce rate", "Session depth", "Return visits", "Entry sources", "Cross-page journeys"], color: "#00d4ff" },
                { category: "Performance", metrics: ["Core Web Vitals (LCP, FID, CLS)", "TTFB", "First paint", "DOM load", "Resource timing", "Error rate"], color: "#ff6b35" },
                { category: "Conversion", metrics: ["Funnel progression", "Cart abandonment", "Form completion", "CTA clicks", "A/B variant tracking", "Revenue attribution"], color: "#9945ff" },
                { category: "Behavioral", metrics: ["Exit intent detection", "Copy-paste tracking", "Tab switching", "Device orientation", "Network speed", "Browser capabilities"], color: "#ff3d9a" },
              ].map(cat => (
                <div key={cat.category}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.category}</span>
                    <span className="text-[10px] text-text-muted">({cat.metrics.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-5">
                    {cat.metrics.map(m => (
                      <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-dim">{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
