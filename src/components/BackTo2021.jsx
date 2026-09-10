import { motion } from 'framer-motion'
import { letterTo2021 } from '../data/content'

export default function BackTo2021() {
  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(22,28,56,0.35), transparent)' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="center"
          style={{ marginBottom: '3rem' }}
        >
          <div className="eyebrow">A letter to a version of me who didn't know yet</div>
          <h2 className="section-title">If I could go back to 2021…</h2>
        </motion.div>

        <div className="glass-card" style={{ padding: 'clamp(1.4rem, 5vw, 2.6rem)' }}>
          {letterTo2021.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.05rem, 3.8vw, 1.3rem)',
                lineHeight: 1.85,
                color: i === letterTo2021.length - 1 ? 'var(--c-gold)' : 'var(--c-ink-muted)',
                fontStyle: i === letterTo2021.length - 1 ? 'italic' : 'normal',
                marginBottom: i === letterTo2021.length - 1 ? 0 : '1.2rem',
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
