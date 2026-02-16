import { NextRequest, NextResponse } from 'next/server'
import { STATS, SERVICES, CATEGORIES } from '@/lib/catalog'

const BADGE_COLORS: Record<string, string> = {
  tools: "00ff88",
  services: "00d4ff",
  actions: "ff6b35",
  triggers: "9945ff",
  total: "00ff88",
  categories: "ff3d9a",
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const badge = searchParams.get('badge')

  // Badge mode for shields.io
  if (badge) {
    const value = badge === 'total' ? STATS.total : STATS[badge as keyof typeof STATS]
    if (value === undefined) {
      return NextResponse.json(
        { schemaVersion: 1, label: 'error', message: 'unknown', color: 'red' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { schemaVersion: 1, label: badge, message: String(value), color: BADGE_COLORS[badge] || "00ff88" },
      { headers: { 'Cache-Control': 'public, max-age=300', 'Access-Control-Allow-Origin': '*' } }
    )
  }

  // Full stats
  return NextResponse.json({
    ...STATS,
    total: STATS.total,
    services_list: SERVICES.map(s => ({ id: s.id, name: s.name, category: s.category, tools: s.tools })),
    categories_list: CATEGORIES.map(c => ({ id: c.id, label: c.label })),
    generated: new Date().toISOString(),
  }, {
    headers: { 'Cache-Control': 'public, max-age=300', 'Access-Control-Allow-Origin': '*' }
  })
}
