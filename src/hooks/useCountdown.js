import { useEffect, useRef, useState } from 'react'

// Returns the difference between `targetIso` and "now" as a safe,
// never-negative breakdown of days/hours/minutes/seconds, plus whether the
// target has already arrived. Re-evaluates every second. Because `targetIso`
// carries its own UTC offset (+05:30), this works correctly regardless of
// what timezone the visitor's device is set to.
export function useCountdown(targetIso) {
  const targetMs = useRef(new Date(targetIso).getTime())
  targetMs.current = new Date(targetIso).getTime()

  const compute = () => {
    const diff = targetMs.current - Date.now()
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, arrived: true }
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return { days, hours, minutes, seconds, totalMs: diff, arrived: false }
  }

  const [state, setState] = useState(compute)

  useEffect(() => {
    const id = setInterval(() => {
      setState(compute())
    }, 250)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso])

  return state
}
