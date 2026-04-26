'use client'

import { Metadata } from 'next'
import { useState, FormEvent } from 'react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [tierInterest, setTierInterest] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          companyName,
          tierInterest
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || '🎉 Đăng ký thành công!'
        })
        // Clear form on success
        setEmail('')
        setFullName('')
        setCompanyName('')
        setTierInterest('')
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Có lỗi xảy ra. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Không thể kết nối đến server. Vui lòng thử lại.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🦞</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">OpenClaw Cloud</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Tính năng</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600">Bảng giá</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</a>
          </nav>
          <button
            onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Dùng thử miễn phí
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          🎉 Ưu đãi sớm - Giảm 50% cho 100 khách hàng đầu tiên
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Trợ Lý AI Tự Động Hóa<br />
          <span className="text-blue-600">Doanh Nghiệp Của Bạn</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Drowning trong email, lịch họp, và tasks hàng ngày? Để AI lo hết. Bạn dành thời gian cho việc quan trọng hơn - phát triển doanh nghiệp.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            🚀 Bắt đầu miễn phí - 14 ngày
          </button>
          <button className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border border-gray-300">
            📹 Xem demo video
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Không cần thẻ tín dụng
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Setup trong 5 phút
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Hủy bất cứ lúc nào
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Đã có <span className="font-bold text-blue-600">23</span> doanh nghiệp đăng ký chờ đợi</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Công ty A</div>
            <div className="text-2xl font-bold text-gray-400">Doanh nghiệp B</div>
            <div className="text-2xl font-bold text-gray-400">Startup C</div>
            <div className="text-2xl font-bold text-gray-400">Nhóm D</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Bạn có đang gặp những vấn đề này?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Drowning trong email
              </h3>
              <p className="text-gray-600">
                Mất 2-4 giờ mỗi ngày chỉ để đọc và phân loại email. Quan trọng bị淹没 trong spam.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Lịch họp lộn xộn
              </h3>
              <p className="text-gray-600">
                Double-bookings, no-shows, và hàng giờ来回 email chỉ để set up một cuộc họp.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">😫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Không có thời gian cho chiến lược
              </h3>
              <p className="text-gray-600">
                Dành cả ngày cho tactical tasks, không còn thời gian để think về big picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            OpenClaw Cloud giải quyết tất cả
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            AI assistant làm việc 24/7, không bao giờ complain, không bao giờ sick.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Triage Thông Minh
                </h3>
                <p className="text-gray-600">
                  AI tự động phân loại email thành: Khẩn cấp, Quan trọng, Bình thường, Spam.
                  Draft responses cho các inquiry thường gặp. Bạn chỉ cần review và click send.
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  ⏱️ Tiết kiệm 2-3 giờ/ngày
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Calendar Auto-Scheduling
                </h3>
                <p className="text-gray-600">
                  AI tự động lên lịch họp, giải quyết conflicts, send reminders,
                  và thậm chí reschedule nếu có thay đổi.
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  ⏱️ Tiết kiệm 5-10 giờ/tuần
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Task Management
                </h3>
                <p className="text-gray-600">
                  AI tự động tạo tasks từ email, chat, và meetings.
                  Theo dõi deadlines, send reminders, và weekly summaries.
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  ⏱️ Không bao giờ miss deadline nữa
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Customer Support Auto-Response
                </h3>
                <p className="text-gray-600">
                  Xử lý 80% customer inquiries automatically.
                  Chỉ escalate cases phức tạp đến bạn.
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  ⏱️ Giảm 70% support workload
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Kết quả thực tế từ customers
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-6xl font-bold mb-2">10+</div>
              <div className="text-xl opacity-90">giờ tiết kiệm mỗi tuần</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-2">3x</div>
              <div className="text-xl opacity-90">tăng response speed</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-2">0</div>
              <div className="text-xl opacity-90">email bị missed</div>
            </div>
          </div>

          <div className="mt-16 bg-white/10 backdrop-blur rounded-xl p-8">
            <p className="text-xl italic mb-4">
              "Tôi đã skeptic về AI automation, nhưng OpenClaw Cloud thực sự works.
              Email inbox của tôi luôn clean, và tôi không còn miss meetings nữa.
              Best investment cho business của tôi."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <div className="font-semibold">Nguyễn Văn A</div>
                <div className="opacity-75">Founder, Marketing Agency ABC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Bảng giá đơn giản
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Không có hidden fees. Hủy bất cứ lúc nào.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ₫1,250,000
                </div>
                <div className="text-gray-500">/tháng</div>
                <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold mt-3">
                  🎉 Ưu đãi sớm - Giảm 50%
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  1 AI Agent
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Email automation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Calendar scheduling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  5,000 API calls/tháng
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Community support
                </li>
              </ul>

              <button
                onClick={() => {
                  setTierInterest('starter')
                                          document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })
                                        }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Bắt đầu miễn phí
              </button>
            </div>

            {/* Business Plan - Popular */}
            <div className="bg-blue-600 text-white rounded-xl p-8 transform scale-105 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  ⭐ PHỔ BIẾN NHẤT
                </div>
                <h3 className="text-2xl font-bold mb-2">Business</h3>
                <div className="text-4xl font-bold mb-1">
                  ₫2,500,000
                </div>
                <div className="opacity-75">/tháng</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  3 AI Agents
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Tất cả Starter features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Task management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Social media automation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  25,000 API calls/tháng
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Priority support
                </li>
              </ul>

              <button
                onClick={() => {
                  setTierInterest('business')
                                          document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })
                                        }}
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Bắt đầu miễn phí
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  Custom
                </div>
                <div className="text-gray-500">Liên hệ để báo giá</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Unlimited AI Agents
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Tất cả Business features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Custom integrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Dedicated infrastructure
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  SLA guarantees
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Vietnamese account manager
                </li>
              </ul>

              <button
                onClick={() => {
                  setTierInterest('enterprise')
                                          document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })
                                        }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tôi cần kỹ thuật gì để dùng OpenClaw Cloud?
              </h3>
              <p className="text-gray-600">
                Không cần! Đó là điểm mạnh của chúng tôi. Setup trong 5 phút với guided wizard.
                Không cần coding, không cần IT knowledge. Nếu bạn biết dùng email và calendar,
                bạn có thể dùng OpenClaw Cloud.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Dữ liệu của tôi có an toàn không?
              </h3>
              <p className="text-gray-600">
                Tuyệt đối an toàn. Dữ liệu được lưu tại Vietnam data centers, encrypted AES-256.
                Chúng tôi tuân thủ Vietnam cybersecurity laws. Bạn có toàn quyền control data của mình.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tôi có thể hủy bất cứ lúc nào không?
              </h3>
              <p className="text-gray-600">
                Có, không có contract lock-in. Hủy anytime, không có cancellation fee.
                Bạn chỉ trả cho những tháng bạn dùng.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI có thể hiểu tiếng Việt không?
              </h3>
              <p className="text-gray-600">
                Có! OpenClaw Cloud được thiết kế cho Vietnam market. AI hiểu và viết tiếng Việt
                tự nhiên. Bạn có thể giao tiếp bằng tiếng Việt 100%.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tôi có thể thanh toán như thế nào?
              </h3>
              <p className="text-gray-600">
                Chúng tôi chấp nhận Momo, chuyển khoản ngân hàng (VietQR), và thẻ tín dụng/ghi nợ.
                Đối với enterprise, chúng tôi cũng chấp nhận invoice thanh toán sau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Form */}
      <section id="cta-section" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-lg">
            🎉 Ưu đãi còn 72 giờ nữa - Giảm 50%
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Bắt đầu ngay hôm nay
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Điền thông tin bên dưới để nhận <span className="font-bold text-blue-600">14 ngày dùng thử miễn phí</span> - Không cần thẻ tín dụng
          </p>

          {/* Modern Glassmorphism Form */}
          <div className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl shadow-blue-500/10 rounded-3xl p-8 md:p-12 mb-8">
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-xl font-semibold ${
                submitStatus.type === 'success'
                  ? 'bg-green-100 text-green-700 border-2 border-green-200'
                  : 'bg-red-100 text-red-700 border-2 border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  email ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                }`} />
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  fullName ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                }`} />
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  companyName ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                }`} />
              </div>

              {/* Email Field - Highlighted */}
              <div className="text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email công việc của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="vidu@congty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder:text-gray-600 placeholder:font-medium"
                />
                {!email && (
                  <p className="text-sm text-gray-600 font-medium mt-2">
                    💡 Nhập email để kích hoạt nút đăng ký
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="text-left">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-600 placeholder:font-medium"
                  />
                </div>

                {/* Company Name */}
                <div className="text-left">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🏢 Tên công ty
                  </label>
                  <input
                    type="text"
                    placeholder="Công ty ABC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-600 placeholder:font-medium"
                  />
                </div>
              </div>

              {/* Tier Interest Badge */}
              {tierInterest && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 rounded-xl text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <span className="font-semibold text-gray-700">Bạn quan tâm: </span>
                      <span className="text-blue-700 font-bold">
                        {tierInterest === 'starter' && 'Starter (₫1,250,000/tháng)'}
                        {tierInterest === 'business' && 'Business (₫2,500,000/tháng)'}
                        {tierInterest === 'enterprise' && 'Enterprise (Custom)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button - Enhanced */}
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className={`group relative w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 ${
                  isSubmitting || !email
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 text-white'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>🔄 Đang xử lý đăng ký...</>
                  ) : (
                    <>
                      🚀 Bắt đầu dùng thử MIỄN PHÍ
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              {/* Trust Badges - Enhanced */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                {[
                  { icon: '✅', text: 'Không cần thẻ tín dụng' },
                  { icon: '⚡', text: 'Kích hoạt trong 2 phút' },
                  { icon: '🔒', text: 'Hủy bất cứ lúc nào' },
                  { icon: '🇻🇳', text: 'Hỗ trợ tiếng Việt' }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Urgency Banner */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl animate-pulse">⏰</span>
              <div className="text-left">
                <p className="font-bold text-orange-900 text-lg">
                  Ưu đãi 50% chỉ dành cho 50 người đăng ký sớm nhất
                </p>
                <p className="text-orange-700">
                  Đã có <span className="font-bold">{23}/50</span> slots được đăng ký
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🦞</span>
                </div>
                <span className="text-xl font-bold">OpenClaw Cloud</span>
              </div>
              <p className="text-gray-400">
                Trợ lý AI tự động hóa doanh nghiệp của bạn
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Tính năng</a></li>
                <li><a href="#pricing" className="hover:text-white">Bảng giá</a></li>
                <li><a href="#" className="hover:text-white">Case studies</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 OpenClaw Cloud. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ in Vietnam</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}

// Add animations
<style jsx global>{`
  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`}</style>
