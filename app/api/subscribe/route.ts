import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Owner email to receive notifications
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'bang@example.com'

// Email validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, companyName, tierInterest } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send notification email to owner
    try {
      await resend.emails.send({
        from: 'OpenClaw Cloud <onboarding@resend.dev>',
        to: OWNER_EMAIL,
        subject: `🎉 New Email Signup: ${email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🎉 New Email Signup!</h2>
            <p style="color: #666;">You have a new subscriber for OpenClaw Cloud:</p>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              ${fullName ? `<p style="margin: 5px 0;"><strong>Name:</strong> ${fullName}</p>` : ''}
              ${companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>` : ''}
              ${tierInterest ? `<p style="margin: 5px 0;"><strong>Interest:</strong> ${tierInterest} tier</p>` : ''}
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            </div>

            <p style="color: #666;">
              <strong>Next Steps:</strong>
            </p>
            <ol style="color: #666; line-height: 1.6;">
              <li>Add this email to your waitlist spreadsheet</li>
              <li>Send a welcome email within 24 hours</li>
              <li>Offer a quick demo call if they're interested</li>
            </ol>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                This is an automated notification from OpenClaw Cloud landing page.
              </p>
            </div>
          </div>
        `,
      })

      // Send confirmation email to subscriber (optional)
      await resend.emails.send({
        from: 'OpenClaw Cloud <onboarding@resend.dev>',
        to: email,
        subject: '🎉 Chào mừng bạn tham gia OpenClaw Cloud!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px;">🦞</div>
              <h1 style="color: #333;">OpenClaw Cloud</h1>
            </div>

            <h2 style="color: #333;">Chào mừng bạn! 🎉</h2>

            <p style="color: #666; line-height: 1.6;">
              Cảm ơn bạn đã đăng ký với OpenClaw Cloud! Bạn đã được thêm vào danh sách chờ của chúng tôi.
            </p>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0891b2; margin-top: 0;">✨ Dự kiến sắp tới:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Email tự động phân loại (AI)</li>
                <li>Lịch họp thông minh</li>
                <li>Quản lý tasks tự động</li>
                <li>Hỗ trợ customer service 24/7</li>
              </ul>
            </div>

            <p style="color: #666; line-height: 1.6;">
              <strong>Ưu đãi early bird:</strong> Giảm 50% cho 100 khách hàng đầu tiên!
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://openclaw-cloud-ls9a.vercel.app"
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Truy cập trang web
              </a>
            </div>

            <p style="color: #666; line-height: 1.6;">
              Chúng tôi sẽ liên hệ với bạn sớm để discuss về nhu cầu của bạn.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
              <p>Bạn nhận email này vì đã đăng ký tại OpenClaw Cloud.</p>
              <p>Questions? Reply to this email!</p>
            </div>
          </div>
        `,
      })

      return NextResponse.json({
        success: true,
        message: '🎉 Chúc mừng! Bạn đã được thêm vào danh sách chờ. Kiểm tra email để xác nhận!',
        isNew: true
      })
    } catch (emailError: any) {
      console.error('Resend error:', emailError)

      // Fallback: Still return success even if email fails
      // (Don't block user signup if email service has issues)
      return NextResponse.json({
        success: true,
        message: '🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.',
        isNew: true,
        note: 'Email notification failed (logged for investigation)'
      })
    }
  } catch (error: any) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      // Return info about the subscription system
      return NextResponse.json({
        success: true,
        system: 'Resend Email Service',
        status: 'Active',
        info: 'Email subscriptions are sent via email notifications',
        ownerEmail: OWNER_EMAIL
      })
    }

    // For now, just confirm email format is valid
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email format is valid',
      email: email
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
