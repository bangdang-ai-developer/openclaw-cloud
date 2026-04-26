import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query, queryOne, queryMany, transaction } from './db'

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface JWTPayload {
  userId: string
  email: string
  tenantIds: string[]
  role: string
}

export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string | null
  phone: string | null
  tier: string
  status: string
  created_at: Date
  last_login_at: Date | null
}

// Password hashing with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Password verification
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  )
}

// Find user by ID
export async function findUserById(userId: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )
}

// Create new user
export async function createUser(data: {
  email: string
  password: string
  full_name?: string
  phone?: string
  tier?: string
}): Promise<User> {
  const password_hash = await hashPassword(data.password)

  const user = await queryOne<User>(
    `INSERT INTO users (email, password_hash, full_name, phone, tier)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.email.toLowerCase(),
      password_hash,
      data.full_name || null,
      data.phone || null,
      data.tier || 'starter'
    ]
  )

  if (!user) {
    throw new Error('Failed to create user')
  }

  return user
}

// Update last login
export async function updateLastLogin(userId: string): Promise<void> {
  await query(
    'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
    [userId]
  )
}

// Get user's tenants
export async function getUserTenants(userId: string): Promise<any[]> {
  return queryMany(
    `SELECT t.*, tu.role, tu.joined_at, tu.status as user_status
     FROM tenants t
     INNER JOIN tenant_users tu ON t.id = tu.tenant_id
     WHERE tu.user_id = $1 AND tu.status = 'active' AND t.status = 'active'
     ORDER BY tu.joined_at DESC`,
    [userId]
  )
}

// Login user and return token with tenant info
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string; tenants: any[] } | null> {
  const user = await findUserByEmail(email)

  if (!user) {
    return null
  }

  if (user.status !== 'active') {
    throw new Error('User account is not active')
  }

  const passwordValid = await verifyPassword(password, user.password_hash)

  if (!passwordValid) {
    return null
  }

  // Update last login
  await updateLastLogin(user.id)

  // Get user's tenants
  const tenants = await getUserTenants(user.id)
  const tenantIds = tenants.map((t: any) => t.id)

  // Determine role (if user has any admin/owner roles, use highest)
  const role = tenants.some((t: any) => t.role === 'owner')
    ? 'owner'
    : tenants.some((t: any) => t.role === 'admin')
    ? 'admin'
    : 'member'

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    tenantIds,
    role
  })

  return {
    user,
    token,
    tenants
  }
}

// Register new user with optional tenant creation
export async function registerUser(data: {
  email: string
  password: string
  full_name?: string
  phone?: string
  createTenant?: {
    business_name: string
    slug: string
    industry?: string
    contact_email?: string
    tier?: string
  }
}): Promise<{ user: User; token: string; tenants: any[] }> {
  return transaction(async (client) => {
    // Create user
    const password_hash = await hashPassword(data.password)

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name, phone, tier)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.email.toLowerCase(),
        password_hash,
        data.full_name || null,
        data.phone || null,
        'starter'
      ]
    )

    const user = userResult.rows[0]

    let tenants: any[] = []

    // Create tenant if requested
    if (data.createTenant) {
      const tenantResult = await client.query(
        `INSERT INTO tenants (slug, business_name, industry, contact_email, tier, status)
         VALUES ($1, $2, $3, $4, $5, 'active')
         RETURNING *`,
        [
          data.createTenant.slug,
          data.createTenant.business_name,
          data.createTenant.industry || null,
          data.createTenant.contact_email || data.email.toLowerCase(),
          data.createTenant.tier || 'trial'
        ]
      )

      const tenant = tenantResult.rows[0]

      // Add user to tenant as owner
      await client.query(
        `INSERT INTO tenant_users (tenant_id, user_id, role, status)
         VALUES ($1, $2, 'owner', 'active')`,
        [tenant.id, user.id]
      )

      tenants = [{
        ...tenant,
        role: 'owner',
        joined_at: new Date(),
        user_status: 'active'
      }]
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantIds: tenants.map((t: any) => t.id),
      role: tenants.length > 0 ? 'owner' : 'member'
    })

    return {
      user,
      token,
      tenants
    }
  })
}
