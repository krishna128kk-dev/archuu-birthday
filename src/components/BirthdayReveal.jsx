import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HER_FULL_NICKNAME, HER_AGE_TURNING } from '../config'
import NightSky from './NightSky'

const STEPS = [
  { key: 'time', duration: 1900 },
  { key: 'headline', duration: 2600 },
  { key: 'age', duration: 2200 },
  { key: 'suits', duration: 2400 },
  { key: 'intro', duration: 2600 },
  { key: 'cta', duration: 0 },
]

// Little confetti-ish particles for the reveal moment. Pure CSS/motion, no
// canvas or extra dependency.
function Bursts() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.6 + Math.random() * 1.6,
        size: 4 + Math.random() * 6,
        color: ['#cbab6e', '#e8c7c2', '#d99a95', '#f6f1ea'][i % 4],
        rotate: Math.random() * 360,
      })),
    [],
  )
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}

export default function BirthdayReveal({ onOpen }) {
  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[stepIndex].key

  useEffect(() => {
    const dur = STEPS[stepIndex].duration
    if (!dur) return
    const t = setTimeout(() => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1)), dur)
    return () => clearTimeout(t)
  }, [stepIndex])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <NightSky variant="reveal" />
      {stepIndex >= 1 && <Bursts />}

      <AnimatePresence mode="wait">
        {step === 'time' && (
          <motion.div
            key="time"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.9 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3rem, 14vw, 5.5rem)',
                color: 'var(--c-warm-white)',
                letterSpacing: '0.02em',
              }}
            >
              12:00 AM
            </div>
          </motion.div>
        )}

        {step === 'headline' && (
          <motion.div
            key="headline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 8vw, 3.4rem)',
                color: 'var(--c-warm-white)',
                lineHeight: 1.2,
              }}
            >
              HAPPIEST BIRTHDAY,<br />
              <span style={{ color: 'var(--c-rose)' }}>{HER_FULL_NICKNAME.toUpperCase()}</span> ❤️
            </div>
          </motion.div>
        )}

        {step === 'age' && (
          <motion.div
            key="age"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div className="script" style={{ fontSize: 'clamp(2.6rem, 12vw, 4.5rem)', color: 'var(--c-gold)' }}>
              Happy {HER_AGE_TURNING}th.
            </div>
          </motion.div>
        )}

        {step === 'suits' && (
          <motion.div
            key="suits"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 6.5vw, 2.6rem)', color: 'var(--c-warm-white)' }}>
              {HER_AGE_TURNING} looks beautiful on you.
            </div>
          </motion.div>
        )}

        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 1.1 }}
            style={{ position: 'relative', zIndex: 2, maxWidth: 420 }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 4.6vw, 1.6rem)', color: 'var(--c-ink-muted)', lineHeight: 1.6 }}>
              Before you read anything else…
            </p>
            <p style={{ marginTop: '1rem', fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 4.6vw, 1.6rem)', color: 'var(--c-warm-white)', lineHeight: 1.6 }}>
              Just know that I made this little world only for you.
            </p>
          </motion.div>
        )}

        {step === 'cta' && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 4.6vw, 1.6rem)', color: 'var(--c-ink-muted)', marginBottom: '2rem' }}>
              Just know that I made this little world only for you.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="gold-btn"
              onClick={onOpen}
            >
              Open your birthday surprise →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
