import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { photos } from '../data/photos'
import SafeImage from './SafeImage'

function Lightbox({ index, onClose, onNav }) {
  const photo = photos[index]
  if (!photo) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(5,6,12,0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        paddingTop: 'calc(2rem + var(--safe-top))',
        paddingBottom: 'calc(2rem + var(--safe-bottom))',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'calc(1.2rem + var(--safe-top))',
          right: 'calc(1.2rem + var(--safe-right))',
          color: 'var(--c-warm-white)',
          width: 42,
          height: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1) }}
        style={{ position: 'absolute', left: 6, color: 'var(--c-warm-white)', padding: '0.5rem' }}
        aria-label="Previous photo"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1) }}
        style={{ position: 'absolute', right: 6, color: 'var(--c-warm-white)', padding: '0.5rem' }}
        aria-label="Next photo"
      >
        <ChevronRight size={28} />
      </button>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480, width: '100%' }}
      >
        <SafeImage
          src={photo.src}
          alt={photo.caption}
          style={{ width: '100%', borderRadius: 14, maxHeight: '70vh', objectFit: 'cover' }}
        />
        <p style={{ marginTop: '1.2rem', textAlign: 'center', color: 'var(--c-ink-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {photo.caption}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const featured = photos[0]
  const rest = photos.slice(1)

  return (
    <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="section-inner" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="center"
          style={{ marginBottom: '3rem' }}
        >
          <div className="eyebrow">Memories, kept</div>
          <h2 className="section-title">A few frames of us.</h2>
          <p className="section-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Out of years of moments, these are just a few I couldn't leave out.
          </p>
        </motion.div>
      </div>

      {/* featured full-width photo */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        style={{ padding: '0 1.5rem', marginBottom: '2.4rem' }}
      >
        <div
          onClick={() => setLightboxIndex(0)}
          style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
        >
          <SafeImage
            src={featured?.src}
            alt={featured?.caption}
            style={{ width: '100%', height: 'min(72vw, 420px)', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, rgba(5,6,12,0.75) 0%, rgba(5,6,12,0) 45%)',
            }}
          />
          <p
            style={{
              position: 'absolute',
              bottom: '1.2rem',
              left: '1.2rem',
              right: '1.2rem',
              color: 'var(--c-warm-white)',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              lineHeight: 1.5,
            }}
          >
            {featured?.caption}
          </p>
        </div>
      </motion.div>

      {/* horizontal swipeable polaroid gallery */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          padding: '0.5rem 1.5rem 1.5rem',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {rest.map((photo, i) => (
          <motion.div
            key={photo.src + i}
            initial={{ opacity: 0, y: 24, rotate: i % 2 === 0 ? -3 : 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
            onClick={() => setLightboxIndex(i + 1)}
            style={{
              flex: '0 0 auto',
              width: 190,
              scrollSnapAlign: 'start',
              background: '#f6f1ea',
              padding: '10px 10px 34px',
              borderRadius: 6,
              boxShadow: '0 14px 30px -12px rgba(0,0,0,0.55)',
              cursor: 'pointer',
            }}
          >
            <SafeImage
              src={photo.src}
              alt={photo.caption}
              style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 2 }}
            />
            <p
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-script)',
                fontSize: '0.95rem',
                color: '#2a2416',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {photo.caption.length > 46 ? photo.caption.slice(0, 44) + '…' : photo.caption}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={(dir) =>
              setLightboxIndex((i) => (i + dir + photos.length) % photos.length)
            }
          />
        )}
      </AnimatePresence>
    </section>
  )
}
