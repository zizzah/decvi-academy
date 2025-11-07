// src/hooks/useRealtimeMessages.ts - Custom hook for real-time messages
import { useEffect, useState } from 'react'
import { pusherClient, MessageEvent } from '@/lib/pusher'

export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  useEffect(() => {
    if (!conversationId) return

    const channel = pusherClient.subscribe(`conversation-${conversationId}`)

    // Listen for new messages
    channel.bind(MessageEvent.NEW_MESSAGE, (message: any) => {
      setMessages((prev) => [...prev, message])
    })

    // Listen for typing indicators
    channel.bind(MessageEvent.USER_TYPING, (data: { userId: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [...new Set([...prev, data.userId])])
      } else {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId))
      }
    })

    // Listen for message reactions
    channel.bind(MessageEvent.MESSAGE_REACTION, (data: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, reactions: data.reactions }
            : msg
        )
      )
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [conversationId])

  return { messages, setMessages, typingUsers }
}

// src/hooks/useOnlineStatus.ts - Track online users
