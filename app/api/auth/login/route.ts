import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Simple file-based user storage for MVP
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

// Read users from file
async function readUsers() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Write users to file
async function writeUsers(users: any[]) {
  await ensureDataDir()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

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

    // Read users
    const users = await readUsers()

    // Find user
    const user = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.status === 'active'
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Update last login
    user.last_login_at = new Date().toISOString()
    await writeUsers(users)

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
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
