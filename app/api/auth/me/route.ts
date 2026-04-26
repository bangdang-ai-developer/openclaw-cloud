import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In production, verify JWT token
    // For MVP, return mock user data
    if (token.startsWith('mock-jwt-token-')) {
      return NextResponse.json({
        success: true,
        user: {
          id: token.replace('mock-jwt-token-', ''),
          email: 'user@example.com',
          fullName: 'Demo User',
          tier: 'starter'
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}
