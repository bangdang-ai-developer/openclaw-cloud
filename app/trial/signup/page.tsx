'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FormData {
  // Step 1: Business Info
  businessName: string
  industry: string
  businessEmail: string

  // Step 2: Account
  fullName: string
  email: string
  password: string
  confirmPassword: string

  // Step 3: Preferences
  aiPreferences: string[]
  notificationEmail: boolean
}

export default function TrialSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    businessEmail: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    aiPreferences: [],
    notificationEmail: true
  })

  const aiOptions = [
    { id: 'email_triage', label: 'Email Triage & Prioritization', icon: '📧' },
    { id: 'calendar', label: 'Smart Calendar Scheduling', icon: '📅' },
    { id: 'tasks', label: 'Task Management', icon: '✅' },
    { id: 'support', label: 'Customer Support Automation', icon: '💬' }
  ]

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function toggleAiPreference(id: string) {
    setFormData(prev => ({
      ...prev,
      aiPreferences: prev.aiPreferences.includes(id)
        ? prev.aiPreferences.filter(p => p !== id)
        : [...prev.aiPreferences, id]
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: '',
          businessName: formData.businessName,
          industry: formData.industry
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect to onboarding checklist
      router.push('/trial/onboarding?success=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function nextStep() {
    setError('')

    // Validate current step
    if (step === 1) {
      if (!formData.businessName || !formData.industry || !formData.businessEmail) {
        setError('Please fill in all fields')
        return
      }
      if (!formData.businessEmail.includes('@')) {
        setError('Please enter a valid email')
        return
      }
    }

    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }

    setStep(step + 1)
  }

  function prevStep() {
    setStep(step - 1)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🦞</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Start Your Free Trial
          </h1>
          <p className="text-gray-600">
            14 days free. No credit card required.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tell us about your business
                </h2>
                <p className="text-gray-600">
                  We'll customize your trial experience based on your industry.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="My Business Co. Ltd."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your industry...</option>
                  <option value="technology">Technology</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="consulting">Consulting</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  placeholder="contact@mybusiness.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={nextStep}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Account */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create your account
                </h2>
                <p className="text-gray-600">
                  You'll be the owner of this business account.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose your AI preferences
                </h2>
                <p className="text-gray-600">
                  Select the AI capabilities you want to try. You can change this later.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {aiOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleAiPreference(option.id)}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      formData.aiPreferences.includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificationEmail"
                  checked={formData.notificationEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, notificationEmail: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="notificationEmail" className="ml-2 text-sm text-gray-700">
                  Send me tips and best practices during my trial
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>🎁 Early Bird Offer:</strong> Get 50% off if you upgrade within your trial period!
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Start My Free Trial 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}
