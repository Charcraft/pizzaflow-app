'use client'

import { useEffect, useState, useRef } from 'react'

export function useOvenClock(ovenStartedAt: string | null) {
  const [seconds, setSeconds] = useState(() => 0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const hasNotified130 = useRef(false)
  const hasNotified200 = useRef(false)

  useEffect(() => {
    if (!ovenStartedAt) return

    const start = new Date(ovenStartedAt).getTime()
    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000)
      setSeconds(Math.max(0, elapsed))
    }
    
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [ovenStartedAt])

  useEffect(() => {
    if (seconds >= 90 && !hasNotified130.current) {
      hasNotified130.current = true
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Horno: 1:30')
      }
    }
  }, [seconds])

  useEffect(() => {
    if (seconds >= 120 && !hasNotified200.current) {
      hasNotified200.current = true
      try {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          audioCtxRef.current = new AudioCtx()
        }
        const ctx = audioCtxRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 880
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      } catch {}
    }
  }, [seconds])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formatted = `${minutes}:${secs.toString().padStart(2, '0')}`
  const triggered130 = seconds >= 90
  const triggered200 = seconds >= 120

  return { seconds, formatted, minutes, triggered130, triggered200, isActive: !!ovenStartedAt }
}
