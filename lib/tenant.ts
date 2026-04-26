import { queryOne, queryMany, query, transaction } from './db'

export interface Tenant {
  id: string
  slug: string
  business_name: string
  logo_url: string | null
  industry: string | null
  contact_email: string | null
  contact_phone: string | null
  tier: string
  status: string
  trial_ends_at: Date | null
  settings: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface TenantUser {
  id: string
  tenant_id: string
  user_id: string
  role: string
  status: string
  joined_at: Date
}

// Find tenant by slug
export async function findTenantBySlug(slug: string): Promise<Tenant | null> {
  return queryOne<Tenant>(
    'SELECT * FROM tenants WHERE slug = $1',
    [slug]
  )
}

// Find tenant by ID
export async function findTenantById(tenantId: string): Promise<Tenant | null> {
  return queryOne<Tenant>(
    'SELECT * FROM tenants WHERE id = $1',
    [tenantId]
  )
}

// List all tenants (with pagination)
export async function listTenants(options: {
  limit?: number
  offset?: number
  status?: string
  tier?: string
  search?: string
} = {}): Promise<{ tenants: Tenant[]; total: number }> {
  const { limit = 50, offset = 0, status, tier, search } = options

  let whereClause = ''
  const params: any[] = []
  let paramIndex = 1

  const conditions: string[] = []

  if (status) {
    conditions.push(`status = $${paramIndex++}`)
    params.push(status)
  }

  if (tier) {
    conditions.push(`tier = $${paramIndex++}`)
    params.push(tier)
  }

  if (search) {
    conditions.push(`(business_name ILIKE $${paramIndex++} OR slug ILIKE $${paramIndex++})`)
    params.push(`%${search}%`, `%${search}%`)
  }

  if (conditions.length > 0) {
    whereClause = 'WHERE ' + conditions.join(' AND ')
  }

  // Get total count
  const countResult = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM tenants ${whereClause}`,
    params
  )
  const total = parseInt(countResult?.count || '0', 10)

  // Get tenants
  const tenants = await queryMany<Tenant>(
    `SELECT * FROM tenants ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...params, limit, offset]
  )

  return { tenants, total }
}

