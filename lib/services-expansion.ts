// 0nMCP Service Expansion — 59 services, 1,385 capabilities
// Source of truth for the "Turn it 0n" page

export type ServiceStatus = "live" | "federate"

export interface ExpandedService {
  id: string
  name: string
  tools: number
  status: ServiceStatus
  adapter: string
  section: string
  sectionLabel: string
  icon?: string
  color?: string
}

export interface Capability {
  id: string
  name: string
  serviceA: string
  serviceB: string
  category: string
}

// ─── SECTIONS ─────────────────────────────────────────────
export const SECTIONS = [
  { id: "everyday", label: "Everyday Tools", desc: "What everyone uses", color: "#00ff88" },
  { id: "communication", label: "Communication & Social", desc: "Where their customers are", color: "#00d4ff" },
  { id: "email-marketing", label: "Email Marketing & Forms", desc: "How they capture and nurture leads", color: "#ff6b35" },
  { id: "payments", label: "Payments & Accounting", desc: "Where the money flows", color: "#9945ff" },
  { id: "crm-sales", label: "CRM & Sales", desc: "Where they manage relationships", color: "#ff3d9a" },
  { id: "project-mgmt", label: "Project Management", desc: "How they organize work", color: "#00ff88" },
  { id: "docs-design", label: "Documents & Design", desc: "How they create and close", color: "#00d4ff" },
  { id: "support", label: "Customer Support", desc: "How they help their customers", color: "#ff6b35" },
  { id: "websites", label: "Websites & CMS", desc: "Where their online presence lives", color: "#9945ff" },
  { id: "advertising", label: "Advertising", desc: "How they spend their ad budgets", color: "#ff3d9a" },
  { id: "ai", label: "AI & Intelligence", desc: "The brain layer", color: "#00ff88" },
  { id: "developer", label: "Developer & Database", desc: "For the builders", color: "#00d4ff" },
]

