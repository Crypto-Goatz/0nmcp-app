/**
 * 0nMCP Composer — .0n File Management
 * Parse, generate, and compose SWITCH files
 */

export interface ParsedFile {
  id: string
  filename: string
  name: string
  type: 'connection' | 'workflow' | 'run' | 'switch' | 'config' | 'unknown'
  version: string
  services: string[]
  data: Record<string, unknown>
  description: string
}

const TYPE_SIGNATURES: Record<string, (d: Record<string, unknown>) => boolean> = {
  connection: (d) => !!d.service && !!d.auth,
  workflow: (d) => !!d.steps || !!d.pipeline,
  run: (d) => !!d.commands || (!!d.steps && !!d.trigger),
  switch: (d) => !!d.connections || !!d.network || !!d.includes,
  config: (d) => !!d.settings || !!d.preferences,
}

export function detectFileType(data: Record<string, unknown>): ParsedFile['type'] {
  for (const [type, test] of Object.entries(TYPE_SIGNATURES)) {
    if (test(data)) return type as ParsedFile['type']
  }
  return 'unknown'
}

export function extractServices(data: Record<string, unknown>): string[] {
  const services = new Set<string>()

  // Direct service field
  if (typeof data.service === 'string') services.add(data.service)

  // Connections array
  if (Array.isArray(data.connections)) {
    for (const c of data.connections) {
      if (typeof c === 'string') services.add(c)
      if (typeof c === 'object' && c && typeof (c as Record<string, unknown>).service === 'string') {
        services.add((c as Record<string, unknown>).service as string)
      }
    }
  }

  // Steps with service fields
  if (Array.isArray(data.steps)) {
    for (const s of data.steps) {
      if (typeof s === 'object' && s && typeof (s as Record<string, unknown>).service === 'string') {
        services.add((s as Record<string, unknown>).service as string)
      }
    }
  }

  // Network services
  if (data.network && typeof data.network === 'object') {
    for (const key of Object.keys(data.network as object)) {
      services.add(key)
    }
  }

  return [...services]
}

export function parseOnFile(filename: string, raw: string): ParsedFile {
  const data = JSON.parse(raw)
  const meta = data.$0n || {}
  const type = detectFileType(data)
  const services = extractServices(data)

  return {
    id: crypto.randomUUID(),
    filename,
    name: meta.name || data.name || filename.replace(/\.0n$/, ''),
    type,
    version: meta.version || data.version || '1.0.0',
    services,
    data,
    description: meta.description || data.description || '',
  }
}

export function generateSwitchFile(
  name: string,
  files: ParsedFile[],
  author?: string
): Record<string, unknown> {
  const connections = files.filter(f => f.type === 'connection')
  const workflows = files.filter(f => f.type === 'workflow')
  const runs = files.filter(f => f.type === 'run')
  const configs = files.filter(f => f.type === 'config')
  const switches = files.filter(f => f.type === 'switch')
  const allServices = [...new Set(files.flatMap(f => f.services))]

  return {
    $0n: {
      type: 'switch',
      name,
      version: '1.0.0',
      description: `Master SWITCH composing ${files.length} files across ${allServices.length} services`,
      author: author || 'app.0nmcp.com',
      created: new Date().toISOString(),
    },
    connections: connections.map(f => f.data.service || f.name),
    services: allServices,
    includes: files.map(f => ({
      filename: f.filename,
      type: f.type,
      name: f.name,
    })),
    ...(workflows.length > 0 && {
      workflows: Object.fromEntries(workflows.map(f => [f.name, f.data])),
    }),
    ...(runs.length > 0 && {
      runs: Object.fromEntries(runs.map(f => [f.name, f.data])),
    }),
    ...(configs.length > 0 && {
      configs: Object.fromEntries(configs.map(f => [f.name, f.data])),
    }),
    ...(switches.length > 0 && {
      nested_switches: switches.map(f => ({ name: f.name, filename: f.filename })),
    }),
    pipeline: [
      { phase: 'connect', services: connections.map(f => (f.data.service as string) || f.name) },
      ...(workflows.length > 0 ? [{ phase: 'execute', workflows: workflows.map(f => f.name) }] : []),
    ],
  }
}
