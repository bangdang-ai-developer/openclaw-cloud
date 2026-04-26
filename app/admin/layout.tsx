import { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🦞 OpenClaw Cloud
              </h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Logged in as Admin
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <a
              href="/admin"
              className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
            >
              Dashboard
            </a>
            <a
              href="/admin/tenants"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Tenants
            </a>
            <a
              href="/admin/tenants/new"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              New Tenant
            </a>
          </div>
        </nav>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
