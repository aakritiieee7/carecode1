import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS
  const response = NextResponse.next()

  // Set CORS headers
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  
  response.headers.set('Access-Control-Allow-Origin', frontendUrl)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: '/api/:path*'
}