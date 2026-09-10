import { useState } from 'react'
import { motion } from 'framer-motion'
import { thingsILove } from '../data/content'

function Card({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.button
      onClick={() => setOpen((o) => !o)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      className="glass-card"
      style={{
        textAlign: 'left',
        padding: '1.2rem',
        minHeight: 118,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 10,
          right: 14,
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          color: 'var(--c-gold)',
          opacity: 0.7,
        }}
      >
        {item.n}
      </span>

      {!open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h4 style={{ fontSize: '1.15rem', color: 'var(--c-warm-white)', lineHeight: 1.3 }}>
            {item.title}
          </h4>
          <p style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--c-ink-faint)', letterSpacing: '0.04em' }}>
            tap to open
          </p>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--c-ink-muted)' }}
        >
          {item.detail}
        </motion.p>
      )}
    </motion.button>
  )
}

export default function ThingsILove() {
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
          <div className="eyebrow">A short list, impossible to shorten</div>
          <h2 className="section-title">20 things I love about you.</h2>
          <p className="section-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Tap each card. There's one for every year you could have had before this one — and one extra.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.85rem',
          }}
        >
          {thingsILove.map((item, i) => (
            <Card key={item.n} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
