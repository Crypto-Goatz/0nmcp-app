import { NextResponse } from 'next/server'

const ONMCP_URL = process.env.ONMCP_URL || 'http://localhost:3001'

export async function GET() {
  try {
    const res = await fetch(`${ONMCP_URL}/api/health`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) throw new Error('unhealthy')
    const data = await res.json()
    return NextResponse.json({
      online: true,
      ...data,
      timestamp: new Date().toISOString(),
    }, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch {
    return NextResponse.json({
      online: false,
      hint: 'Start 0nMCP: npx 0nmcp serve --port 3001',
      timestamp: new Date().toISOString(),
    }, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  }
}
