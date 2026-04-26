import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { queryOne } from '@/lib/db'
import { findTenantById } from '@/lib/tenant'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.json(
        { error: 'Không tìm thấy authorization code' },
        { status: 400 }
      )
    }

    if (!state) {
      return NextResponse.json(
        { error: 'Missing state parameter' },
        { status: 400 }
      )
    }

    // Decode state to get tenant context
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      )
    }

    const { tenantId, userId, redirect } = stateData

    // Get tenant to check for custom OAuth credentials
    const tenant = await findTenantById(tenantId)

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Use tenant's custom OAuth credentials or platform defaults
    const clientId = tenant.settings?.googleClientId || process.env.GOOGLE_CLIENT_ID
    const clientSecret = tenant.settings?.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/gmail/callback`

    // OAuth2 client configuration
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    // Calculate token expiration
    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : null

    // Store tokens in database with tenant context
    await queryOne(
      `INSERT INTO integrations (user_id, tenant_id, provider, access_token, refresh_token, config, expires_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       ON CONFLICT (user_id, provider)
       DO UPDATE SET
         access_token = EXCLUDED.access_token,
         refresh_token = COALESCE(EXCLUDED.refresh_token, integrations.refresh_token),
         config = EXCLUDED.config,
         expires_at = EXCLUDED.expires_at,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        userId,
        tenantId,
        'gmail',
        tokens.access_token,
        tokens.refresh_token || null,
        {
          email: data.email,
          picture: data.picture,
          name: data.name,
          locale: data.locale,
          verified_email: data.verified_email
        },
        expiresAt
      ]
    )

    // Redirect to dashboard with success message
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const emailParam = data.email ? `&email=${encodeURIComponent(data.email)}` : ''
    return NextResponse.redirect(
      `${baseUrl}${redirect || '/dashboard'}?gmail_connected=true${emailParam}`
    )
  } catch (error: any) {
    console.error('Gmail callback error:', error)
    return NextResponse.json(
      { error: 'Lỗi kết nối Gmail' },
      { status: 500 }
    )
  }
}