// ─── ALL 59 SERVICES ──────────────────────────────────────
export const EXPANDED_SERVICES: ExpandedService[] = [
  // Section A: Everyday Tools (8 services, 195 tools)
  { id: "gmail", name: "Gmail", tools: 28, status: "live", adapter: "gmail.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#EA4335" },
  { id: "slack", name: "Slack", tools: 32, status: "live", adapter: "slack.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#4A154B" },
  { id: "gcal", name: "Google Calendar", tools: 18, status: "live", adapter: "gcal.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#4285F4" },
  { id: "gsheets", name: "Google Sheets", tools: 22, status: "live", adapter: "gsheets.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#0F9D58" },
  { id: "gdrive", name: "Google Drive", tools: 20, status: "live", adapter: "gdrive.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#4285F4" },
  { id: "zoom", name: "Zoom", tools: 16, status: "live", adapter: "zoom.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#2D8CFF" },
  { id: "m365", name: "Microsoft 365", tools: 35, status: "live", adapter: "m365.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#D83B01" },
  { id: "notion", name: "Notion", tools: 24, status: "live", adapter: "notion.0n", section: "everyday", sectionLabel: "Everyday Tools", color: "#FFFFFF" },

  // Section B: Communication & Social (9 services, 140 tools)
  { id: "discord", name: "Discord", tools: 20, status: "live", adapter: "discord.0n", section: "communication", sectionLabel: "Communication & Social", color: "#5865F2" },
  { id: "twilio", name: "Twilio", tools: 18, status: "live", adapter: "twilio.0n", section: "communication", sectionLabel: "Communication & Social", color: "#F22F46" },
  { id: "whatsapp", name: "WhatsApp Business", tools: 14, status: "federate", adapter: "whatsapp.0n", section: "communication", sectionLabel: "Communication & Social", color: "#25D366" },
  { id: "facebook", name: "Facebook / Meta", tools: 22, status: "federate", adapter: "facebook.0n", section: "communication", sectionLabel: "Communication & Social", color: "#1877F2" },
  { id: "instagram", name: "Instagram", tools: 16, status: "federate", adapter: "instagram.0n", section: "communication", sectionLabel: "Communication & Social", color: "#E4405F" },
  { id: "linkedin", name: "LinkedIn", tools: 14, status: "federate", adapter: "linkedin.0n", section: "communication", sectionLabel: "Communication & Social", color: "#0A66C2" },
  { id: "x-twitter", name: "X (Twitter)", tools: 16, status: "federate", adapter: "x-twitter.0n", section: "communication", sectionLabel: "Communication & Social", color: "#000000" },
  { id: "tiktok", name: "TikTok", tools: 10, status: "federate", adapter: "tiktok.0n", section: "communication", sectionLabel: "Communication & Social", color: "#000000" },
  { id: "pinterest", name: "Pinterest", tools: 10, status: "federate", adapter: "pinterest.0n", section: "communication", sectionLabel: "Communication & Social", color: "#E60023" },

  // Section C: Email Marketing & Forms (6 services, 78 tools)
  { id: "mailchimp", name: "Mailchimp", tools: 20, status: "live", adapter: "mailchimp.0n", section: "email-marketing", sectionLabel: "Email Marketing & Forms", color: "#FFE01B" },
  { id: "sendgrid", name: "SendGrid", tools: 14, status: "live", adapter: "sendgrid.0n", section: "email-marketing", sectionLabel: "Email Marketing & Forms", color: "#1A82E2" },
  { id: "resend", name: "Resend", tools: 10, status: "live", adapter: "resend.0n", section: "email-marketing", sectionLabel: "Email Marketing & Forms", color: "#000000" },
  { id: "typeform", name: "Typeform", tools: 12, status: "federate", adapter: "typeform.0n", section: "email-marketing", sectionLabel: "Email Marketing & Forms", color: "#262627" },
  { id: "google-forms", name: "Google Forms", tools: 10, status: "federate", adapter: "google-forms.0n", section: "email-marketing", sectionLabel: "Email Marketing & Forms", color: "#7248B9" },
  { id: "jotform", name: "JotForm", tools: 12, status: "federate", adapter: "jotform.0n", section: "email-marketing", sectionLabel: "Email Marketing & Forms", color: "#0A1551" },

  // Section D: Payments & Accounting (6 services, 112 tools)
  { id: "stripe", name: "Stripe", tools: 30, status: "live", adapter: "stripe.0n", section: "payments", sectionLabel: "Payments & Accounting", color: "#635BFF" },
  { id: "shopify", name: "Shopify", tools: 22, status: "live", adapter: "shopify.0n", section: "payments", sectionLabel: "Payments & Accounting", color: "#96BF48" },
  { id: "quickbooks", name: "QuickBooks", tools: 18, status: "federate", adapter: "quickbooks.0n", section: "payments", sectionLabel: "Payments & Accounting", color: "#2CA01C" },
  { id: "xero", name: "Xero", tools: 16, status: "federate", adapter: "xero.0n", section: "payments", sectionLabel: "Payments & Accounting", color: "#13B5EA" },
  { id: "square", name: "Square", tools: 14, status: "federate", adapter: "square.0n", section: "payments", sectionLabel: "Payments & Accounting", color: "#006AFF" },
  { id: "freshbooks", name: "FreshBooks", tools: 12, status: "federate", adapter: "freshbooks.0n", section: "payments", sectionLabel: "Payments & Accounting", color: "#0075DD" },

  // Section E: CRM & Sales (4 services, 326 tools)
  { id: "crm", name: "0nMCP CRM", tools: 245, status: "live", adapter: "crm.0n", section: "crm-sales", sectionLabel: "CRM & Sales", color: "#ff6b35" },
  { id: "hubspot", name: "HubSpot", tools: 28, status: "live", adapter: "hubspot.0n", section: "crm-sales", sectionLabel: "CRM & Sales", color: "#FF5C35" },
  { id: "salesforce", name: "Salesforce", tools: 35, status: "federate", adapter: "salesforce.0n", section: "crm-sales", sectionLabel: "CRM & Sales", color: "#00A1E0" },
  { id: "pipedrive", name: "Pipedrive", tools: 18, status: "federate", adapter: "pipedrive.0n", section: "crm-sales", sectionLabel: "CRM & Sales", color: "#017737" },

  // Section F: Project Management (8 services, 122 tools)
  { id: "trello", name: "Trello", tools: 18, status: "federate", adapter: "trello.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#0079BF" },
  { id: "asana", name: "Asana", tools: 16, status: "federate", adapter: "asana.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#F06A6A" },
  { id: "monday", name: "Monday.com", tools: 16, status: "federate", adapter: "monday.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#FF3D57" },
  { id: "clickup", name: "ClickUp", tools: 18, status: "federate", adapter: "clickup.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#7B68EE" },
  { id: "airtable", name: "Airtable", tools: 20, status: "live", adapter: "airtable.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#18BFFF" },
  { id: "calendly", name: "Calendly", tools: 12, status: "live", adapter: "calendly.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#006BFF" },
  { id: "google-tasks", name: "Google Tasks", tools: 10, status: "federate", adapter: "gtasks.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#4285F4" },
  { id: "todoist", name: "Todoist", tools: 12, status: "federate", adapter: "todoist.0n", section: "project-mgmt", sectionLabel: "Project Management", color: "#E44332" },

  // Section G: Documents & Design (3 services, 40 tools)
  { id: "canva", name: "Canva", tools: 14, status: "federate", adapter: "canva.0n", section: "docs-design", sectionLabel: "Documents & Design", color: "#00C4CC" },
  { id: "docusign", name: "DocuSign", tools: 12, status: "federate", adapter: "docusign.0n", section: "docs-design", sectionLabel: "Documents & Design", color: "#FFD700" },
  { id: "dropbox", name: "Dropbox", tools: 14, status: "federate", adapter: "dropbox.0n", section: "docs-design", sectionLabel: "Documents & Design", color: "#0061FF" },

  // Section H: Customer Support (3 services, 46 tools)
  { id: "zendesk", name: "Zendesk", tools: 18, status: "live", adapter: "zendesk.0n", section: "support", sectionLabel: "Customer Support", color: "#03363D" },
  { id: "intercom", name: "Intercom", tools: 14, status: "federate", adapter: "intercom.0n", section: "support", sectionLabel: "Customer Support", color: "#6AFDEF" },
  { id: "freshdesk", name: "Freshdesk", tools: 14, status: "federate", adapter: "freshdesk.0n", section: "support", sectionLabel: "Customer Support", color: "#2C9CDB" },

  // Section I: Websites & CMS (3 services, 42 tools)
  { id: "wordpress", name: "WordPress", tools: 18, status: "federate", adapter: "wordpress.0n", section: "websites", sectionLabel: "Websites & CMS", color: "#21759B" },
  { id: "webflow", name: "Webflow", tools: 14, status: "federate", adapter: "webflow.0n", section: "websites", sectionLabel: "Websites & CMS", color: "#4353FF" },
  { id: "wix", name: "Wix", tools: 10, status: "federate", adapter: "wix.0n", section: "websites", sectionLabel: "Websites & CMS", color: "#0C6EFC" },

  // Section J: Advertising (2 services, 30 tools)
  { id: "google-ads", name: "Google Ads", tools: 16, status: "federate", adapter: "google-ads.0n", section: "advertising", sectionLabel: "Advertising", color: "#4285F4" },
  { id: "facebook-ads", name: "Facebook Ads", tools: 14, status: "federate", adapter: "fb-ads.0n", section: "advertising", sectionLabel: "Advertising", color: "#1877F2" },

  // Section K: AI & Intelligence (2 services, 30 tools)
  { id: "openai", name: "OpenAI", tools: 16, status: "live", adapter: "openai.0n", section: "ai", sectionLabel: "AI & Intelligence", color: "#412991" },
  { id: "anthropic", name: "Anthropic (Claude)", tools: 14, status: "live", adapter: "anthropic.0n", section: "ai", sectionLabel: "AI & Intelligence", color: "#D97757" },

  // Section L: Developer & Database (5 services, 98 tools)
  { id: "github", name: "GitHub", tools: 28, status: "live", adapter: "github.0n", section: "developer", sectionLabel: "Developer & Database", color: "#FFFFFF" },
  { id: "supabase", name: "Supabase", tools: 22, status: "live", adapter: "supabase.0n", section: "developer", sectionLabel: "Developer & Database", color: "#3ECF8E" },
  { id: "mongodb", name: "MongoDB", tools: 16, status: "live", adapter: "mongodb.0n", section: "developer", sectionLabel: "Developer & Database", color: "#47A248" },
  { id: "linear", name: "Linear", tools: 14, status: "live", adapter: "linear.0n", section: "developer", sectionLabel: "Developer & Database", color: "#5E6AD2" },
  { id: "jira", name: "Jira", tools: 18, status: "live", adapter: "jira.0n", section: "developer", sectionLabel: "Developer & Database", color: "#0052CC" },
]

