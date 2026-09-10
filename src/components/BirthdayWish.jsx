import { motion } from 'framer-motion'
import { HER_NAME, HER_AGE_TURNING } from '../config'

const wishes = [
  'happiness that doesn’t depend on anyone else showing up for it',
  'peace, even on the loud, chaotic days',
  'confidence in exactly who you are becoming',
  'success that actually feels earned, because it will be',
  'beautiful friendships that give as much as you do',
  'exciting, unplanned experiences worth remembering',
  'memories that mean as much later as they do now',
  'dreams that stop feeling far away',
  'the courage to choose yourself sometimes',
  'a future that surprises you in the best way',
]

export default function BirthdayWish() {
  return (
    <section
      className="section"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="center"
        >
          <div className="eyebrow">Not just another birthday</div>
          <h2 className="section-title">Today isn't just about turning {HER_AGE_TURNING}.</h2>
          <p className="section-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '2.4rem' }}>
            It's about the person you've become to get here. So today, {HER_NAME}, I wish you —
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {wishes.map((wish, i) => (
            <motion.div
              key={wish}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{ display: 'flex', gap: '0.8rem', alignItems: 'baseline' }}
            >
              <span style={{ color: 'var(--c-gold)', fontFamily: 'var(--font-serif)' }}>—</span>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.05rem, 4vw, 1.3rem)', color: 'var(--c-warm-white)', lineHeight: 1.6 }}>
                {wish}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
