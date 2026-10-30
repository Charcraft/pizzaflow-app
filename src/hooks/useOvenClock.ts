'use client'

import { useEffect, useState, useRef } from 'react'

export function useOvenClock(ovenStartedAt: string | null) {
  const [seconds, setSeconds] = useState(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const hasNotified130 = useRef(false)
  const hasNotified200 = useRef(false)

  useEffect(() => {
    if (!ovenStartedAt) return

    const start = new Date(ovenStartedAt).getTime()
    const tick = () => {
      setSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)))
    }
    // Primer tick después del paint: evita setState síncrono en el effect.
    const timeout = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(timeout)
      clearInterval(id)
    }
  }, [ovenStartedAt])

  useEffect(() => {
    hasNotified130.current = false
    hasNotified200.current = false
  }, [ovenStartedAt])

  const effectiveSeconds = ovenStartedAt ? seconds : 0

  useEffect(() => {
    if (effectiveSeconds >= 90 && !hasNotified130.current) {
      hasNotified130.current = true
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Horno: 1:30')
      }
    }
  }, [effectiveSeconds])

  useEffect(() => {
    if (effectiveSeconds >= 120 && !hasNotified200.current) {
      hasNotified200.current = true
      try {
        if (!audioCtxRef.current) {
          const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
          audioCtxRef.current = new Ctor()
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
      } catch {
        // Audio no disponible; la alerta visual ya notifica.
      }
    }
  }, [effectiveSeconds])

  const minutes = Math.floor(effectiveSeconds / 60)
  const secs = effectiveSeconds % 60
  const formatted = `${minutes}:${secs.toString().padStart(2, '0')}`

  return {
    seconds: effectiveSeconds,
    formatted,
    minutes,
    triggered130: effectiveSeconds >= 90,
    triggered200: effectiveSeconds >= 120,
    isActive: !!ovenStartedAt,
  }
}