// ─── 126 CROSS-SERVICE CAPABILITIES ──────────────────────
export const CAPABILITIES: Capability[] = [
  // Form → Everything (15)
  { id: "CAP-001", name: "Form submitted → Add lead to CRM", serviceA: "typeform", serviceB: "crm", category: "Form Automations" },
  { id: "CAP-002", name: "Form submitted → Send welcome email", serviceA: "google-forms", serviceB: "gmail", category: "Form Automations" },
  { id: "CAP-003", name: "Form submitted → Notify team on Slack", serviceA: "typeform", serviceB: "slack", category: "Form Automations" },
  { id: "CAP-004", name: "Form submitted → Create CRM deal", serviceA: "jotform", serviceB: "hubspot", category: "Form Automations" },
  { id: "CAP-005", name: "Form submitted → Schedule a meeting", serviceA: "typeform", serviceB: "calendly", category: "Form Automations" },
  { id: "CAP-006", name: "Form submitted → Add to email list", serviceA: "google-forms", serviceB: "mailchimp", category: "Form Automations" },
  { id: "CAP-007", name: "Form submitted → Create invoice", serviceA: "typeform", serviceB: "stripe", category: "Form Automations" },
  { id: "CAP-008", name: "Form submitted → Create Trello card", serviceA: "jotform", serviceB: "trello", category: "Form Automations" },
  { id: "CAP-009", name: "Form submitted → Create Asana task", serviceA: "typeform", serviceB: "asana", category: "Form Automations" },
  { id: "CAP-010", name: "Form submitted → Send SMS confirmation", serviceA: "google-forms", serviceB: "twilio", category: "Form Automations" },
  { id: "CAP-011", name: "Form submitted → Add row to Sheets", serviceA: "typeform", serviceB: "gsheets", category: "Form Automations" },
  { id: "CAP-012", name: "Form submitted → Create Notion page", serviceA: "jotform", serviceB: "notion", category: "Form Automations" },
  { id: "CAP-013", name: "Form submitted → Send WhatsApp msg", serviceA: "typeform", serviceB: "whatsapp", category: "Form Automations" },
  { id: "CAP-014", name: "Form submitted → Create Salesforce lead", serviceA: "google-forms", serviceB: "salesforce", category: "Form Automations" },
  { id: "CAP-015", name: "Form submitted → Add to Pipedrive", serviceA: "jotform", serviceB: "pipedrive", category: "Form Automations" },

  // CRM → Everything (15)
  { id: "CAP-016", name: "New lead → Send welcome email", serviceA: "crm", serviceB: "gmail", category: "CRM Automations" },
  { id: "CAP-017", name: "Deal closed → Create invoice", serviceA: "crm", serviceB: "stripe", category: "CRM Automations" },
  { id: "CAP-018", name: "Deal closed → Notify team on Slack", serviceA: "crm", serviceB: "slack", category: "CRM Automations" },
  { id: "CAP-019", name: "Deal closed → Log to Google Sheets", serviceA: "crm", serviceB: "gsheets", category: "CRM Automations" },
  { id: "CAP-020", name: "Lead created → Send SMS", serviceA: "crm", serviceB: "twilio", category: "CRM Automations" },
  { id: "CAP-021", name: "Deal closed → QuickBooks invoice", serviceA: "crm", serviceB: "quickbooks", category: "CRM Automations" },
  { id: "CAP-022", name: "New contact → Add to Mailchimp", serviceA: "crm", serviceB: "mailchimp", category: "CRM Automations" },
  { id: "CAP-023", name: "Lead status change → Update Notion", serviceA: "crm", serviceB: "notion", category: "CRM Automations" },
  { id: "CAP-024", name: "Deal won → WhatsApp confirmation", serviceA: "crm", serviceB: "whatsapp", category: "CRM Automations" },
  { id: "CAP-025", name: "Contact updated → Sync to HubSpot", serviceA: "crm", serviceB: "hubspot", category: "CRM Automations" },
  { id: "CAP-026", name: "Lead assigned → Create Trello card", serviceA: "crm", serviceB: "trello", category: "CRM Automations" },
  { id: "CAP-027", name: "Deal closes → Send DocuSign contract", serviceA: "crm", serviceB: "docusign", category: "CRM Automations" },
  { id: "CAP-028", name: "New lead → Post to Discord", serviceA: "crm", serviceB: "discord", category: "CRM Automations" },
  { id: "CAP-029", name: "Lead score change → Update Salesforce", serviceA: "crm", serviceB: "salesforce", category: "CRM Automations" },
  { id: "CAP-030", name: "Deal closes → Post on LinkedIn", serviceA: "crm", serviceB: "linkedin", category: "CRM Automations" },

  // Payment → Everything (12)
  { id: "CAP-031", name: "Payment received → Send receipt via Gmail", serviceA: "stripe", serviceB: "gmail", category: "Payment Automations" },
  { id: "CAP-032", name: "Payment received → Notify Slack", serviceA: "stripe", serviceB: "slack", category: "Payment Automations" },
  { id: "CAP-033", name: "Payment received → Log to Sheets", serviceA: "stripe", serviceB: "gsheets", category: "Payment Automations" },
  { id: "CAP-034", name: "Payment received → QuickBooks entry", serviceA: "stripe", serviceB: "quickbooks", category: "Payment Automations" },
  { id: "CAP-035", name: "Shopify order → Create invoice", serviceA: "shopify", serviceB: "stripe", category: "Payment Automations" },
  { id: "CAP-036", name: "Shopify order ships → Send SMS", serviceA: "shopify", serviceB: "twilio", category: "Payment Automations" },
  { id: "CAP-037", name: "Shopify order ships → WhatsApp update", serviceA: "shopify", serviceB: "whatsapp", category: "Payment Automations" },
  { id: "CAP-038", name: "Payment fails → Send dunning email", serviceA: "stripe", serviceB: "sendgrid", category: "Payment Automations" },
  { id: "CAP-039", name: "Subscription created → Add to CRM", serviceA: "stripe", serviceB: "crm", category: "Payment Automations" },
  { id: "CAP-040", name: "Square payment → Log to Xero", serviceA: "square", serviceB: "xero", category: "Payment Automations" },
  { id: "CAP-041", name: "FreshBooks invoice paid → Notify Slack", serviceA: "freshbooks", serviceB: "slack", category: "Payment Automations" },
  { id: "CAP-042", name: "Payment received → Update Airtable", serviceA: "stripe", serviceB: "airtable", category: "Payment Automations" },

  // Email Marketing → Everything (7)
  { id: "CAP-043", name: "Email opened → Update CRM lead score", serviceA: "mailchimp", serviceB: "crm", category: "Email Marketing" },
  { id: "CAP-044", name: "Email link clicked → Slack alert", serviceA: "mailchimp", serviceB: "slack", category: "Email Marketing" },
  { id: "CAP-045", name: "Unsubscribe → Update Google Sheet", serviceA: "mailchimp", serviceB: "gsheets", category: "Email Marketing" },
  { id: "CAP-046", name: "Campaign sent → Log to Notion", serviceA: "sendgrid", serviceB: "notion", category: "Email Marketing" },
  { id: "CAP-047", name: "Email bounces → Update CRM record", serviceA: "mailchimp", serviceB: "hubspot", category: "Email Marketing" },
  { id: "CAP-048", name: "New subscriber → Send SMS welcome", serviceA: "mailchimp", serviceB: "twilio", category: "Email Marketing" },
  { id: "CAP-049", name: "Tags change → Sync to Salesforce", serviceA: "mailchimp", serviceB: "salesforce", category: "Email Marketing" },

  // Social Media → Everything (13)
  { id: "CAP-050", name: "Blog published → Post to Facebook", serviceA: "wordpress", serviceB: "facebook", category: "Social Automations" },
  { id: "CAP-051", name: "Product launched → Post to Instagram", serviceA: "shopify", serviceB: "instagram", category: "Social Automations" },
  { id: "CAP-052", name: "Notion published → Post to LinkedIn", serviceA: "notion", serviceB: "linkedin", category: "Social Automations" },
  { id: "CAP-053", name: "GitHub release → Post to X", serviceA: "github", serviceB: "x-twitter", category: "Social Automations" },
  { id: "CAP-054", name: "Canva design done → Post to TikTok", serviceA: "canva", serviceB: "tiktok", category: "Social Automations" },
  { id: "CAP-055", name: "Product added → Post to Pinterest", serviceA: "shopify", serviceB: "pinterest", category: "Social Automations" },
  { id: "CAP-056", name: "FB Lead Ad → Add to CRM", serviceA: "facebook", serviceB: "crm", category: "Social Automations" },
  { id: "CAP-057", name: "FB Lead Ad → Send email", serviceA: "facebook", serviceB: "gmail", category: "Social Automations" },
  { id: "CAP-058", name: "FB Lead Ad → Notify Slack", serviceA: "facebook", serviceB: "slack", category: "Social Automations" },
  { id: "CAP-059", name: "FB Lead Ad → Add to Mailchimp", serviceA: "facebook", serviceB: "mailchimp", category: "Social Automations" },
  { id: "CAP-060", name: "Instagram DM → Create support ticket", serviceA: "instagram", serviceB: "zendesk", category: "Social Automations" },
  { id: "CAP-061", name: "LinkedIn connection → Add to CRM", serviceA: "linkedin", serviceB: "crm", category: "Social Automations" },
  { id: "CAP-062", name: "Cross-post to all social platforms", serviceA: "crm", serviceB: "facebook", category: "Social Automations" },

  // Scheduling → Everything (8)
  { id: "CAP-063", name: "Calendly booked → Add to Google Cal", serviceA: "calendly", serviceB: "gcal", category: "Scheduling" },
  { id: "CAP-064", name: "Calendly booked → Slack alert", serviceA: "calendly", serviceB: "slack", category: "Scheduling" },
  { id: "CAP-065", name: "Calendly booked → CRM activity", serviceA: "calendly", serviceB: "crm", category: "Scheduling" },
  { id: "CAP-066", name: "Zoom meeting ends → Summary email", serviceA: "zoom", serviceB: "gmail", category: "Scheduling" },
  { id: "CAP-067", name: "Zoom meeting ends → Follow-up task", serviceA: "zoom", serviceB: "trello", category: "Scheduling" },
  { id: "CAP-068", name: "Zoom scheduled → SMS reminder", serviceA: "zoom", serviceB: "twilio", category: "Scheduling" },
  { id: "CAP-069", name: "Zoom meeting ends → Notion recap", serviceA: "zoom", serviceB: "notion", category: "Scheduling" },
  { id: "CAP-070", name: "Google Cal event → WhatsApp msg", serviceA: "gcal", serviceB: "whatsapp", category: "Scheduling" },

  // Support → Everything (7)
  { id: "CAP-071", name: "Zendesk ticket → Notify Slack", serviceA: "zendesk", serviceB: "slack", category: "Support" },
  { id: "CAP-072", name: "Ticket resolved → Send survey email", serviceA: "zendesk", serviceB: "gmail", category: "Support" },
  { id: "CAP-073", name: "Intercom chat → CRM activity", serviceA: "intercom", serviceB: "crm", category: "Support" },
  { id: "CAP-074", name: "Ticket escalated → SMS alert", serviceA: "freshdesk", serviceB: "twilio", category: "Support" },
  { id: "CAP-075", name: "Billing mention → Alert Stripe", serviceA: "zendesk", serviceB: "stripe", category: "Support" },
  { id: "CAP-076", name: "Ticket closed → Update Notion KB", serviceA: "zendesk", serviceB: "notion", category: "Support" },
  { id: "CAP-077", name: "Intercom chat ends → Asana follow-up", serviceA: "intercom", serviceB: "asana", category: "Support" },

  // Project Management → Everything (8)
  { id: "CAP-078", name: "Trello card Done → Notify Slack", serviceA: "trello", serviceB: "slack", category: "Project Mgmt" },
  { id: "CAP-079", name: "Asana task done → Email update", serviceA: "asana", serviceB: "gmail", category: "Project Mgmt" },
  { id: "CAP-080", name: "Monday status change → Update Sheet", serviceA: "monday", serviceB: "gsheets", category: "Project Mgmt" },
  { id: "CAP-081", name: "ClickUp assigned → Discord alert", serviceA: "clickup", serviceB: "discord", category: "Project Mgmt" },
  { id: "CAP-082", name: "Trello card → Google Cal event", serviceA: "trello", serviceB: "gcal", category: "Project Mgmt" },
  { id: "CAP-083", name: "Asana project completes → Invoice", serviceA: "asana", serviceB: "stripe", category: "Project Mgmt" },
  { id: "CAP-084", name: "Todoist task due → SMS reminder", serviceA: "todoist", serviceB: "twilio", category: "Project Mgmt" },
  { id: "CAP-085", name: "Google Task done → Update Notion", serviceA: "google-tasks", serviceB: "notion", category: "Project Mgmt" },

  // Website → Everything (7)
  { id: "CAP-086", name: "WP post published → Share on all social", serviceA: "wordpress", serviceB: "facebook", category: "Website" },
  { id: "CAP-087", name: "WP post published → Notify email list", serviceA: "wordpress", serviceB: "mailchimp", category: "Website" },
  { id: "CAP-088", name: "WP form submitted → Add to CRM", serviceA: "wordpress", serviceB: "crm", category: "Website" },
  { id: "CAP-089", name: "Webflow form → Slack alert", serviceA: "webflow", serviceB: "slack", category: "Website" },
  { id: "CAP-090", name: "Wix order → Create Stripe invoice", serviceA: "wix", serviceB: "stripe", category: "Website" },
  { id: "CAP-091", name: "Canva design done → Post to WordPress", serviceA: "canva", serviceB: "wordpress", category: "Website" },
  { id: "CAP-092", name: "Blog published → Notion archive", serviceA: "wordpress", serviceB: "notion", category: "Website" },

  // Advertising → Everything (8)
  { id: "CAP-093", name: "Google Ads lead → Add to CRM", serviceA: "google-ads", serviceB: "crm", category: "Advertising" },
  { id: "CAP-094", name: "Google Ads lead → Slack alert", serviceA: "google-ads", serviceB: "slack", category: "Advertising" },
  { id: "CAP-095", name: "Google Ads lead → Welcome email", serviceA: "google-ads", serviceB: "gmail", category: "Advertising" },
  { id: "CAP-096", name: "FB Ad lead → Add to CRM", serviceA: "facebook-ads", serviceB: "crm", category: "Advertising" },
  { id: "CAP-097", name: "FB Ad lead → Add to Mailchimp", serviceA: "facebook-ads", serviceB: "mailchimp", category: "Advertising" },
  { id: "CAP-098", name: "FB Ad lead → Send WhatsApp", serviceA: "facebook-ads", serviceB: "whatsapp", category: "Advertising" },
  { id: "CAP-099", name: "Ad spend threshold → Slack alert", serviceA: "google-ads", serviceB: "slack", category: "Advertising" },
  { id: "CAP-100", name: "Campaign ends → Report to Sheets", serviceA: "facebook-ads", serviceB: "gsheets", category: "Advertising" },

  // Documents → Everything (6)
  { id: "CAP-101", name: "Contract signed → Create invoice", serviceA: "docusign", serviceB: "stripe", category: "Documents" },
  { id: "CAP-102", name: "Contract signed → Notify Slack", serviceA: "docusign", serviceB: "slack", category: "Documents" },
  { id: "CAP-103", name: "Contract signed → Update CRM", serviceA: "docusign", serviceB: "crm", category: "Documents" },
  { id: "CAP-104", name: "Contract signed → Add to Drive", serviceA: "docusign", serviceB: "gdrive", category: "Documents" },
  { id: "CAP-105", name: "Dropbox file added → Slack notify", serviceA: "dropbox", serviceB: "slack", category: "Documents" },
  { id: "CAP-106", name: "Dropbox file shared → Log to Sheets", serviceA: "dropbox", serviceB: "gsheets", category: "Documents" },

  // AI-Powered (10)
  { id: "CAP-107", name: "AI-draft email from support ticket", serviceA: "zendesk", serviceB: "openai", category: "AI-Powered" },
  { id: "CAP-108", name: "AI-generate social post from blog", serviceA: "wordpress", serviceB: "anthropic", category: "AI-Powered" },
  { id: "CAP-109", name: "AI-summarize meeting + action items", serviceA: "zoom", serviceB: "openai", category: "AI-Powered" },
  { id: "CAP-110", name: "AI-score lead from form data", serviceA: "typeform", serviceB: "anthropic", category: "AI-Powered" },
  { id: "CAP-111", name: "AI-write Shopify product description", serviceA: "openai", serviceB: "shopify", category: "AI-Powered" },
  { id: "CAP-112", name: "AI-generate invoice from natural lang", serviceA: "anthropic", serviceB: "stripe", category: "AI-Powered" },
  { id: "CAP-113", name: "AI-create Canva brief from task", serviceA: "asana", serviceB: "anthropic", category: "AI-Powered" },
  { id: "CAP-114", name: "AI-analyze sentiment from reviews", serviceA: "zendesk", serviceB: "anthropic", category: "AI-Powered" },
  { id: "CAP-115", name: "AI-translate WhatsApp messages", serviceA: "whatsapp", serviceB: "openai", category: "AI-Powered" },
  { id: "CAP-116", name: "AI-auto-tag support tickets", serviceA: "intercom", serviceB: "anthropic", category: "AI-Powered" },

  // Radial Burst (10)
  { id: "CAP-117", name: "New client onboarding burst", serviceA: "typeform", serviceB: "crm", category: "Radial Burst" },
  { id: "CAP-118", name: "Deal closed celebration burst", serviceA: "crm", serviceB: "slack", category: "Radial Burst" },
  { id: "CAP-119", name: "Blog launch distribution burst", serviceA: "wordpress", serviceB: "facebook", category: "Radial Burst" },
  { id: "CAP-120", name: "Support escalation burst", serviceA: "zendesk", serviceB: "slack", category: "Radial Burst" },
  { id: "CAP-121", name: "Weekly reporting burst", serviceA: "gsheets", serviceB: "gmail", category: "Radial Burst" },
  { id: "CAP-122", name: "Event registration burst", serviceA: "typeform", serviceB: "gcal", category: "Radial Burst" },
  { id: "CAP-123", name: "Product launch burst", serviceA: "shopify", serviceB: "facebook", category: "Radial Burst" },
  { id: "CAP-124", name: "Invoice-to-cash burst", serviceA: "stripe", serviceB: "quickbooks", category: "Radial Burst" },
  { id: "CAP-125", name: "Social listening burst", serviceA: "facebook", serviceB: "crm", category: "Radial Burst" },
  { id: "CAP-126", name: "Customer win story burst", serviceA: "crm", serviceB: "linkedin", category: "Radial Burst" },
]

// ─── COMPUTED STATS ───────────────────────────────────────
export const EXPANSION_STATS = {
  services: EXPANDED_SERVICES.length,
  liveServices: EXPANDED_SERVICES.filter(s => s.status === "live").length,
  federatedServices: EXPANDED_SERVICES.filter(s => s.status === "federate").length,
  baseTools: EXPANDED_SERVICES.reduce((sum, s) => sum + s.tools, 0),
  capabilities: CAPABILITIES.length,
  totalCapabilities: EXPANDED_SERVICES.reduce((sum, s) => sum + s.tools, 0) + CAPABILITIES.length,
  categories: [...new Set(CAPABILITIES.map(c => c.category))].length,
}

// ─── HELPERS ──────────────────────────────────────────────
export function getServiceById(id: string) {
  return EXPANDED_SERVICES.find(s => s.id === id)
}

export function getServicesBySection(section: string) {
  return EXPANDED_SERVICES.filter(s => s.section === section)
}

export function getCapabilitiesForService(serviceId: string) {
  return CAPABILITIES.filter(c => c.serviceA === serviceId || c.serviceB === serviceId)
}

export function getCapabilitiesByCategory(category: string) {
  return CAPABILITIES.filter(c => c.category === category)
}
