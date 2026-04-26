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

    // Read existing users
    const users = await readUsers()

    // Check if user exists
    const existingUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      email: email.toLowerCase(),
      password_hash: password, // In production, hash this with bcrypt!
      full_name: fullName || null,
      tier: 'starter',
      status: 'active',
      phone: null,
      created_at: new Date().toISOString(),
      last_login_at: null
    }

    users.push(newUser)
    await writeUsers(users)

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        tier: newUser.tier
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
