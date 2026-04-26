import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// OAuth2 client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
})

// Scopes for Gmail API
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
]

export async function GET(request: NextRequest) {
  try {
    // Generate OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
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
