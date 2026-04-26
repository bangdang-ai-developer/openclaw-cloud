'use client'

import { useState } from 'react'

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])

  const addResult = (test: string, status: 'success' | 'error' | 'pending', message: string, details?: any) => {
    setTestResults(prev => [...prev, { test, status, message, details, timestamp: new Date().toISOString() }])
  }

  const testAdminDashboard = async () => {
    try {
      const res = await fetch('/admin')
      addResult('Admin Dashboard Page', 'success', 'Page accessible', { status: res.status })
    } catch (error: any) {
      addResult('Admin Dashboard Page', 'error', 'Failed to load', { error: error.message })
    }
  }

  const testTenantListAPI = async () => {
    try {
      const res = await fetch('/api/admin/tenants')
      const data = await res.json()
      addResult('GET /api/admin/tenants', res.ok ? 'success' : 'error', res.ok ? 'API working' : 'API error', {
        status: res.status,
        data
      })
    } catch (error: any) {
      addResult('GET /api/admin/tenants', 'error', 'Failed to fetch', { error: error.message })
    }
  }

  const testCreateTenant = async () => {
    try {
      const testTenant = {
        business_name: `Test Company ${Date.now()}`,
        slug: `test-${Date.now()}`,
        industry: 'tech',
        contact_email: `test${Date.now()}@example.com`,
        tier: 'trial',
        adminEmail: `admin${Date.now()}@example.com`,
        adminFullName: 'Test Admin',
        adminPassword: 'test123456'
      }

      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testTenant)
      })

      const data = await res.json()
      addResult('POST /api/admin/tenants (Create Tenant)', res.ok ? 'success' : 'error',
        res.ok ? 'Tenant created successfully' : 'Failed to create tenant',
        { status: res.status, data, testTenant }
      )
    } catch (error: any) {
      addResult('POST /api/admin/tenants', 'error', 'Request failed', { error: error.message })
    }
  }

  const testStats = async () => {
    try {
      const res = await fetch('/api/admin/tenants')
      const data = await res.json()

      const tenants = data.data || []
      const stats = {
        total: tenants.length,
        active: tenants.filter((t: any) => t.status === 'active').length,
        trial: tenants.filter((t: any) => t.tier === 'trial').length,
        suspended: tenants.filter((t: any) => t.status === 'suspended').length
      }

      addResult('Tenant Stats', 'success', 'Statistics calculated', stats)
    } catch (error: any) {
      addResult('Tenant Stats', 'error', 'Failed to calculate', { error: error.message })
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    addResult('Test Suite', 'pending', 'Starting tests...')

    await testAdminDashboard()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testTenantListAPI()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testStats()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testCreateTenant()

    addResult('Test Suite', 'success', 'All tests completed')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🔧 Admin Platform Test Suite
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={runAllTests}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🚀 Run All Tests
            </button>
            <button
              onClick={testAdminDashboard}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              📊 Test Dashboard
            </button>
            <button
              onClick={testTenantListAPI}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              📋 Test Tenant API
            </button>
            <button
              onClick={testCreateTenant}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              ➕ Test Create Tenant
            </button>
            <button
              onClick={() => window.open('/admin', '_blank')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              🌐 Open Admin Dashboard
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
            <button
              onClick={() => setTestResults([])}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Results
            </button>
          </div>

          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tests run yet. Click "Run All Tests" to begin.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : result.status === 'error'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⏳'}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{result.test}</h3>
                      <p className={`font-semibold ${
                        result.status === 'success' ? 'text-green-700' :
                        result.status === 'error' ? 'text-red-700' :
                        'text-yellow-700'
                      }`}>
                        {result.message}
                      </p>
                      {result.details && (
                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{new Date(result.timestamp).toLocaleTimeString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Test Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Manual Test Checklist</h2>
          <div className="space-y-3">
            {[
              { label: 'Admin dashboard loads without errors', checked: false },
              { label: 'Stats cards display correct numbers', checked: false },
              { label: 'Create Tenant button navigates to form', checked: false },
              { label: 'Tenant list displays all tenants', checked: false },
              { label: 'Can create new tenant via form', checked: false },
              { label: 'Created tenant appears in list', checked: false },
              { label: 'Tenant detail page loads', checked: false },
              { label: 'Can edit tenant information', checked: false },
              { label: 'Can add user to tenant', checked: false },
              { label: 'All buttons are clickable', checked: false },
              { label: 'UI is responsive on mobile', checked: false },
              { label: 'No console errors', checked: false }
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded"
                  onChange={(e) => {
                    const items = document.querySelectorAll('input[type="checkbox"]')
                    // Just for visual feedback
                  }}
                />
                <span className="text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
