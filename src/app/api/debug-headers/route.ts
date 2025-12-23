import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers: Record<string, string> = {}
  
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  
  return NextResponse.json({
    host: request.headers.get('host'),
    xForwardedHost: request.headers.get('x-forwarded-host'),
    xVercelDeploymentUrl: request.headers.get('x-vercel-deployment-url'),
    url: request.url,
    nextUrl: {
      hostname: request.nextUrl.hostname,
      host: request.nextUrl.host,
      href: request.nextUrl.href,
    },
    allHeaders: headers,
  }, { status: 200 })
}

