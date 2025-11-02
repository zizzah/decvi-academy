import { NextResponse } from 'next/server'
import { sendEmail, sendVerificationEmail, sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, type, token, firstName } = body
    
    let result
    
    if (type === 'verification') {
      result = await sendVerificationEmail(to, token || 'test-token-123')
    } else if (type === 'welcome') {
      result = await sendWelcomeEmail(to, firstName || 'Test User')
    } else {
      // Basic test email
      result = await sendEmail({
        to: to || process.env.EMAIL_SERVER_USER,
        subject: 'Test Email from DC VI Tech Academy',
        html: `
          <h1>Test Email</h1>
          <p>This is a test email sent at ${new Date().toLocaleString()}</p>
          <p>If you're seeing this, your email configuration is working! ✅</p>
        `,
      })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}