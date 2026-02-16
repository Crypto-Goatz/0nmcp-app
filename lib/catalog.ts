/**
 * 0nMCP Catalog — Source of Truth (v1.7.0)
 * 550 tools, 26 services, 13 categories
 */

export interface Service {
  id: string
  name: string
  category: string
  description: string
  tools: number
  actions: number
  triggers: number
  color: string
  icon: string
}

export interface Category {
  id: string
  label: string
  icon: string
  color: string
}

export const CATEGORIES: Category[] = [
  { id: "payments", label: "Payments", icon: "credit-card", color: "#00ff88" },
  { id: "email", label: "Email", icon: "mail", color: "#ff6b35" },
  { id: "sms", label: "SMS", icon: "smartphone", color: "#00d4ff" },
  { id: "communication", label: "Communication", icon: "message-circle", color: "#9945ff" },
  { id: "ai", label: "AI", icon: "sparkles", color: "#ff3d9a" },
  { id: "database", label: "Database", icon: "database", color: "#00ff88" },
  { id: "code", label: "Code", icon: "code", color: "#f0f0ff" },
  { id: "project", label: "Project Mgmt", icon: "kanban", color: "#5E6AD2" },
  { id: "ecommerce", label: "E-Commerce", icon: "shopping-cart", color: "#96BF47" },
  { id: "crm", label: "CRM", icon: "users", color: "#ff6b35" },
  { id: "scheduling", label: "Scheduling", icon: "calendar", color: "#006BFF" },
  { id: "storage", label: "Storage", icon: "hard-drive", color: "#00d4ff" },
  { id: "support", label: "Support", icon: "headphones", color: "#03363D" },
]

export const SERVICES: Service[] = [
  { id: "stripe", name: "Stripe", category: "payments", description: "Payment processing, customers, subscriptions, invoices", tools: 16, actions: 3, triggers: 5, color: "#635BFF", icon: "stripe" },
  { id: "sendgrid", name: "SendGrid", category: "email", description: "Transactional email, templates, campaigns", tools: 8, actions: 2, triggers: 4, color: "#1A82E2", icon: "sendgrid" },
  { id: "resend", name: "Resend", category: "email", description: "Modern email API for developers", tools: 6, actions: 2, triggers: 2, color: "#000000", icon: "resend" },
  { id: "gmail", name: "Gmail", category: "email", description: "Google email via OAuth", tools: 8, actions: 2, triggers: 3, color: "#EA4335", icon: "gmail" },
  { id: "twilio", name: "Twilio", category: "sms", description: "SMS, voice, WhatsApp messaging", tools: 8, actions: 2, triggers: 3, color: "#F22F46", icon: "twilio" },
  { id: "slack", name: "Slack", category: "communication", description: "Team messaging, channels, notifications", tools: 10, actions: 2, triggers: 3, color: "#4A154B", icon: "slack" },
  { id: "discord", name: "Discord", category: "communication", description: "Community messaging, webhooks, bots", tools: 10, actions: 2, triggers: 2, color: "#5865F2", icon: "discord" },
  { id: "zoom", name: "Zoom", category: "communication", description: "Video conferencing, meetings, webinars", tools: 8, actions: 2, triggers: 3, color: "#2D8CFF", icon: "zoom" },
  { id: "teams", name: "MS Teams", category: "communication", description: "Microsoft 365 team collaboration", tools: 8, actions: 2, triggers: 2, color: "#6264A7", icon: "teams" },
  { id: "openai", name: "OpenAI", category: "ai", description: "GPT, DALL-E, Whisper, embeddings", tools: 10, actions: 3, triggers: 2, color: "#10A37F", icon: "openai" },
  { id: "airtable", name: "Airtable", category: "database", description: "Spreadsheet-database hybrid", tools: 9, actions: 2, triggers: 2, color: "#18BFFF", icon: "airtable" },
  { id: "notion", name: "Notion", category: "database", description: "Pages, databases, blocks, wiki", tools: 9, actions: 2, triggers: 3, color: "#000000", icon: "notion" },
  { id: "supabase", name: "Supabase", category: "database", description: "PostgreSQL, auth, realtime, edge functions", tools: 10, actions: 2, triggers: 4, color: "#3ECF8E", icon: "supabase" },
  { id: "sheets", name: "Google Sheets", category: "database", description: "Spreadsheet CRUD and formulas", tools: 8, actions: 2, triggers: 2, color: "#34A853", icon: "sheets" },
  { id: "mongodb", name: "MongoDB", category: "database", description: "Document database, Atlas, aggregations", tools: 8, actions: 2, triggers: 2, color: "#47A248", icon: "mongodb" },
  { id: "github", name: "GitHub", category: "code", description: "Repos, PRs, issues, actions, releases", tools: 14, actions: 2, triggers: 6, color: "#f0f0ff", icon: "github" },
  { id: "linear", name: "Linear", category: "project", description: "Issues, cycles, projects, roadmaps", tools: 8, actions: 2, triggers: 3, color: "#5E6AD2", icon: "linear" },
  { id: "jira", name: "Jira", category: "project", description: "Issues, sprints, boards, Atlassian suite", tools: 8, actions: 2, triggers: 3, color: "#0052CC", icon: "jira" },
  { id: "shopify", name: "Shopify", category: "ecommerce", description: "Products, orders, inventory, customers", tools: 12, actions: 3, triggers: 5, color: "#96BF47", icon: "shopify" },
  { id: "hubspot", name: "HubSpot", category: "crm", description: "Contacts, deals, companies, marketing", tools: 12, actions: 3, triggers: 4, color: "#FF7A59", icon: "hubspot" },
  { id: "crm", name: "Rocket CRM", category: "crm", description: "Contacts, opportunities, calendars, social, invoices, objects — 245 tools across 12 modules", tools: 245, actions: 3, triggers: 5, color: "#ff6b35", icon: "rocket" },
  { id: "calendly", name: "Calendly", category: "scheduling", description: "Events, bookings, availability", tools: 6, actions: 2, triggers: 3, color: "#006BFF", icon: "calendly" },
  { id: "gcal", name: "Google Calendar", category: "scheduling", description: "Events, reminders, scheduling", tools: 8, actions: 2, triggers: 3, color: "#4285F4", icon: "gcal" },
  { id: "gdrive", name: "Google Drive", category: "storage", description: "Files, folders, sharing, search", tools: 8, actions: 2, triggers: 2, color: "#4285F4", icon: "gdrive" },
  { id: "onedrive", name: "OneDrive", category: "storage", description: "Microsoft cloud file storage", tools: 6, actions: 1, triggers: 2, color: "#0078D4", icon: "onedrive" },
  { id: "zendesk", name: "Zendesk", category: "support", description: "Tickets, customers, knowledge base", tools: 8, actions: 2, triggers: 3, color: "#03363D", icon: "zendesk" },
]

