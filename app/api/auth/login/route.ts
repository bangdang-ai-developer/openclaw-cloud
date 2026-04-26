import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

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

    // Attempt login
    const result = await loginUser(email, password)

    if (!result) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.full_name,
        tier: result.user.tier,
        phone: result.user.phone
      },
      token: result.token,
      tenants: result.tenants
    })
  } catch (error: any) {
    console.error('Login error:', error)

    // Handle specific errors
    if (error.message === 'User account is not active') {
      return NextResponse.json(
        { error: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
