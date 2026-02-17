import { NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase"
import { listLocations, type CRMLocation } from "@/lib/crm-api"

/**
 * GET /api/crm/locations — List all synced locations
 * POST /api/crm/locations — Sync locations from CRM agency
 */

export async function GET() {
  try {
    const db = getServiceClient()
    const { data, error } = await db
      .from("crm_locations")
      .select("*")
      .order("name")

    if (error) throw error
    return NextResponse.json({ locations: data || [], count: data?.length || 0 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

export async function POST() {
  const startTime = Date.now()
  const db = getServiceClient()

  try {
    // Start sync log
    const { data: syncLog } = await db.from("crm_sync_log").insert({
      sync_type: "full",
      status: "running",
    }).select().single()

    // Update agency config status
    await db.from("crm_agency_config").update({ status: "syncing" }).not("id", "is", null)

    // Fetch all locations from CRM
    let allLocations: (CRMLocation | Record<string, unknown>)[] = []
    let skip = 0
    const limit = 100
    let hasMore = true

    while (hasMore) {
      const result = await listLocations({ limit, skip })
      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to fetch locations from CRM")
      }

      const batch = result.data.locations || []
      allLocations = [...allLocations, ...batch]
      skip += limit
      hasMore = batch.length === limit
    }

    // Upsert locations into database
    let added = 0
    let updated = 0

    for (const loc of allLocations) {
      const locationData = {
        location_id: loc.id as string,
        name: (loc.name as string) || "Unnamed Location",
        address: loc.address as string || null,
        city: loc.city as string || null,
        state: loc.state as string || null,
        country: loc.country as string || null,
        postal_code: loc.postalCode as string || null,
        phone: loc.phone as string || null,
        email: loc.email as string || null,
        website: loc.website as string || null,
        timezone: loc.timezone as string || null,
        logo_url: loc.logoUrl as string || null,
        crm_metadata: loc,
        last_sync_at: new Date().toISOString(),
      }

      const { data: existing } = await db
        .from("crm_locations")
        .select("id")
        .eq("location_id", loc.id)
        .single()

      if (existing) {
        await db.from("crm_locations").update(locationData).eq("location_id", loc.id)
        updated++
      } else {
        await db.from("crm_locations").insert(locationData)
        added++
      }
    }

    // Update agency config
    await db.from("crm_agency_config").update({
      status: "active",
      last_sync_at: new Date().toISOString(),
      locations_count: allLocations.length,
    }).not("id", "is", null)

    // Complete sync log
    const duration = Date.now() - startTime
    if (syncLog) {
      await db.from("crm_sync_log").update({
        status: "completed",
        locations_synced: allLocations.length,
        locations_added: added,
        locations_updated: updated,
        duration_ms: duration,
        completed_at: new Date().toISOString(),
      }).eq("id", syncLog.id)
    }

    return NextResponse.json({
      success: true,
      total: allLocations.length,
      added,
      updated,
      duration_ms: duration,
    })
  } catch (err) {
    // Update status on error
    await db.from("crm_agency_config").update({ status: "error" }).not("id", "is", null)

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    )
  }
}
