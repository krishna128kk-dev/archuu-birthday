import { useMemo } from 'react'
import { motion } from 'framer-motion'

// A fixed, full-viewport ambient background: gradient night sky, twinkling
// stars, slow-drifting glow orbs, and a few subtly floating hearts. Cheap
// enough to sit behind the whole app without hurting performance — no
// canvas, just a handful of absolutely-positioned divs.
export default function NightSky({ variant = 'default' }) {
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.6,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 2.5,
    }))
  }, [])

  const hearts = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 14,
      size: Math.random() * 10 + 10,
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        background:
          variant === 'reveal'
            ? 'radial-gradient(ellipse at 50% 20%, #1c2450 0%, #10142a 45%, #05060c 100%)'
            : 'radial-gradient(ellipse at 50% -10%, #10142a 0%, #0b0e1a 50%, #05060c 100%)',
      }}
    >
      {/* moon glow */}
      <div
        style={{
          position: 'absolute',
          top: '-8%',
          right: '8%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(246,241,234,0.18) 0%, rgba(246,241,234,0) 70%)',
          filter: 'blur(6px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '2%',
          right: '12%',
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #f6f1ea, #d9cfc0 60%, #b7ab95 100%)',
          boxShadow: '0 0 60px 10px rgba(246,241,234,0.25)',
          opacity: 0.9,
        }}
      />

      {/* stars */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#f6f1ea',
          }}
        />
      ))}

      {/* soft floating hearts */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.35, 0.35, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${h.left}%`,
            fontSize: h.size,
            color: 'rgba(217,154,149,0.5)',
          }}
        >
          ❤
        </motion.div>
      ))}

      {/* bottom warm glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(217,154,149,0.08) 0%, rgba(217,154,149,0) 70%)',
        }}
      />

      <div className="noise-overlay" />
    </div>
  )
}
