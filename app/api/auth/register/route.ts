import { NextRequest, NextResponse } from 'next/server'
import { registerUser, findUserByEmail } from '@/lib/auth'
import { generateSlug } from '@/lib/tenant'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, businessName, industry } = body

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
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      )
    }

    // Determine if creating tenant (trial signup)
    const createTenant = businessName ? {
      business_name: businessName,
      slug: await generateUniqueSlug(businessName),
      industry: industry,
      contact_email: email.toLowerCase(),
      tier: 'trial'
    } : undefined

    // Register user (and tenant if provided)
    const result = await registerUser({
      email,
      password,
      full_name: fullName,
      phone,
      createTenant
    })

    return NextResponse.json({
      success: true,
      message: createTenant
        ? 'Đăng ký thành công! Tenant trial đã được tạo.'
        : 'Đăng ký thành công!',
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.full_name,
        tier: result.user.tier
      },
      token: result.token,
      tenants: result.tenants
    })
  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle specific errors
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      )
    }

    if (error.message === 'Failed to create user') {
      return NextResponse.json(
        { error: 'Lỗi khi tạo người dùng. Vui lòng thử lại.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}

// Helper function to generate unique slug
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  const { generateSlug } = await import('@/lib/tenant')
  const { findTenantBySlug } = await import('@/lib/tenant')

  let slug = generateSlug(baseSlug)
  let counter = 1

  while (await findTenantBySlug(slug)) {
    slug = `${generateSlug(baseSlug)}-${counter}`
    counter++
  }

  return slug
}
