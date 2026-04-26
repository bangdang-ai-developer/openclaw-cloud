import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://openclaw:openclaw_dev_password@localhost:5432/openclaw_cloud'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    // Check if user exists
    const client = await pool.connect()
    try {
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
      )

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 409 }
        )
      }

      // Create new user
      const result = await client.query(
        `INSERT INTO users (email, password_hash, full_name, tier, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, full_name, tier, status, created_at`,
        [
          email.toLowerCase(),
          password, // In production, hash this with bcrypt!
          fullName || null,
          'starter',
          'active'
        ]
      )

      const user = result.rows[0]

      return NextResponse.json({
        success: true,
        message: 'Đăng ký thành công!',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          tier: user.tier
        }
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
