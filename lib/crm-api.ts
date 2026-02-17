/**
 * CRM API Client — Multi-scope authentication
 *
 * Scopes:
 *   1. Agency API Key — full agency access, all sub-accounts
 *   2. PIT Key — Private Integration Token (marketplace)
 *   3. Location API Key — per sub-account access
 *   4. OAuth (Client ID + Secret) — marketplace OAuth flow
 *
 * API: https://services.leadconnectorhq.com
 * Version: 2021-07-28
 */

const CRM_API_BASE = process.env.CRM_API_BASE || "https://services.leadconnectorhq.com"
const CRM_API_VERSION = process.env.CRM_API_VERSION || "2021-07-28"

export type CRMScope = "agency" | "pit" | "location" | "oauth"

export interface CRMRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: Record<string, unknown>
  params?: Record<string, string>
  scope?: CRMScope
  locationId?: string
}

export interface CRMLocation {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  timezone?: string
  logoUrl?: string
  settings?: Record<string, unknown>
}

export interface CRMAgencyInfo {
  id: string
  name: string
  email?: string
  phone?: string
  locations?: CRMLocation[]
}

// ─── CORE REQUEST FUNCTION ────────────────────────────────
async function crmFetch<T = unknown>(
  endpoint: string,
  token: string,
  options: CRMRequestOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { method = "GET", body, params } = options

  let url = `${CRM_API_BASE}${endpoint}`
  if (params) {
    const qs = new URLSearchParams(params).toString()
    url += `?${qs}`
  }

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
    "Version": CRM_API_VERSION,
    "Content-Type": "application/json",
    "Accept": "application/json",
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        data: null,
        error: data?.message || data?.error || `CRM API ${res.status}: ${res.statusText}`,
        status: res.status,
      }
    }

    return { data: data as T, error: null, status: res.status }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "CRM API request failed",
      status: 0,
    }
  }
}

// ─── KEY MANAGEMENT ───────────────────────────────────────
/**
 * Get the appropriate API key based on scope.
 * Priority: provided token > env vars
 */
export function getAgencyKey(): string {
  return process.env.CRM_AGENCY_API_KEY || ""
}

export function getPITKey(): string {
  return process.env.CRM_PIT_KEY || ""
}

export function resolveToken(scope: CRMScope, locationToken?: string): string {
  switch (scope) {
    case "agency":
      return getAgencyKey()
    case "pit":
      return getPITKey()
    case "location":
      return locationToken || ""
    case "oauth":
      return locationToken || "" // OAuth access token
    default:
      return getAgencyKey()
  }
}

// ─── AGENCY OPERATIONS ────────────────────────────────────

/** List all locations (sub-accounts) under the agency */
export async function listLocations(options?: {
  limit?: number
  skip?: number
  search?: string
}) {
  const token = getAgencyKey()
  if (!token) return { data: null, error: "Agency API key not configured", status: 0 }

  const params: Record<string, string> = {}
  if (options?.limit) params.limit = String(options.limit)
  if (options?.skip) params.skip = String(options.skip)
  if (options?.search) params.search = options.search

  return crmFetch<{ locations: CRMLocation[]; count: number; total: number }>(
    "/locations/search",
    token,
    { params }
  )
}

/** Get a single location's details */
export async function getLocation(locationId: string) {
  const token = getAgencyKey()
  if (!token) return { data: null, error: "Agency API key not configured", status: 0 }

  return crmFetch<{ location: CRMLocation }>(
    `/locations/${locationId}`,
    token
  )
}

// ─── LOCATION-SCOPED OPERATIONS ───────────────────────────

/** Get contacts for a specific location */
export async function getContacts(locationId: string, token: string, params?: Record<string, string>) {
  return crmFetch<{ contacts: unknown[]; meta: unknown }>(
    `/contacts/`,
    token,
    { params: { ...params, locationId } }
  )
}

