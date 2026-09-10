import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2, X } from 'lucide-react'
import { PREVIEW_MODE } from '../config'

// Developer-only testing controls. Rendered ONLY when PREVIEW_MODE is true —
// they never mount at all in production, so there's no risk of Archuu ever
// seeing them.
export default function DevControls({ onGo }) {
  const [open, setOpen] = useState(false)

  if (!PREVIEW_MODE) return null

  const actions = [
    { label: 'Preview Countdown (reset)', stage: 'countdown' },
    { label: '10 Seconds Before Midnight', stage: 'countdown-10s' },
    { label: 'Trigger Midnight Now', stage: 'reveal' },
    { label: 'Skip to Birthday Experience', stage: 'experience' },
    { label: 'Skip to Final Letter', stage: 'final' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(1rem + var(--safe-bottom))',
        left: 'calc(1rem + var(--safe-left))',
        zIndex: 999,
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass-card"
            style={{
              marginBottom: 10,
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              width: 240,
              background: 'rgba(5,6,12,0.9)',
            }}
          >
            <div
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginBottom: 4,
              }}
            >
              Preview Controls (dev only)
            </div>
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => onGo(a.stage)}
                style={{
                  textAlign: 'left',
                  fontSize: '0.78rem',
                  padding: '0.55rem 0.7rem',
                  borderRadius: 10,
                  color: 'var(--c-warm-white)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="glass-card"
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--c-gold)',
          background: 'rgba(5,6,12,0.9)',
        }}
        aria-label="Preview controls"
      >
        {open ? <X size={18} /> : <Settings2 size={18} />}
      </button>
    </div>
  )
}