// Create new tenant
export async function createTenant(data: {
  slug: string
  business_name: string
  logo_url?: string
  industry?: string
  contact_email?: string
  contact_phone?: string
  tier?: string
  settings?: Record<string, any>
}): Promise<Tenant> {
  const tenant = await queryOne<Tenant>(
    `INSERT INTO tenants (slug, business_name, logo_url, industry, contact_email, contact_phone, tier, settings)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.slug,
      data.business_name,
      data.logo_url || null,
      data.industry || null,
      data.contact_email || null,
      data.contact_phone || null,
      data.tier || 'trial',
      data.settings || {}
    ]
  )

  if (!tenant) {
    throw new Error('Failed to create tenant')
  }

  return tenant
}

// Update tenant
export async function updateTenant(
  tenantId: string,
  data: Partial<{
    business_name: string
    logo_url: string
    industry: string
    contact_email: string
    contact_phone: string
    tier: string
    status: string
    trial_ends_at: Date
    settings: Record<string, any>
  }>
): Promise<Tenant | null> {
  const updates: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (data.business_name !== undefined) {
    updates.push(`business_name = $${paramIndex++}`)
    params.push(data.business_name)
  }

  if (data.logo_url !== undefined) {
    updates.push(`logo_url = $${paramIndex++}`)
    params.push(data.logo_url)
  }

  if (data.industry !== undefined) {
    updates.push(`industry = $${paramIndex++}`)
    params.push(data.industry)
  }

  if (data.contact_email !== undefined) {
    updates.push(`contact_email = $${paramIndex++}`)
    params.push(data.contact_email)
  }

  if (data.contact_phone !== undefined) {
    updates.push(`contact_phone = $${paramIndex++}`)
    params.push(data.contact_phone)
  }

  if (data.tier !== undefined) {
    updates.push(`tier = $${paramIndex++}`)
    params.push(data.tier)
  }

  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex++}`)
    params.push(data.status)
  }

  if (data.trial_ends_at !== undefined) {
    updates.push(`trial_ends_at = $${paramIndex++}`)
    params.push(data.trial_ends_at)
  }

  if (data.settings !== undefined) {
    updates.push(`settings = $${paramIndex++}`)
    params.push(data.settings)
  }

  if (updates.length === 0) {
    return findTenantById(tenantId)
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  params.push(tenantId)

  return queryOne<Tenant>(
    `UPDATE tenants SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    params
  )
}

// Delete/suspend tenant
export async function deleteTenant(tenantId: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM tenants WHERE id = $1',
    [tenantId]
  )
  return (result.rowCount || 0) > 0
}

// Suspend tenant
export async function suspendTenant(tenantId: string): Promise<Tenant | null> {
  return updateTenant(tenantId, { status: 'suspended' })
}

// Add user to tenant
export async function addUserToTenant(
  tenantId: string,
  userId: string,
  role: string = 'member'
): Promise<TenantUser> {
  const tenantUser = await queryOne<TenantUser>(
    `INSERT INTO tenant_users (tenant_id, user_id, role, status)
     VALUES ($1, $2, $3, 'active')
     RETURNING *`,
    [tenantId, userId, role]
  )

  if (!tenantUser) {
    throw new Error('Failed to add user to tenant')
  }

  return tenantUser
}

// Remove user from tenant
export async function removeUserFromTenant(
  tenantId: string,
  userId: string
): Promise<boolean> {
  const result = await query(
    'DELETE FROM tenant_users WHERE tenant_id = $1 AND user_id = $2',
    [tenantId, userId]
  )
  return (result.rowCount || 0) > 0
}

// Get tenant users
export async function getTenantUsers(tenantId: string): Promise<any[]> {
  return queryMany(
    `SELECT
      tu.id,
      tu.role,
      tu.status,
      tu.joined_at,
      u.id as user_id,
      u.email,
      u.full_name,
      u.phone
     FROM tenant_users tu
     INNER JOIN users u ON tu.user_id = u.id
     WHERE tu.tenant_id = $1
     ORDER BY tu.joined_at ASC`,
    [tenantId]
  )
}

// Update tenant user role
export async function updateTenantUserRole(
  tenantId: string,
  userId: string,
  role: string
): Promise<TenantUser | null> {
  return queryOne<TenantUser>(
    `UPDATE tenant_users
     SET role = $1
     WHERE tenant_id = $2 AND user_id = $3
     RETURNING *`,
    [role, tenantId, userId]
  )
}

// Check if user has access to tenant
export async function userHasAccessToTenant(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const result = await queryOne<{ has_access: boolean }>(
    `SELECT EXISTS(
      SELECT 1 FROM tenant_users
      WHERE tenant_id = $1 AND user_id = $2 AND status = 'active'
    ) as has_access`,
    [tenantId, userId]
  )
  return result?.has_access || false
}

// Get user role in tenant
export async function getUserRoleInTenant(
  userId: string,
  tenantId: string
): Promise<string | null> {
  const result = await queryOne<{ role: string }>(
    `SELECT role FROM tenant_users
     WHERE tenant_id = $1 AND user_id = $2 AND status = 'active'`,
    [tenantId, userId]
  )
  return result?.role || null
}

// Generate slug from business name
export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .substring(0, 100) // Limit length
}

// Tenant isolation utility - build WHERE clause for tenant filtering
export function buildTenantFilter(tenantId: string | string[]): string {
  if (Array.isArray(tenantId)) {
    return `tenant_id IN (${tenantId.map((_, i) => `$${i + 1}`).join(', ')})`
  }
  return `tenant_id = $1`
}
