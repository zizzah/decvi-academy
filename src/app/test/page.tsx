'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  const testBasicEmail = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email }),
      })
      const data = await response.json()
      setResult(data)
      console.log('Email result:', data)
    } catch (error) {
      setResult({ success: false, error: String(error) })
      console.error('Email error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testVerificationEmail = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: email,
          type: 'verification',
          token: 'test-token-' + Date.now()
        }),
      })
      const data = await response.json()
      setResult(data)
      console.log('Verification email result:', data)
    } catch (error) {
      setResult({ success: false, error: String(error) })
      console.error('Verification email error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testWelcomeEmail = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: email,
          type: 'welcome',
          firstName: 'Test User'
        }),
      })
      const data = await response.json()
      setResult(data)
      console.log('Welcome email result:', data)
    } catch (error) {
      setResult({ success: false, error: String(error) })
      console.error('Welcome email error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Email Service Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test your email configuration and preview different email templates
          </p>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Test Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={testBasicEmail}
              disabled={!email || loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>

            <button
              onClick={testVerificationEmail}
              disabled={!email || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>

            <button
              onClick={testWelcomeEmail}
              disabled={!email || loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Sending...' : 'Send Welcome Email'}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3">
                  {result.success ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.success ? 'Email Sent Successfully!' : 'Email Failed'}
                  </h3>
                  <div className="text-sm">
                    {result.success ? (
                      <div className="text-green-800">
                        <p><strong>Message ID:</strong> {result.messageId}</p>
                        <p className="mt-2">Check your inbox (and spam folder) at <strong>{email}</strong></p>
                      </div>
                    ) : (
                      <div className="text-red-800">
                        <p><strong>Error:</strong></p>
                        <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto text-xs">
                          {JSON.stringify(result.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📝 Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Enter your email address above</li>
              <li>• Click one of the test buttons</li>
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Check the browser console for detailed logs</li>
            </ul>
          </div>

          {/* Environment Check */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Remember</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Ensure your .env.local file has all EMAIL_* variables</li>
              <li>• Gmail users need an App Password, not regular password</li>
              <li>• Restart your dev server after changing environment variables</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}