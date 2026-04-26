import { google } from 'googleapis'
import { queryOne, query } from './db'
import { findTenantById } from './tenant'

/**
 * Gmail OAuth Manager
 *
 * Manages OAuth tokens for Gmail integration per tenant
 */

export interface GmailToken {
  user_id: string
  tenant_id: string
  access_token: string
  refresh_token: string | null
  expires_at: Date | null
  config: {
    email: string
    picture?: string
    name?: string
    verified_email?: boolean
  }
}

/**
 * Get stored Gmail tokens for a user/tenant
 */
export async function getGmailToken(
  userId: string,
  tenantId: string
): Promise<GmailToken | null> {
  const result = await queryOne(
    `SELECT
      user_id,
      tenant_id,
      access_token,
      refresh_token,
      expires_at,
      config
     FROM integrations
     WHERE user_id = $1
       AND tenant_id = $2
       AND provider = 'gmail'
       AND status = 'active'`,
    [userId, tenantId]
  )

  return result as GmailToken | null
}

/**
 * Check if token needs refresh
 */
export function tokenNeedsRefresh(expiresAt: Date | null): boolean {
  if (!expiresAt) return false

  // Refresh if expires within 5 minutes
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)
  return expiresAt < fiveMinutesFromNow
}

/**
 * Refresh Gmail access token using refresh token
 */
export async function refreshGmailToken(
  userId: string,
  tenantId: string
): Promise<string> {
  // Get current token
  const currentToken = await getGmailToken(userId, tenantId)

  if (!currentToken || !currentToken.refresh_token) {
    throw new Error('No refresh token available. User must re-authenticate.')
  }

  // Get tenant's OAuth credentials
  const tenant = await findTenantById(tenantId)

  if (!tenant) {
    throw new Error('Tenant not found')
  }

  const clientId = tenant.settings?.googleClientId || process.env.GOOGLE_CLIENT_ID
  const clientSecret = tenant.settings?.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET

  // Create OAuth client
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret
  )

  oauth2Client.setCredentials({
    refresh_token: currentToken.refresh_token
  })

  // Refresh token
  const { credentials } = await oauth2Client.refreshAccessToken()

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token')
  }

  // Update in database
  const expiresAt = credentials.expiry_date
    ? new Date(credentials.expiry_date)
    : null

  await query(
    `UPDATE integrations
     SET access_token = $1,
         expires_at = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3
       AND tenant_id = $4
       AND provider = 'gmail'`,
    [credentials.access_token, expiresAt, userId, tenantId]
  )

  return credentials.access_token
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(
  userId: string,
  tenantId: string
): Promise<string> {
  const token = await getGmailToken(userId, tenantId)

  if (!token) {
    throw new Error('No Gmail integration found. User must authenticate first.')
  }

  // Check if token needs refresh
  if (tokenNeedsRefresh(token.expires_at)) {
    return await refreshGmailToken(userId, tenantId)
  }

  return token.access_token
}

/**
 * Create OAuth client for API calls
 */
export async function createGmailClient(
  userId: string,
  tenantId: string
) {
  const accessToken = await getValidAccessToken(userId, tenantId)

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: accessToken
  })

  return oauth2Client
}

/**
 * Disconnect Gmail integration
 */
export async function disconnectGmail(
  userId: string,
  tenantId: string
): Promise<void> {
  await query(
    `DELETE FROM integrations
     WHERE user_id = $1
       AND tenant_id = $2
       AND provider = 'gmail'`,
    [userId, tenantId]
  )
}

/**
 * Check if Gmail is connected
 */
export async function isGmailConnected(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const token = await getGmailToken(userId, tenantId)
  return token !== null
}
