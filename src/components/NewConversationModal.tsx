'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateConversation: (participantIds: string[], type: 'DIRECT' | 'GROUP', name?: string) => void
}

export default function NewConversationModal({
  isOpen,
  onClose,
  onCreateConversation,
}: NewConversationModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Search users when search query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setUsers([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error('Failed to search users:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleUserSelect = (user: User, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, user])
    } else {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return

    setIsLoading(true)
    try {
      const participantIds = selectedUsers.map(u => u.id)
      const type = selectedUsers.length === 1 ? 'DIRECT' : 'GROUP'
      const name = type === 'GROUP' ? groupName.trim() || undefined : undefined

      await onCreateConversation(participantIds, type, name)
      handleClose()
    } catch (error) {
      console.error('Failed to create conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    setUsers([])
    setSelectedUsers([])
    setGroupName('')
    onClose()
  }

  const isValid = selectedUsers.length > 0 && (selectedUsers.length === 1 || groupName.trim())

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <Label>Selected ({selectedUsers.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <button
                      onClick={() => handleUserSelect(user, false)}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Group Name Input (only for groups) */}
          {selectedUsers.length > 1 && (
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          {/* User List */}
          <div className="max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-4 text-muted-foreground">
                Searching...
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => {
                  const isSelected = selectedUsers.some(u => u.id === user.id)
                  return (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted"
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleUserSelect(user, checked as boolean)}
                      />
                      <Label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email} • {user.role.toLowerCase()}
                        </div>
                      </Label>
                    </div>
                  )
                })}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="text-center py-4 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateConversation}
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Creating...' : selectedUsers.length === 1 ? 'Start Chat' : 'Create Group'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
