'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      window.location.href = '/login'
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🦞</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">OpenClaw Cloud</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Xin chào, {user?.fullName || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Chào mừng đến với OpenClaw Cloud. Hãy bắt đầu thiết lập AI assistant của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Emails đã phân loại</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Thời gian tiết kiệm</p>
                <p className="text-3xl font-bold text-gray-900">0h</p>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tasks tự động</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Response rate</p>
                <p className="text-3xl font-bold text-gray-900">0%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bắt đầu với OpenClaw Cloud 🚀
          </h2>
          <p className="text-gray-600 mb-6">
            Theo các bước sau để thiết lập AI assistant của bạn
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kết nối Gmail</h3>
                  <p className="text-sm text-gray-500">Cho phép OpenClaw truy cập email của bạn</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Kết nối
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Thiết lập Email Triage</h3>
                  <p className="text-sm text-gray-500">Cấu hình AI phân loại email tự động</p>
                </div>
              </div>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed">
                Sắp có
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kết nối Calendar</h3>
                  <p className="text-sm text-gray-500">Tự động hóa lịch họp và appointment</p>
                </div>
              </div>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed">
                Sắp có
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Thiết lập Task Management</h3>
                  <p className="text-sm text-gray-500">Tự động tạo và theo dõi tasks</p>
                </div>
              </div>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed">
                Sắp có
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-blue-800 text-sm">
            OpenClaw Cloud đang trong giai đoạn beta. Các tính năng sẽ được thêm dần theo thời gian.
            Cảm ơn bạn đã là một trong những người dùng đầu tiên!
          </p>
        </div>
      </main>
    </div>
  )
}
