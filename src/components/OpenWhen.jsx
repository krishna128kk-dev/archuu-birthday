import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import { openWhen } from '../data/content'

export default function OpenWhen() {
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <section className="section">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="center"
          style={{ marginBottom: '3rem' }}
        >
          <div className="eyebrow">A little emergency kit</div>
          <h2 className="section-title">Open these whenever you need them.</h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {openWhen.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
                padding: '1.1rem 1.2rem',
                textAlign: 'left',
              }}
            >
              <Mail size={20} color="var(--c-gold)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', color: 'var(--c-warm-white)' }}>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(5,6,12,0.88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                maxWidth: 420,
                width: '100%',
                padding: '2rem 1.6rem',
                background: 'linear-gradient(160deg, rgba(22,28,56,0.95), rgba(11,14,26,0.97))',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setActiveIndex(null)}
                style={{ position: 'absolute', top: 14, right: 14, color: 'var(--c-ink-faint)' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>
                {openWhen[activeIndex].label}
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', lineHeight: 1.75, color: 'var(--c-warm-white)' }}>
                {openWhen[activeIndex].message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
