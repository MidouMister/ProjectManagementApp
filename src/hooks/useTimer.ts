"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseTimerOptions {
  onTick?: (seconds: number) => void
  autoStart?: boolean
}

interface UseTimerReturn {
  seconds: number
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: () => void
  toggle: () => void
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { onTick, autoStart = false } = options
  
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    
    startTimeRef.current = Date.now() - accumulatedRef.current * 1000
    setIsRunning(true)
    
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)
      setSeconds(elapsed)
      onTick?.(elapsed)
    }, 1000)
  }, [isRunning, onTick])

  const stop = useCallback(() => {
    clearTimer()
    accumulatedRef.current = seconds
    setIsRunning(false)
  }, [clearTimer, seconds])

  const reset = useCallback(() => {
    clearTimer()
    setSeconds(0)
    accumulatedRef.current = 0
    startTimeRef.current = null
    setIsRunning(false)
  }, [clearTimer])

  const toggle = useCallback(() => {
    if (isRunning) {
      stop()
    } else {
      start()
    }
  }, [isRunning, start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset,
    toggle,
  }
}

// Helper to format seconds as HH:MM:SS
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  const pad = (n: number) => n.toString().padStart(2, "0")
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}