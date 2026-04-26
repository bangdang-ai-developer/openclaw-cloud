import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://openclaw:openclaw_dev_password@localhost:5432/openclaw_cloud'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      // Find user
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1 AND status = $2',
        [email.toLowerCase(), 'active']
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Email hoặc mật khẩu không đúng' },
          { status: 401 }
        )
      }

      const user = result.rows[0]

      // Verify password (in production, use bcrypt.compare)
      if (user.password_hash !== password) {
        return NextResponse.json(
          { error: 'Email hoặc mật khẩu không đúng' },
          { status: 401 }
        )
      }

      // Update last login
      await client.query(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      )

      // Return user data (in production, generate JWT token)
      return NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công!',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          tier: user.tier,
          phone: user.phone
        },
        token: 'mock-jwt-token-' + user.id // In production, use real JWT
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
