import { useEffect, useState } from 'react'

interface UseCountUpOptions {
  start?: number
  end: number
  duration?: number
  enabled?: boolean
}

export const useCountUp = ({ start = 0, end, duration = 2000, enabled = true }: UseCountUpOptions) => {
  const [count, setCount] = useState(() => start)

  useEffect(() => {
    if (!enabled) {
      // Reset count when disabled - this setState in effect is necessary
      // to sync the count with the start value when the animation is disabled
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(start);
      return;
    }

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(start + (end - start) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [start, end, duration, enabled])

  return count
}
