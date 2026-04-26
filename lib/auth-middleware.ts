import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from './auth'

// Extend NextRequest to include user payload
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
  tenantId?: string
}

// Helper to extract token from Authorization header or cookie
function extractToken(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try cookie
  const token = request.cookies.get('auth_token')?.value
  if (token) {
    return token
  }

  return null
}

// Authentication middleware
export async function withAuth(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const token = extractToken(request)

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  return { user: payload }
}

// Admin role middleware
export async function withAdmin(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  // TEMPORARY: Skip auth for testing (REMOVE IN PRODUCTION!)
  if (process.env.SKIP_AUTH === 'true') {
    return {
      user: {
        userId: '415fc9ab-ad1c-4702-b5c2-e27b75832988',
        email: 'admin@openclaw.cloud',
        role: 'admin',
        tenantIds: ['f3a93558-31be-4fa0-874f-6472f2183b4e']
      }
    }
  }

  const authResult = await withAuth(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  // Check if user has admin or owner role
  if (user.role !== 'admin' && user.role !== 'owner') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }

  return { user }
}

// Tenant access middleware
export async function withTenantAccess(
  request: NextRequest,
  tenantId: string
): Promise<{ user: JWTPayload; tenantId: string } | NextResponse> {
  const authResult = await withAuth(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  // Check if user has access to this tenant
  if (!user.tenantIds.includes(tenantId)) {
    return NextResponse.json(
      { error: 'Access to this tenant not authorized' },
      { status: 403 }
    )
  }

  return { user, tenantId }
}

// Helper to get user from request (for use in API routes)
export async function getUserFromRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = extractToken(request)
  if (!token) return null
  return verifyToken(token)
}

// Helper to get current tenant from request
export async function getCurrentTenant(
  request: NextRequest
): Promise<{ user: JWTPayload; tenantId: string } | null> {
  const user = await getUserFromRequest(request)
  if (!user || user.tenantIds.length === 0) return null

  // Get tenant from query param or header or use first tenant
  const tenantIdFromQuery = request.nextUrl.searchParams.get('tenantId')
  const tenantIdFromHeader = request.headers.get('x-tenant-id')
  const tenantId = tenantIdFromQuery || tenantIdFromHeader || user.tenantIds[0]

  if (!user.tenantIds.includes(tenantId)) {
    return null
  }

  // Set tenant context for RLS
  const { setTenantContext } = await import('./tenant-context')
  await setTenantContext(user.userId)

  return { user, tenantId }
}