// Computed stats
export const STATS = {
  services: SERVICES.length,
  tools: SERVICES.reduce((s, v) => s + v.tools, 0),
  actions: SERVICES.reduce((s, v) => s + v.actions, 0),
  triggers: SERVICES.reduce((s, v) => s + v.triggers, 0),
  categories: CATEGORIES.length,
  get total() { return this.tools + this.actions + this.triggers },
  version: "1.7.0",
}

// Pre-built skills (from SkillForge)
export interface Skill {
  id: string
  name: string
  description: string
  services: string[]
  category: string
  level: 1 | 2 | 3
}

export const SKILLS: Skill[] = [
  { id: "lead-qualifier", name: "Lead Qualifier Pro", description: "AI-powered lead scoring with enrichment and automatic routing", services: ["crm", "openai"], category: "sales", level: 2 },
  { id: "proposal-gen", name: "Proposal Generator", description: "Auto-generate proposals from opportunity data with AI", services: ["crm", "openai", "gdrive"], category: "sales", level: 2 },
  { id: "content-loop", name: "Content Loop Pro", description: "Blog posts + coordinated social media campaigns", services: ["openai", "crm"], category: "marketing", level: 3 },
  { id: "invoice-notify", name: "Invoice Notifier", description: "Create Stripe invoices and notify via Slack", services: ["stripe", "slack"], category: "billing", level: 1 },
  { id: "support-router", name: "Support Router", description: "AI-triage support tickets and route to right team", services: ["zendesk", "openai", "slack"], category: "support", level: 2 },
  { id: "order-tracker", name: "Order Tracker", description: "Track Shopify orders and notify customers via SMS", services: ["shopify", "twilio"], category: "ecommerce", level: 1 },
  { id: "meeting-prep", name: "Meeting Prep", description: "Pull contact data before meetings and create briefing", services: ["gcal", "crm", "openai"], category: "productivity", level: 2 },
  { id: "deploy-notify", name: "Deploy Notifier", description: "Watch GitHub releases and notify team on Discord", services: ["github", "discord"], category: "devops", level: 1 },
]
