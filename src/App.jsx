import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BIRTHDAY_TARGET_ISO } from './config'
import Countdown from './components/Countdown'
import BirthdayReveal from './components/BirthdayReveal'
import DevControls from './components/DevControls'
import MusicButton from './components/MusicButton'
import NightSky from './components/NightSky'
import Timeline from './components/Timeline'
import PhotoGallery from './components/PhotoGallery'
import LoveLetter from './components/LoveLetter'
import ThingsILove from './components/ThingsILove'
import OpenWhen from './components/OpenWhen'
import NeverSaid from './components/NeverSaid'
import BackTo2021 from './components/BackTo2021'
import BirthdayWish from './components/BirthdayWish'
import FinalSection from './components/FinalSection'
import { HER_NAME } from './config'

// App-level stage machine:
//   'countdown'  -> pre-midnight cinematic countdown screen
//   'reveal'     -> the midnight cinematic reveal sequence
//   'experience' -> the full scrollable birthday world
const STAGES = ['countdown', 'reveal', 'experience']

export default function App() {
  const [stage, setStage] = useState('countdown')
  const [countdownTarget, setCountdownTarget] = useState(BIRTHDAY_TARGET_ISO)
  const finalRef = useRef(null)

  const handleArrive = () => {
    // Only transition once — avoids re-triggering every re-render tick.
    setStage((s) => (s === 'countdown' ? 'reveal' : s))
  }

  const handleDevAction = (action) => {
    if (action === 'countdown') {
      setCountdownTarget(new Date(Date.now() + 15000).toISOString())
      setStage('countdown')
    } else if (action === 'countdown-10s') {
      setCountdownTarget(new Date(Date.now() + 10000).toISOString())
      setStage('countdown')
    } else if (action === 'reveal') {
      setStage('reveal')
    } else if (action === 'experience') {
      setStage('experience')
    } else if (action === 'final') {
      setStage('experience')
      setTimeout(() => {
        finalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    }
  }

  useEffect(() => {
    document.title = `For ${HER_NAME} ❤️`
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <AnimatePresence mode="wait">
        {stage === 'countdown' && (
          <motion.div key="countdown" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <Countdown targetIso={countdownTarget} onArrive={handleArrive} />
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div key="reveal" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <BirthdayReveal onOpen={() => setStage('experience')} />
          </motion.div>
        )}

        {stage === 'experience' && (
          <motion.div
            key="experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            style={{ position: 'relative' }}
          >
            <NightSky />
            <MusicButton />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Timeline />
              <PhotoGallery />
              <LoveLetter />
              <ThingsILove />
              <OpenWhen />
              <NeverSaid />
              <BackTo2021 />
              <BirthdayWish />
              <div ref={finalRef}>
                <FinalSection />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DevControls onGo={handleDevAction} />
    </div>
  )
}
