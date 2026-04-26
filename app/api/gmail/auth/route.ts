import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getCurrentTenant } from '@/lib/auth-middleware'
import { findTenantById } from '@/lib/tenant'

// Scopes for Gmail API
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
]

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user and tenant
    const authContext = await getCurrentTenant(request)

    if (!authContext) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { user, tenantId } = authContext

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

    // Generate OAuth URL with tenant context in state
    const state = JSON.stringify({
      tenantId,
      userId: user.userId,
      redirect: '/dashboard'
    })

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: Buffer.from(state).toString('base64')
    })

    // Redirect to Google OAuth consent screen
    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('Gmail auth error:', error)
    return NextResponse.json(
      { error: 'Lỗi kết nối Gmail API' },
      { status: 500 }
    )
  }
}
