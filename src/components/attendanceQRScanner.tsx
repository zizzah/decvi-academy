
'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AttendanceQRScanner({ studentId }: { studentId: string }) {
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCheckIn = async () => {
    if (!qrCode) {
      setMessage('Please enter QR code')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Extract classId from QR code
      const classId = qrCode.split('-')[0]

      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          classId,
          method: 'QR_CODE',
          qrCode,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Checked in successfully!')
        setQrCode('')
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Failed to check in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          QR Code Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Enter QR Code</label>
          <Input
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            placeholder="Scan or enter QR code"
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleCheckIn}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Checking in...' : 'Check In'}
        </Button>

        {message && (
          <div
            className={`p-3 rounded ${
              message.startsWith('✅')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

