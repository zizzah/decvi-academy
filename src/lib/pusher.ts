// src/lib/pusher.ts - Real-time messaging with Pusher
import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
  }
)

// Real-time event types
export enum MessageEvent {
  NEW_MESSAGE = 'new-message',
  MESSAGE_DELETED = 'message-deleted',
  MESSAGE_EDITED = 'message-edited',
  USER_TYPING = 'user-typing',
  USER_ONLINE = 'user-online',
  USER_OFFLINE = 'user-offline',
  MESSAGE_REACTION = 'message-reaction',
}

// Trigger new message event
export async function sendMessageEvent(conversationId: string, message: any) {
  await pusherServer.trigger(
    `conversation-${conversationId}`,
    MessageEvent.NEW_MESSAGE,
    message
  )
}

// Trigger typing indicator
export async function sendTypingEvent(conversationId: string, userId: string, isTyping: boolean) {
  await pusherServer.trigger(
    `conversation-${conversationId}`,
    MessageEvent.USER_TYPING,
    { userId, isTyping }
  )
}

// Trigger online status
export async function sendOnlineStatusEvent(userId: string, isOnline: boolean) {
  await pusherServer.trigger(
    `user-status`,
    isOnline ? MessageEvent.USER_ONLINE : MessageEvent.USER_OFFLINE,
    { userId, timestamp: new Date() }
  )
}