import { query } from './db'

/**
 * Tenant Context Manager
 *
 * Manages tenant context throughout the request lifecycle
 * to ensure proper data isolation.
 */

export interface TenantContext {
  tenantId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
}

/**
 * Set the tenant context for the current database session
 * This enables Row-Level Security (RLS) policies
 */
export async function setTenantContext(userId: string): Promise<void> {
  await query('SELECT set_tenant_context($1)', [userId])
}

/**
 * Build a WHERE clause for tenant filtering
 * Use this in queries that need to filter by tenant
 */
export function buildTenantFilter(tenantIds: string[]): string {
  if (tenantIds.length === 0) {
    throw new Error('At least one tenant ID is required')
  }

  if (tenantIds.length === 1) {
    return `tenant_id = $1`
  }

  const placeholders = tenantIds.map((_, i) => `$${i + 1}`).join(', ')
  return `tenant_id IN (${placeholders})`
}

/**
 * Validate that a user has access to a tenant
 * Throws an error if access is denied
 */
export async function validateTenantAccess(
  userId: string,
  tenantId: string
): Promise<void> {
  const result = await query(
    `SELECT EXISTS(
      SELECT 1 FROM tenant_users
      WHERE tenant_id = $1
        AND user_id = $2
        AND status = 'active'
    ) AS has_access`,
    [tenantId, userId]
  )

  const hasAccess = result.rows[0]?.has_access

  if (!hasAccess) {
    throw new Error(`Access denied to tenant: ${tenantId}`)
  }
}

/**
 * Get all tenant IDs a user has access to
 */
export async function getUserTenantIds(userId: string): Promise<string[]> {
  const result = await query(
    `SELECT tenant_id
     FROM tenant_users
     WHERE user_id = $1
       AND status = 'active'
       AND tenant_id IN (
         SELECT id FROM tenants WHERE status = 'active'
       )`,
    [userId]
  )

  return result.rows.map(row => row.tenant_id)
}

/**
 * Tenant-aware query builder
 * Automatically adds tenant filtering to queries
 */
export class TenantQuery {
  public tenantIds: string[] = []
  private userId: string = ''

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Initialize tenant context from user ID
   */
  async init(): Promise<this> {
    this.tenantIds = await getUserTenantIds(this.userId)

    if (this.tenantIds.length === 0) {
      throw new Error('User has no active tenant memberships')
    }

    // Set RLS context
    await setTenantContext(this.userId)

    return this
  }

  /**
   * Build WHERE clause with tenant filtering
   */
  where(additionalCondition?: string, params: any[] = []): {
    clause: string
    params: any[]
  } {
    const tenantClause = buildTenantFilter(this.tenantIds)
    const allParams = [...this.tenantIds, ...params]

    if (additionalCondition) {
      return {
        clause: `${tenantClause} AND ${additionalCondition}`,
        params: allParams
      }
    }

    return {
      clause: tenantClause,
      params: allParams
    }
  }

  /**
   * Check if user has access to specific tenant
   */
  async canAccess(tenantId: string): Promise<boolean> {
    return this.tenantIds.includes(tenantId)
  }

  /**
   * Get user's role in a specific tenant
   */
  async getRole(tenantId: string): Promise<string | null> {
    if (!this.tenantIds.includes(tenantId)) {
      return null
    }

    const result = await query(
      `SELECT role FROM tenant_users
       WHERE tenant_id = $1 AND user_id = $2 AND status = 'active'`,
      [tenantId, this.userId]
    )

    return result.rows[0]?.role || null
  }

  /**
   * Get all tenants for user with their roles
   */
  async getTenants(): Promise<any[]> {
    const result = await query(
      `SELECT
        t.*,
        tu.role,
        tu.joined_at,
        tu.status as user_status
       FROM tenants t
       INNER JOIN tenant_users tu ON t.id = tu.tenant_id
       WHERE tu.user_id = $1
         AND tu.status = 'active'
         AND t.status = 'active'
       ORDER BY tu.joined_at DESC`,
      [this.userId]
    )

    return result.rows
  }
}

/**
 * Middleware helper to extract and validate tenant context
 */
export async function createTenantContext(
  userId: string,
  tenantId?: string
): Promise<TenantContext> {
  const tenantQuery = new TenantQuery(userId)
  await tenantQuery.init()

  // If specific tenant requested, validate access
  if (tenantId) {
    await validateTenantAccess(userId, tenantId)

    const role = await tenantQuery.getRole(tenantId)

    return {
      tenantId,
      userId,
      role: role as 'owner' | 'admin' | 'member'
    }
  }

  // Otherwise, use first tenant
  const firstTenant = tenantQuery.tenantIds[0]
  const role = await tenantQuery.getRole(firstTenant)

  return {
    tenantId: firstTenant,
    userId,
    role: role as 'owner' | 'admin' | 'member'
  }
}

/**
 * Usage example:

// In an API route:
import { createTenantContext } from '@/lib/tenant-context'

export async function GET(request: NextRequest) {
  // Get user from JWT
  const user = await getUserFromRequest(request)

  // Create tenant context
  const context = await createTenantContext(user.userId, requestedTenantId)

  // Use context for queries
  const result = await query(
    `SELECT * FROM agents WHERE ${buildTenantFilter([context.tenantId])}`,
    [context.tenantId]
  )

  return NextResponse.json({ data: result.rows })
}
*/
