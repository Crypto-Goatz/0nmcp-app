import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase"
import { checkCRMHealth } from "@/lib/crm-api"

/**
 * GET /api/crm/agency — Get agency config and status
 * POST /api/crm/agency — Initialize/update agency config
 */

export async function GET() {
  try {
    const db = getServiceClient()
    const { data, error } = await db
      .from("crm_agency_config")
      .select("*")
      .single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 = no rows

    // Check if CRM keys are configured (don't expose actual keys)
    const hasAgencyKey = !!process.env.CRM_AGENCY_API_KEY
    const hasPITKey = !!process.env.CRM_PIT_KEY
    const hasClientId = !!process.env.CRM_CLIENT_ID
    const hasClientSecret = !!process.env.CRM_CLIENT_SECRET

    return NextResponse.json({
      config: data || null,
      keys: {
        agency_api_key: hasAgencyKey,
        pit_key: hasPITKey,
        client_id: hasClientId,
        client_secret: hasClientSecret,
        pit_value: hasPITKey ? process.env.CRM_PIT_KEY!.slice(0, 8) + "..." : null,
      },
      configured: hasAgencyKey || hasPITKey,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get agency config" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = getServiceClient()

    // Check if config exists
    const { data: existing } = await db
      .from("crm_agency_config")
      .select("id")
      .single()

    const configData = {
      agency_name: body.agency_name || "0nORK Agency",
      agency_id: body.agency_id || null,
      api_base_url: body.api_base_url || "https://services.leadconnectorhq.com",
      api_version: body.api_version || "2021-07-28",
      status: "active",
    }

    if (existing) {
      await db.from("crm_agency_config").update(configData).eq("id", existing.id)
    } else {
      await db.from("crm_agency_config").insert(configData)
    }

    // Test CRM connection
    const health = await checkCRMHealth()

    return NextResponse.json({
      success: true,
      config: configData,
      health,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save config" },
      { status: 500 }
    )
  }
}
