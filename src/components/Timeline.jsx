import { motion } from 'framer-motion'
import { timeline } from '../data/content'

export default function Timeline() {
  return (
    <section className="section">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="center"
          style={{ marginBottom: '4rem' }}
        >
          <div className="eyebrow">Our story</div>
          <h2 className="section-title script" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(2.6rem, 11vw, 4rem)' }}>
            Us.
          </h2>
          <p className="section-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Somewhere between a random Snapchat conversation and everything that followed…
          </p>
        </motion.div>

        <div style={{ position: 'relative', paddingLeft: '1.6rem' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 4,
              top: 8,
              bottom: 8,
              width: 1,
              background: 'linear-gradient(180deg, var(--c-gold-soft), rgba(246,241,234,0.06))',
            }}
          />

          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              style={{ position: 'relative', marginBottom: i === timeline.length - 1 ? 0 : '3.2rem' }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: -25,
                  top: 6,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: 'var(--c-gold)',
                  boxShadow: '0 0 0 4px rgba(203,171,110,0.15)',
                }}
              />
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--c-gold)',
                  marginBottom: '0.5rem',
                }}
              >
                {item.year}
              </div>
              <h3 style={{ fontSize: 'clamp(1.3rem, 5vw, 1.7rem)', color: 'var(--c-warm-white)', marginBottom: '0.7rem' }}>
                {item.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {item.lines.map((line) => (
                  <p key={line} style={{ color: 'var(--c-ink-muted)', fontSize: '0.98rem', lineHeight: 1.7 }}>
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
