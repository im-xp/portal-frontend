import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers: Record<string, string> = {}
  
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  // Get all search params
  const searchParams: Record<string, string> = {}
  request.nextUrl.searchParams.forEach((value, key) => {
    searchParams[key] = value
  })
  
  return NextResponse.json({
    host: request.headers.get('host'),
    xForwardedHost: request.headers.get('x-forwarded-host'),
    url: request.url,
    searchParams: searchParams,
    popupParam: request.nextUrl.searchParams.get('popup'),
    nextUrl: {
      hostname: request.nextUrl.hostname,
      host: request.nextUrl.host,
      href: request.nextUrl.href,
      search: request.nextUrl.search,
    },
    middlewareNote: 'If popup param is present, middleware worked!',
  }, { status: 200 })
}

