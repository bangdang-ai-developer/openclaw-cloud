import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Mock function to get OAuth2 client
async function getOAuth2Client(userId: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  // In production, fetch from database
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const emailId = params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const oauth2Client = await getOAuth2Client(userId)

    if (!oauth2Client) {
      return NextResponse.json(
        { error: 'Gmail chưa được kết nối' },
        { status: 401 }
      )
    }

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Fetch full message
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full'
    })

    const message = response.data

    // Extract headers
    const headers = message.payload?.headers || []
    const getHeader = (name: string) => headers.find(h => h.name === name)?.value || ''

    // Extract body
    let body = ''
    if (message.payload?.body?.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8')
    } else if (message.payload?.parts) {
      // Multipart message
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8')
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      email: {
        id: message.id,
        threadId: message.threadId,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        body: body,
        snippet: message.snippet,
        labelIds: message.labelIds,
        historyId: message.historyId
      }
    })
  } catch (error: any) {
    console.error('Gmail detail error:', error)

    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Email không tìm thấy' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Lỗi loading email' },
      { status: 500 }
    )
  }
}
