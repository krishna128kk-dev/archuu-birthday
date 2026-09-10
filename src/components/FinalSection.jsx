import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { finalPhoto } from '../data/photos'
import SafeImage from './SafeImage'
import { HER_FULL_NICKNAME, HER_NAME, HER_AGE_TURNING, MY_NAME } from '../config'

export default function FinalSection() {
  const [secretOpen, setSecretOpen] = useState(false)
  const [secretStage, setSecretStage] = useState(0)

  const openSecret = () => {
    setSecretOpen(true)
    setSecretStage(0)
    setTimeout(() => setSecretStage(1), 1600)
  }

  return (
    <section className="section" style={{ paddingBottom: 'calc(7.5rem + var(--safe-bottom))' }}>
      <div className="section-inner center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
        >
          <div className="eyebrow">Before you leave…</div>

          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.15rem, 4.4vw, 1.5rem)', color: 'var(--c-ink-muted)', lineHeight: 1.8, marginBottom: '1.1rem' }}>
            I don't know exactly what the future looks like.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.15rem, 4.4vw, 1.5rem)', color: 'var(--c-ink-muted)', lineHeight: 1.8, marginBottom: '1.1rem' }}>
            But I know that meeting you changed my life.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.15rem, 4.4vw, 1.5rem)', color: 'var(--c-ink-muted)', lineHeight: 1.8, marginBottom: '2.6rem' }}>
            And somewhere inside all those years, conversations, fights, laughs and memories… there will always be a part of my story that has your name in it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '2.6rem' }}
        >
          <SafeImage
            src={finalPhoto.src}
            alt={finalPhoto.caption}
            style={{ width: '100%', maxWidth: 380, margin: '0 auto', borderRadius: 18, aspectRatio: '4/5', objectFit: 'cover' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: 'var(--c-warm-white)', marginBottom: '0.6rem' }}>
            HAPPIEST BIRTHDAY, {HER_FULL_NICKNAME.toUpperCase()} ❤️
          </h2>
          <p className="script" style={{ fontSize: 'clamp(1.6rem, 7vw, 2.4rem)', color: 'var(--c-gold)', marginBottom: '1.6rem' }}>
            Happy {HER_AGE_TURNING}th.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--c-ink-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Thank you for being one of the most beautiful chapters of my life.
          </p>

          <button
            onClick={openSecret}
            aria-label="A little heart"
            style={{
              display: 'inline-flex',
              fontSize: '1.4rem',
              opacity: 0.55,
              padding: '0.5rem',
            }}
          >
            ❤
          </button>

          <p style={{ marginTop: '1.6rem', fontFamily: 'var(--font-script)', fontSize: '1.6rem', color: 'var(--c-blush)' }}>
            — {MY_NAME}
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {secretOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSecretOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              background: 'rgba(5,6,12,0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 420 }}
            >
              {secretStage === 0 ? (
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--c-warm-white)' }}>
                  Okay… one last thing.
                </p>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--c-ink-muted)', marginBottom: '1.4rem' }}>
                    No matter how many years pass, somewhere in my memories there will always be a 2021 version of me who had absolutely no idea how important an {HER_NAME} was about to become.
                  </p>
                  <p className="script" style={{ fontSize: '1.8rem', color: 'var(--c-gold)' }}>
                    Happy Birthday, idiot. ❤️
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
