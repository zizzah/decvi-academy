
// src/app/api/pusher/auth/route.ts - Pusher authentication
import { NextRequest, NextResponse } from 'next/server'
import { pusherServer } from '@/lib/pusher'
import { getCurrentUser } from '@/lib/auth-helpers'
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.text()
    const params = new URLSearchParams(body)
    const socketId = params.get('socket_id')
    const channelName = params.get('channel_name')

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Authorize private/presence channels
    if (channelName.startsWith('private-') || channelName.startsWith('presence-')) {
      // Check if user has access to this channel
      const conversationId = channelName.replace('private-conversation-', '')
      
      // Verify user is participant (add your logic here)
      // const hasAccess = await verifyConversationAccess(user.userId, conversationId)
      // if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

      const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
        user_id: user.userId,
        user_info: {
          name: user.email,
        },
      })

      return NextResponse.json(authResponse)
    }

    return NextResponse.json({ error: 'Invalid channel' }, { status: 400 })
  } catch (error) {
    console.error('Pusher auth error:', error)
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}

