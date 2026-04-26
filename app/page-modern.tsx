'use client'

import { useState, FormEvent, useEffect } from 'react'

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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTYwIDBMMCAwdjYweiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-[0.03]" />

      {/* Header with Glassmorphism */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-2xl">🦞</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl animate-ping opacity-20" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              OpenClaw Cloud
            </span>
          </div>
          <nav className="hidden md:flex gap-8">
            {['Tính năng', 'Bảng giá', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace('ã', 'a').replace('á', 'a')}`}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <button
            onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">Dùng thử miễn phí</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="relative z-10">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-lg shadow-blue-500/20 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            🎉 Ưu đãi sớm - Giảm 50% cho 100 khách hàng đầu tiên
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Trợ Lý AI Tự Động Hóa
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent relative">
              Doanh Nghiệp Của Bạn
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4C50 1 150 7 200 4" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Drowning trong email, lịch họp, và tasks hàng ngày? Để AI lo hết. Bạn dành thời gian cho việc quan trọng hơn - phát triển doanh nghiệp.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-lg font-semibold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 Bắt đầu miễn phí - 14 ngày
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="group relative px-10 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl text-lg font-semibold hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-.553-.894l-2-1z" />
                </svg>
                Xem demo video
              </span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: '✓', text: 'Không cần thẻ tín dụng' },
              { icon: '⚡', text: 'Setup trong 5 phút' },
              { icon: '🔒', text: 'Hủy bất cứ lúc nào' }
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-shadow">
                <span className="text-green-500 text-lg">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add custom animations to global CSS */}
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
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
