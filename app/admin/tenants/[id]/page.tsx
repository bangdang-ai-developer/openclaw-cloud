'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Tenant {
  id: string
  slug: string
  business_name: string
  logo_url: string | null
  industry: string | null
  contact_email: string | null
  contact_phone: string | null
  tier: string
  status: string
  trial_ends_at: string | null
  created_at: string
  settings: Record<string, any>
  users?: Array<{
    id: string
    email: string
    full_name: string | null
    role: string
    joined_at: string
  }>
}

export default function TenantDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTenant()
  }, [params.id])

  async function fetchTenant() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tenants/${params.id}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch tenant')
      }

      setTenant(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSuspend() {
    if (!confirm('Are you sure you want to suspend this tenant?')) return

    try {
      const res = await fetch(`/api/admin/tenants/${params.id}?action=suspend`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to suspend tenant')
      }

      fetchTenant() // Refresh
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to permanently delete this tenant? This action cannot be undone!')) return

    try {
      const res = await fetch(`/api/admin/tenants/${params.id}?action=delete`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete tenant')
      }

      router.push('/admin/tenants')
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error || !tenant) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Tenant not found'}</p>
        <Link href="/admin/tenants" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Tenants
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900">{tenant.business_name}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {tenant.status}
            </span>
          </div>
          <p className="text-gray-600 mt-2">/{tenant.slug}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/tenants/${tenant.id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleSuspend}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            Suspend
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.business_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.slug}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.industry || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tier</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tenant.tier === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                    tenant.tier === 'starter' ? 'bg-blue-100 text-blue-800' :
                    tenant.tier === 'professional' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {tenant.tier}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.contact_email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.contact_phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(tenant.created_at).toLocaleDateString('vi-VN')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trial Ends</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {tenant.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString('vi-VN') : '-'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              <Link
                href={`/admin/tenants/${tenant.id}/users`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Manage Users →
              </Link>
            </div>
            {tenant.users && tenant.users.length > 0 ? (
              <div className="space-y-3">
                {tenant.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name || user.email}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No users in this tenant yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Logo */}
          {tenant.logo_url && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Logo</h3>
              <img src={tenant.logo_url} alt={tenant.business_name} className="max-w-full h-auto" />
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`https://${tenant.slug}.openclaw-cloud.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-center"
              >
                Visit Tenant Site
              </a>
              <Link
                href={`/admin/tenants/${tenant.id}/users`}
                className="block px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-center"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Users</span>
                <span className="text-sm font-medium text-gray-900">{tenant.users?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-sm font-medium ${
                  tenant.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tenant.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
