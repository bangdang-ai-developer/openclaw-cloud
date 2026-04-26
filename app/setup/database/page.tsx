'use client'

import { useState } from 'react'

export default function DatabaseSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function runMigration() {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/setup/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          setupKey: 'setup-multi-tenant-platform'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Migration failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function checkStatus() {
    try {
      const res = await fetch('/api/setup/migrate')
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗄️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Database Setup
            </h1>
            <p className="text-gray-600">
              Initialize your multi-tenant database with one click
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              📋 Prerequisites
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>
                <strong>Environment variables added to Vercel</strong> (DATABASE_URL, JWT_SECRET)
              </li>
              <li>
                <strong>PostgreSQL database ready</strong> (Supabase account active)
              </li>
            </ol>
          </div>

          {/* Action Button */}
          <div className="text-center">
            {!result && !error && (
              <button
                onClick={runMigration}
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Initializing...' : '🚀 Initialize Database'}
              </button>
            )}

            {result && result.success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  ✅ {result.message}
                </h3>
                <div className="text-sm text-green-800 mb-4">
                  Created {result.data.count} tables successfully
                </div>
                <div className="bg-white rounded p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tables created:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.data.tables.map((table: string) => (
                      <span
                        key={table}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>✨ Next Steps:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      <a href="/admin" className="text-blue-600 hover:underline">
                        Visit Admin Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="/admin/tenants/new" className="text-blue-600 hover:underline">
                        Create your first tenant
                      </a>
                    </li>
                    <li>
                      <a href="/trial/signup" className="text-blue-600 hover:underline">
                        Test trial signup flow
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">
                  ❌ Setup Failed
                </h3>
                <p className="text-red-700 mb-4">{error}</p>

                {error.includes('Database connection failed') && (
                  <div className="bg-white rounded p-4">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>💡 Solution:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                      <li>
                        Go to{' '}
                        <a
                          href="https://vercel.com/dashboard"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Vercel Dashboard
                        </a>
                      </li>
                      <li>
                        Select project: <strong>openclaw-cloud-five</strong>
                      </li>
                      <li>
                        Go to <strong>Settings → Environment Variables</strong>
                      </li>
                      <li>
                        Add DATABASE_URL:
                        <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
                          postgres://postgres.qswngadupfdpyvntlccg:mvbyCysNeBANWSRZ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
                        </code>
                      </li>
                      <li>Redeploy application</li>
                      <li>Come back and try again</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Database Status Check */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Database Status
          </h2>

          <div className="text-center mb-6">
            <button
              onClick={checkStatus}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              🔄 Check Status
            </button>
          </div>

          {result && result.data && (
            <div className={result.success ? 'bg-green-50 border border-green-200 rounded-lg p-6' : 'bg-yellow-50 border border-yellow-200 rounded-lg p-6'}>
              <p className="font-semibold mb-3">
                {result.status === 'already_migrated' ? '✅ Database Initialized' : '⏳ Not Initialized'}
              </p>
              <p className="text-sm text-gray-700 mb-4">{result.message}</p>

              {result.data.tables && (
                <div className="bg-white rounded p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tables ({result.data.count}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.data.tables.map((table: string) => (
                      <span
                        key={table}
                        className={`px-3 py-1 rounded-full text-sm ${
                          ['users', 'tenants', 'tenant_users', 'agents', 'integrations', 'activity_logs'].includes(table)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Environment Variables Reference */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔑 Environment Variables Reference
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                DATABASE_URL
              </p>
              <code className="block p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                {process.env.POSTGRES_URL || 'postgres://postgres.qswngadupfdpyvntlccg:mvbyCysNeBANWSRZ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'}
              </code>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                JWT_SECRET
              </p>
              <code className="block p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                {process.env.JWT_SECRET || '9kAPHwmHgh6a77wclNzgJxzTYUrt/umjWm1bYg63JPtzfeHSlMchlPiecTgIWIIRzSJik/0agNW1OKBIZcKfXA=='}
              </code>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Add these to Vercel:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-900">
                <li>
                  Go to{' '}
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Vercel Dashboard
                  </a>
                </li>
                <li>
                  Select project: <strong>openclaw-cloud-five</strong>
                </li>
                <li>Settings → Environment Variables</li>
                <li>Add DATABASE_URL and JWT_SECRET</li>
                <li>Redeploy</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Need help? Check{' '}
          <a href="/QUICK_START.md" className="text-blue-600 hover:underline">
            Quick Start Guide
          </a>
        </div>
      </div>
    </div>
  )
}
