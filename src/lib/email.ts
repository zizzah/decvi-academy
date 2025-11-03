// ============================================
// lib/email.ts - Email Service (Updated)
// ============================================

import nodemailer from 'nodemailer'

// Create transporter with better error handling and configuration
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  }

  console.log('Email config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
  })

  return nodemailer.createTransport(config)
}

/**
 * Sends an email using the configured email server.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const transporter = createTransporter()
    
    // Verify connection configuration
    await transporter.verify()
    console.log('Email server is ready to send messages')
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"DC VI Tech Academy" <${process.env.EMAIL_SERVER_USER}>`,
      to,
      subject,
      html,
    })
    
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

/**
 * Sends a verification email to a user with a link to verify their email address.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'


  
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DC VI Tech Academy!</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for registering with DC VI Tech Academy. To complete your registration, please verify your email address by clicking the button below:</p>
            <center>
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 DC VI Tech Academy. All rights reserved.</p>
            <p>Transforming Learners into Industry-Ready Tech Professionals</p>
          </div>
        </div>
      </body>
    </html>
  `
  
  return sendEmail({
    to: email,
    subject: 'Verify Your Email - DC VI Tech Academy',
    html,
  })
}

/**
 * Sends a welcome email to the student after their email address has been verified.
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to DC VI Tech Academy!</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Congratulations! Your account has been verified and you're now part of the DC VI Tech Academy community.</p>
            <h3>What's Next?</h3>
            <ul>
              <li>Complete your profile</li>
              <li>Explore the course curriculum</li>
              <li>Join your cohort's communication channel</li>
              <li>Check your class schedule</li>
            </ul>
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
            </center>
            <p>We're excited to have you on this journey to becoming an industry-ready tech professional!</p>
            <p>Best regards,<br>The DC VI Tech Academy Team</p>
          </div>
        </div>
      </body>
    </html>
  `
  
  return sendEmail({
    to: email,
    subject: 'Welcome to DC VI Tech Academy! 🚀',
    html,
  })
}

/**
 * Sends an email to a student warning them about low attendance.
 */
export async function sendAttendanceWarning(
  email: string,
  firstName: string,
  attendanceRate: number
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #DC2626;">⚠️ Attendance Alert</h2>
          <p>Hi ${firstName},</p>
          <p>We noticed that your attendance rate has dropped to <strong>${attendanceRate}%</strong>, which is below the required 80% threshold for certificate eligibility.</p>
          <p>To ensure you meet the graduation requirements, please:</p>
          <ul>
            <li>Attend all upcoming classes</li>
            <li>Reach out if you're facing any challenges</li>
            <li>Schedule a 1-on-1 session with your instructor</li>
          </ul>
          <p>We're here to support your success!</p>
          <p>Best regards,<br>DC VI Tech Academy</p>
        </div>
      </body>
    </html>
  `
  
  return sendEmail({
    to: email,
    subject: 'Attendance Warning - Action Required',
    html,
  })
}