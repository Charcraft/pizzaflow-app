'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

interface AutoCarouselProps {
  slides: ReactNode[]
  label: string
  autoMs?: number
  className?: string
}

export function AutoCarousel({
  slides,
  label,
  autoMs = 5500,
  className = '',
}: AutoCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (paused || reducedMotion.current || slides.length < 2) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, autoMs)
    return () => clearInterval(id)
  }, [autoMs, paused, slides.length])

  if (slides.length === 0) return null

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length)
  }

  return (
    <section
      className={`relative ${className}`}
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-panel">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} de ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => go(dotIndex)}
              className={`h-2 rounded-full transition-all ${
                dotIndex === index ? 'w-7 bg-tomato' : 'w-2 bg-ink/20 hover:bg-ink/40'
              }`}
              aria-label={`Ir al slide ${dotIndex + 1}`}
              aria-current={dotIndex === index}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-muted hover:text-ink"
            aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
          >
            {paused ? '▶' : '❚❚'}
          </button>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink hover:bg-cream"
            aria-label="Slide anterior"
          >
            <Icon name="chevron-right" size={15} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink hover:bg-cream"
            aria-label="Slide siguiente"
          >
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}
