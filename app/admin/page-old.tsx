import { Suspense } from 'react'

// Force dynamic rendering for admin dashboard
export const dynamic = 'force-dynamic'

async function getTenantStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/tenants`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      return { total: 0, active: 0, trial: 0, suspended: 0 }
    }

    const data = await res.json()
    const tenants = data.data || []

    return {
      total: tenants.length,
      active: tenants.filter((t: any) => t.status === 'active').length,
      trial: tenants.filter((t: any) => t.tier === 'trial').length,
      suspended: tenants.filter((t: any) => t.status === 'suspended').length
    }
  } catch (error) {
    console.error('Failed to fetch tenant stats:', error)
    return { total: 0, active: 0, trial: 0, suspended: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getTenantStats()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Manage your multi-tenant SaaS platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tenants"
          value={stats.total}
          icon="🏢"
          color="blue"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Trial"
          value={stats.trial}
          icon="🎯"
          color="yellow"
        />
        <StatCard
          title="Suspended"
          value={stats.suspended}
          icon="⏸️"
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Create New Tenant"
            description="Set up a new business tenant"
            href="/admin/tenants/new"
            icon="➕"
          />
          <QuickActionCard
            title="View All Tenants"
            description="Manage existing tenants"
            href="/admin/tenants"
            icon="📋"
          />
          <QuickActionCard
            title="View Documentation"
            description="Setup guides and API docs"
            href="/docs"
            icon="📚"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <p className="text-gray-500">Activity tracking coming soon...</p>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string
  value: number
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`text-4xl p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  icon
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <a
      href={href}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </a>
  )
}
