import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Không tìm thấy authorization code' },
        { status: 400 }
      )
    }

    // OAuth2 client configuration
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    // Store tokens (in production, save to database)
    // For now, return success with user info
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?gmail_connected=true&email=${data.email}`
    )
  } catch (error: any) {
    console.error('Gmail callback error:', error)
    return NextResponse.json(
      { error: 'Lỗi kết nối Gmail' },
      { status: 500 }
    )
  }
}
