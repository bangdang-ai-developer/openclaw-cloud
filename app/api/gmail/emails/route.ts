import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { Pool } from 'pg'

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://openclaw:openclaw_dev_password@localhost:5432/openclaw_cloud'
})

// Get OAuth2 client for user
async function getOAuth2Client(userId: string) {
  // In production, get tokens from database
  // For MVP, we'll use a simple approach

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  // TODO: Fetch tokens from database for this user
  // const { tokens } = await pool.query(
  //   'SELECT access_token, refresh_token FROM gmail_integrations WHERE user_id = $1',
  //   [userId]
  // )

  // For now, return error (need OAuth first)
  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const pageToken = searchParams.get('pageToken') || undefined

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const oauth2Client = await getOAuth2Client(userId)

    if (!oauth2Client) {
      return NextResponse.json(
        { error: 'Gmail chưa được kết nối. Vui lòng kết nối Gmail trước.' },
        { status: 401 }
      )
    }

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Fetch messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: limit,
      pageToken: pageToken,
      labelIds: ['INBOX'] // Only fetch from inbox
    })

    if (!response.data.messages) {
      return NextResponse.json({
        success: true,
        emails: [],
        nextPageToken: response.data.nextPageToken
      })
    }

    // Fetch details for each message
    const emails = await Promise.all(
      response.data.messages.slice(0, 10).map(async (message) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date']
        })

        const headers = detail.data.payload?.headers || []

        return {
          id: message.id,
          threadId: message.threadId,
          from: headers.find(h => h.name === 'From')?.value || '',
          to: headers.find(h => h.name === 'To')?.value || '',
          subject: headers.find(h => h.name === 'Subject')?.value || '',
          date: headers.find(h => h.name === 'Date')?.value || '',
          snippet: detail.data.snippet || '',
          labelIds: detail.data.labelIds || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      emails,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    })
  } catch (error: any) {
    console.error('Gmail fetch error:', error)

    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Gmail session expired. Vui lòng kết nối lại.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Lỗi fetching emails. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
