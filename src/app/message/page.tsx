'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { Message } from '@/lib/pusher'
import NewConversationModal from '@/components/NewConversationModal'

interface ConversationWithUnread {
  id: string
  name?: string | null
  type: string
  participants: Array<{
    user: {
      id: string
      email: string
      role: string
    }
  }>
  messages: Array<{
    content: string
    createdAt: string
  }>
  lastMessageAt?: string | null
  unreadCount: number
}

export default function MessagePage() {
  const [conversations, setConversations] = useState<ConversationWithUnread[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [])

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  // Real-time messages for selected conversation
  const { messages: realtimeMessages, typingUsers } = useRealtimeMessages(selectedConversation || '')

  // Update messages when real-time messages change
  useEffect(() => {
    if (realtimeMessages.length > 0) {
      setMessages(realtimeMessages)
    }
  }, [realtimeMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch(`/api/conversations/${selectedConversation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          type: 'TEXT',
        }),
      })

      if (response.ok) {
        setNewMessage('')
        // Message will be added via real-time update
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    if (selectedConversation && !isTyping) {
      setIsTyping(true)
      // Typing event will be sent via Pusher if needed

      setTimeout(() => {
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleCreateConversation = async (participantIds: string[], type: 'DIRECT' | 'GROUP', name?: string) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantIds,
          type,
          name,
        }),
      })

      if (response.ok) {
        const newConversation = await response.json()
        setSelectedConversation(newConversation.id)
        fetchConversations() // Refresh the conversations list
      } else {
        console.error('Failed to create conversation')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            New Message
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {conversation.name || conversation.participants
                      .filter(p => p.user.email !== 'current-user-email') // Replace with actual user email
                      .map(p => p.user.email)
                      .join(', ')}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.messages[0]?.content || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-gray-400">
                    {conversation.lastMessageAt ? formatTime(conversation.lastMessageAt) : ''}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-medium text-gray-900">
                {conversations.find(c => c.id === selectedConversation)?.name ||
                  conversations.find(c => c.id === selectedConversation)?.participants
                    .filter(p => p.user.email !== 'current-user-email')
                    .map(p => p.user.email)
                    .join(', ')}
              </h3>
              {typingUsers.length > 0 && (
                <p className="text-sm text-gray-500">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user-id'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'current-user-id' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  )
}
