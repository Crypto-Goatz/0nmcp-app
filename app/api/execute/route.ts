import { NextRequest, NextResponse } from 'next/server'

const ONMCP_URL = process.env.ONMCP_URL || 'http://localhost:3001'

export async function POST(req: NextRequest) {
  try {
    const { task, service, tool } = await req.json()

    if (!task && !tool) {
      return NextResponse.json({ error: 'task or tool required' }, { status: 400 })
    }

    const res = await fetch(`${ONMCP_URL}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: task || `Execute ${tool} on ${service}` }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'execution failed', status: 'offline' },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json({
      ...data,
      source: '0nmcp',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: '0nMCP server unreachable', status: 'offline', hint: 'Run: npx 0nmcp serve --port 3001' },
      { status: 502 }
    )
  }
}
