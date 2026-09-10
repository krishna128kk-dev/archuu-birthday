import { motion } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'
import { HER_NAME } from '../config'
import NightSky from './NightSky'

function Unit({ value, label }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 64 }}>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 9vw, 3.4rem)',
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--c-warm-white)',
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: '0.62rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--c-ink-faint)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function Countdown({ targetIso, onArrive }) {
  const { days, hours, minutes, seconds, arrived } = useCountdown(targetIso)

  if (arrived) {
    // parent handles the transition; nothing to render, but call once.
    onArrive?.()
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <NightSky />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="eyebrow">A little world, just for you</div>

        <h1
          className="section-title"
          style={{ fontSize: 'clamp(1.8rem, 6.5vw, 2.8rem)', maxWidth: 480 }}
        >
          Something special is waiting<br />for you, {HER_NAME}…
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          style={{
            marginTop: '1rem',
            fontFamily: 'var(--font-script)',
            fontSize: '1.5rem',
            color: 'var(--c-blush)',
          }}
        >
          Just a little longer.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="glass-card"
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '3rem',
          padding: '1.6rem clamp(1rem, 5vw, 2.4rem)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.6rem, 3vw, 1.6rem)',
        }}
      >
        <Unit value={days} label="Days" />
        <Sep />
        <Unit value={hours} label="Hours" />
        <Sep />
        <Unit value={minutes} label="Minutes" />
        <Sep />
        <Unit value={seconds} label="Seconds" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '2.4rem',
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          color: 'var(--c-ink-faint)',
        }}
      >
        11 September · Midnight · IST
      </motion.p>
    </div>
  )
}

function Sep() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
        color: 'var(--c-ink-faint)',
        transform: 'translateY(-4px)',
      }}
    >
      :
    </div>
  )
}