/** Get opportunities for a location */
export async function getOpportunities(locationId: string, token: string, pipelineId?: string) {
  const params: Record<string, string> = { location_id: locationId }
  if (pipelineId) params.pipeline_id = pipelineId

  return crmFetch<{ opportunities: unknown[] }>(
    `/opportunities/search`,
    token,
    { method: "GET", params }
  )
}

/** Get conversations for a location */
export async function getConversations(locationId: string, token: string) {
  return crmFetch<{ conversations: unknown[] }>(
    `/conversations/search`,
    token,
    { params: { locationId } }
  )
}

/** Get calendars for a location */
export async function getCalendars(locationId: string, token: string) {
  return crmFetch<{ calendars: unknown[] }>(
    `/calendars/`,
    token,
    { params: { locationId } }
  )
}

/** Get pipelines for a location */
export async function getPipelines(locationId: string, token: string) {
  return crmFetch<{ pipelines: unknown[] }>(
    `/opportunities/pipelines`,
    token,
    { params: { locationId } }
  )
}

/** Get users for a location */
export async function getUsers(locationId: string, token: string) {
  return crmFetch<{ users: unknown[] }>(
    `/users/`,
    token,
    { params: { locationId } }
  )
}

// ─── GENERIC OPERATIONS (any scope) ──────────────────────

/** Generic CRM API call — use any endpoint with any scope */
export async function crmRequest<T = unknown>(
  endpoint: string,
  scope: CRMScope,
  options: CRMRequestOptions & { token?: string } = {}
) {
  const token = options.token || resolveToken(scope)
  if (!token) return { data: null, error: `No API key for scope: ${scope}`, status: 0 }

  return crmFetch<T>(endpoint, token, options)
}

// ─── OAUTH FLOW ───────────────────────────────────────────

export function getOAuthAuthorizeUrl(redirectUri: string, scopes: string[] = []) {
  const clientId = process.env.CRM_CLIENT_ID || ""
  if (!clientId) return null

  const params = new URLSearchParams({
    response_type: "code",
    redirect_uri: redirectUri,
    client_id: clientId,
    scope: scopes.join(" "),
  })

  return `https://marketplace.gohighlevel.com/oauth/chooselocation?${params}`
}

export async function exchangeOAuthCode(code: string, redirectUri: string) {
  const clientId = process.env.CRM_CLIENT_ID || ""
  const clientSecret = process.env.CRM_CLIENT_SECRET || ""

  if (!clientId || !clientSecret) {
    return { data: null, error: "OAuth credentials not configured", status: 0 }
  }

  try {
    const res = await fetch(`${CRM_API_BASE}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    const data = await res.json()
    if (!res.ok) return { data: null, error: data.error || "OAuth exchange failed", status: res.status }

    return {
      data: data as {
        access_token: string
        refresh_token: string
        token_type: string
        expires_in: number
        locationId: string
        companyId: string
        userId: string
      },
      error: null,
      status: 200,
    }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "OAuth failed", status: 0 }
  }
}

export async function refreshOAuthToken(refreshToken: string) {
  const clientId = process.env.CRM_CLIENT_ID || ""
  const clientSecret = process.env.CRM_CLIENT_SECRET || ""

  try {
    const res = await fetch(`${CRM_API_BASE}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    const data = await res.json()
    if (!res.ok) return { data: null, error: data.error || "Token refresh failed", status: res.status }

    return { data, error: null, status: 200 }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Refresh failed", status: 0 }
  }
}

// ─── HEALTH CHECK ─────────────────────────────────────────
export async function checkCRMHealth() {
  const token = getAgencyKey() || getPITKey()
  if (!token) return { online: false, error: "No CRM API key configured" }

  const { data, error, status } = await crmFetch<{ locations: unknown[] }>(
    "/locations/search",
    token,
    { params: { limit: "1" } }
  )

  return {
    online: status === 200,
    error,
    status,
    hasLocations: Array.isArray((data as Record<string, unknown>)?.locations),
  }
}
