import { useEffect, useState } from 'react'
import { pusherClient, MessageEvent } from '@/lib/pusher'



export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    const channel = pusherClient.subscribe('user-status')

    channel.bind(MessageEvent.USER_ONLINE, (data: { userId: string }) => {
      setOnlineUsers((prev) => new Set([...prev, data.userId]))
    })

    channel.bind(MessageEvent.USER_OFFLINE, (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  return onlineUsers
}
