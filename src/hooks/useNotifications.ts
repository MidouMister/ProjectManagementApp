"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
}

interface UseNotificationsOptions {
  pollInterval?: number
  unitId: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

export function useNotifications(
  options: UseNotificationsOptions
): UseNotificationsReturn {
  const { pollInterval = 30000, unitId: _unitId } = options
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const isMountedRef = useRef(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      if (!isMountedRef.current) return
      
      setIsLoading(false)
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error("Failed to fetch"))
      }
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    
    void _unitId // reserved for future server action
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()
    
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        fetchNotifications()
      }
    }, pollInterval)

    return () => {
      isMountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [pollInterval, fetchNotifications, _unitId])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  }
}