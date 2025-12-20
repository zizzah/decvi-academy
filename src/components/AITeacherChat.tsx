// components/AITeacherChat.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Send, Loader2, MessageSquare, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AITeacherChatProps {
  lessonId: string
  studentId: string
  lessonTitle: string
}

export default function AITeacherChat({ lessonId, studentId, lessonTitle }: AITeacherChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI teacher for "${lessonTitle}". I'm here to help you understand the concepts, answer questions, and guide you through the tasks. What would you like to know?`,
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/ai-teacher/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          studentId,
          message: input.trim(),
          conversationHistory
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQuestions = [
    "Can you explain this concept differently?",
    "What's a real-world example of this?",
    "I'm stuck on the task. Can you give me a hint?",
    "What are best practices for this?"
  ]

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="relative">
              <Bot className="w-5 h-5 text-blue-600" />
              <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            AI Teacher Assistant
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs"
          >
            {isExpanded ? 'Minimize' : 'Expand'}
          </Button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Ask me anything about the lesson!
        </p>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Suggested Questions (show only initially) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question... (Press Enter to send)"
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Be specific with your questions for better answers!
            </p>
          </div>
        </>
      )}
    </Card>
  )
}