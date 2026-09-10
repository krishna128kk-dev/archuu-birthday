import { motion } from 'framer-motion'
import { loveLetter } from '../data/loveLetter'
import { photos } from '../data/photos'
import SafeImage from './SafeImage'
import { HER_NAME } from '../config'

export default function LoveLetter() {
  return (
    <section className="section">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="center"
          style={{ marginBottom: '4.5rem' }}
        >
          <div className="eyebrow">For you, {HER_NAME}</div>
          <h2 className="section-title">A letter I've been writing for years without realizing it.</h2>
          <div className="divider" style={{ marginLeft: 'auto', marginRight: 'auto' }} />
          <p className="section-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Twenty chapters. Take your time with it.
          </p>
        </motion.div>

        {loveLetter.map((chapter, i) => (
          <motion.div
            key={chapter.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '4.4rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.9rem',
                marginBottom: '1.2rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  color: 'var(--c-gold)',
                  letterSpacing: '0.08em',
                }}
              >
                {chapter.number}
              </span>
              <h3 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.1rem)', color: 'var(--c-warm-white)' }}>
                {chapter.title}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {chapter.paragraphs.map((p, pi) => (
                <p
                  key={pi}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.08rem, 3.6vw, 1.25rem)',
                    lineHeight: 1.85,
                    color: 'var(--c-ink-muted)',
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* a breathing-room photo every few chapters */}
            {i % 5 === 4 && photos[i % photos.length] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9 }}
                style={{ marginTop: '2.2rem' }}
              >
                <SafeImage
                  src={photos[i % photos.length].src}
                  alt=""
                  style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 16 }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
