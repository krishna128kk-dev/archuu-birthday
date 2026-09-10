import { motion } from 'framer-motion'
import { neverSaid } from '../data/content'

export default function NeverSaid() {
  return (
    <section className="section">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="center"
          style={{ marginBottom: '3.5rem' }}
        >
          <div className="eyebrow">Small confessions</div>
          <h2 className="section-title">Things I never said.</h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
          {neverSaid.map((note, i) => (
            <motion.p
              key={note}
              initial={{ opacity: 0, y: 16, rotate: i % 2 === 0 ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6 }}
              className="script"
              style={{
                fontSize: 'clamp(1.4rem, 5.6vw, 1.9rem)',
                color: 'var(--c-blush)',
                textAlign: i % 2 === 0 ? 'left' : 'right',
                lineHeight: 1.4,
              }}
            >
              “{note}”
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
