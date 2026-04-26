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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your multi-tenant SaaS platform</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Operational
          </div>
        </div>
      </div>

      {/* Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tenants"
          value={stats.total}
          icon="🏢"
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon="✅"
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Trial"
          value={stats.trial}
          icon="🎯"
          color="yellow"
          trend="+5"
        />
        <StatCard
          title="Suspended"
          value={stats.suspended}
          icon="⏸️"
          color="red"
          trend="-2"
        />
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl shadow-blue-500/10 rounded-3xl p-8 mb-6 animate-fade-in hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Create New Tenant"
            description="Set up a new business tenant"
            href="/admin/tenants/new"
            icon="➕"
            gradient="from-blue-500 to-indigo-500"
          />
          <QuickActionCard
            title="View All Tenants"
            description="Manage existing tenants"
            href="/admin/tenants"
            icon="📋"
            gradient="from-purple-500 to-pink-500"
          />
          <QuickActionCard
            title="View Documentation"
            description="Setup guides and API docs"
            href="/docs"
            icon="📚"
            gradient="from-cyan-500 to-blue-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl shadow-purple-500/10 rounded-3xl p-8 animate-fade-in hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                {i}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Activity item {i}</p>
                <p className="text-sm text-gray-500">Details about activity {i}</p>
              </div>
              <span className="text-sm text-gray-400">{i}h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  trend
}: {
  title: string
  value: number
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'red'
  trend?: string
}) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-indigo-500',
      text: 'text-blue-700',
      badge: 'bg-blue-100'
    },
    green: {
      bg: 'from-green-500 to-emerald-500',
      text: 'text-green-700',
      badge: 'bg-green-100'
    },
    yellow: {
      bg: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100'
    },
    red: {
      bg: 'from-red-500 to-pink-500',
      text: 'text-red-700',
      badge: 'bg-red-100'
    }
  }

  return (
    <div className="group relative backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl shadow-blue-500/10 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Animated background blob */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colorClasses[color].bg} rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {trend && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorClasses[color].badge} ${colorClasses[color].text}`}>
              {trend}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </p>
          <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color].bg} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
  gradient
}: {
  title: string
  description: string
  href: string
  icon: string
  gradient: string
}) {
  return (
    <a
      href={href}
      className="group block p-6 backdrop-blur-xl bg-white/60 border-2 border-white/20 rounded-3xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
          {icon}
        </div>
        <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  )
}

// Add animations
<style jsx global>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.4s ease-out forwards;
  }
`}</style>
