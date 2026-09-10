import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Music2, Pause } from 'lucide-react'

// No autoplay — browsers block it anyway, and it's a nicer experience to let
// her choose. This button appears once she's interacted with the page at
// least once (a tap/scroll/click), and toggles music on/off from then on.
//
// To use your own song: drop an mp3 at public/music/song.mp3 (this exact
// path/name), or change SRC below.
const SRC = '/music/song.mp3'

export default function MusicButton() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const markReady = () => setReady(true)
    window.addEventListener('pointerdown', markReady, { once: true })
    window.addEventListener('scroll', markReady, { once: true, passive: true })
    return () => {
      window.removeEventListener('pointerdown', markReady)
      window.removeEventListener('scroll', markReady)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  if (!ready) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(1rem + var(--safe-top))',
        right: 'calc(1rem + var(--safe-right))',
        zIndex: 999,
      }}
    >
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggle}
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.55rem 0.9rem',
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          color: playing ? 'var(--c-gold)' : 'var(--c-ink-muted)',
          background: 'rgba(5,6,12,0.7)',
        }}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? <Pause size={14} /> : <Music2 size={14} />}
        {playing ? 'Playing' : 'Music'}
      </motion.button>
    </div>
  )
}
