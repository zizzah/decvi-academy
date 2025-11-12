'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Plus, X, Paperclip, Image, MessageSquare } from 'lucide-react';
import Pusher from 'pusher-js';

// Initialize Pusher
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
});

export default function MessagingApp() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: 1, username: 'You' });
  const messagesEndRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Subscribe to Pusher for real-time messages
  useEffect(() => {
    if (selectedConversation) {
      const channel = pusher.subscribe(`conversation-${selectedConversation.id}`);
      
      channel.bind('new-message', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      const data = await res.json();
      setMessages(data.messages.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const searchUsers = async (query) => {
    try {
      const res = await fetch(`/api/messages/users?search=${query}`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const createConversation = async () => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: selectedUsers.map(u => u.id),
          isGroup: selectedUsers.length > 1,
          name: selectedUsers.length > 1 ? 'Group Chat' : null,
        }),
      });

      const newConversation = await res.json();
      setConversations([newConversation, ...conversations]);
      setSelectedConversation(newConversation);
      setShowNewChat(false);
      setSelectedUsers([]);
      setSearchQuery('');
      fetchMessages(newConversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    setLoading(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    const tempMessage = {
      id: Date.now(),
      content: messageText,
      senderId: currentUser.id,
      sender: currentUser,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, tempMessage]);
    setMessageText('');

    try {
      await fetch(`/api/messages/${selectedConversation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageText }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
  };

  const getConversationName = (conv) => {
    if (conv.isGroup) return conv.name || 'Group Chat';
    const otherUser = conv.participants.find(p => p.userId !== currentUser.id);
    return otherUser?.user.username || 'Unknown';
  };

  const getConversationAvatar = (conv) => {
    if (conv.isGroup) return '👥';
    const otherUser = conv.participants.find(p => p.userId !== currentUser.id);
    return otherUser?.user.avatar || '👤';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Messages
            </h2>
            <button
              onClick={() => setShowNewChat(true)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  {getConversationAvatar(conv)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{getConversationName(conv)}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {conv.lastMessage || 'No messages yet'}
                  </div>
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
            {/* Header */}
            <div className="bg-white border-b p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                {getConversationAvatar(selectedConversation)}
              </div>
              <div>
                <div className="font-semibold">{getConversationName(selectedConversation)}</div>
                <div className="text-sm text-gray-500">
                  {selectedConversation.participants.length} participants
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.senderId !== currentUser.id && (
                      <div className="text-xs font-semibold mb-1">
                        {msg.sender.username}
                      </div>
                    )}
                    <div>{msg.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">New Conversation</h3>
              <button onClick={() => setShowNewChat(false)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);
              }}
              placeholder="Search users..."
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full"
                  >
                    <span className="text-sm">{user.username}</span>
                    <button
                      onClick={() =>
                        setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
                      }
                      className="text-blue-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    if (!selectedUsers.find((u) => u.id === user.id)) {
                      setSelectedUsers([...selectedUsers, user]);
                    }
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.avatar || '👤'}
                  </div>
                  <div>
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={createConversation}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Start Conversation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}