// ============================================================================
// VISITOR / SESSION TRACKING (production only)
// ============================================================================
// Minimal, privacy-conscious visit tracking: an anonymous "someone opened
// the site" notification, and an approximate "active viewing time" when
// that visit ends. No location, no device fingerprinting, no persistent
// server-side storage — this just relays two small events to /api/visit,
// which forwards a short message to a private Telegram chat.
//
// Disabled entirely while PREVIEW_MODE is true (see src/config.js), so
// testing the site yourself never fires a notification.
// ============================================================================

import { PREVIEW_MODE } from './config'

const ENDPOINT = '/api/visit'
const VISIT_KEY = 'archuu_visited'

// How long with zero scroll/click/touch/keyboard activity before we stop
// counting time as "actively viewing" (per-second timer just pauses).
const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000

// How long the tab can sit hidden/backgrounded before we treat the visit as
// over and send the "session ended" notification. A quick app-switch or
// notification-check on mobile shouldn't count as leaving.
const HIDDEN_GRACE_MS = 10 * 1000

// Refreshing the page tears down this session (fires `pagehide`) and starts
// a fresh one — without this floor, every accidental refresh would fire its
// own near-zero-length "session ended" notification.
const MIN_ACTIVE_SECONDS_TO_REPORT = 5

const TICK_MS = 1000

const ACTIVITY_EVENTS = ['scroll', 'click', 'touchstart', 'touchmove', 'pointerdown', 'pointermove', 'keydown']

function detectDevice() {
  try {
    const uaData = typeof navigator !== 'undefined' ? navigator.userAgentData : undefined
    if (uaData && typeof uaData.mobile === 'boolean') {
      return uaData.mobile ? 'Mobile' : 'Desktop'
    }
    const ua = navigator.userAgent || ''
    return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'Mobile' : 'Desktop'
  } catch {
    return 'Unknown'
  }
}

function detectBrowser() {
  try {
    const ua = navigator.userAgent || ''
    if (/EdgA?\//.test(ua)) return 'Edge'
    if (/OPR\//.test(ua) || /Opera/.test(ua)) return 'Opera'
    if (/SamsungBrowser/.test(ua)) return 'Samsung Internet'
    if (/CriOS/.test(ua)) return 'Chrome (iOS)'
    if (/FxiOS/.test(ua)) return 'Firefox (iOS)'
    if (/Firefox\//.test(ua)) return 'Firefox'
    if (/Chrome\//.test(ua)) return 'Chrome'
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari'
    return 'Unknown'
  } catch {
    return 'Unknown'
  }
}

function postOpenEvent(data) {
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Best-effort only — never let a tracking failure affect the page.
  }
}

function sendFinalEvent(data) {
  const json = JSON.stringify(data)
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'application/json' })
      if (navigator.sendBeacon(ENDPOINT, blob)) return
    }
  } catch {
    // fall through to fetch
  }
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // give up silently
  }
}

export function initTracking() {
  if (PREVIEW_MODE) return
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  let isVisible = document.visibilityState === 'visible'
  let lastActivityAt = Date.now()
  let activeMs = 0
  let reported = false
  let hiddenGraceTimer = null

  const withinActivityWindow = () => Date.now() - lastActivityAt < INACTIVITY_TIMEOUT_MS
  const markActivity = () => {
    lastActivityAt = Date.now()
  }

  ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, markActivity, { passive: true }))

  const tick = setInterval(() => {
    if (isVisible && withinActivityWindow()) {
      activeMs += TICK_MS
    }
  }, TICK_MS)

  const stopTracking = () => {
    clearInterval(tick)
    if (hiddenGraceTimer) clearTimeout(hiddenGraceTimer)
    ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, markActivity))
  }

  const reportSessionEnd = () => {
    if (reported) return
    reported = true
    stopTracking()

    const activeSeconds = Math.round(activeMs / 1000)
    if (activeSeconds < MIN_ACTIVE_SECONDS_TO_REPORT) return

    sendFinalEvent({
      type: 'close',
      activeSeconds,
      lastSeenIso: new Date().toISOString(),
    })
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = document.visibilityState === 'visible'
    if (isVisible) {
      if (hiddenGraceTimer) {
        clearTimeout(hiddenGraceTimer)
        hiddenGraceTimer = null
      }
      markActivity()
    } else if (!hiddenGraceTimer) {
      hiddenGraceTimer = setTimeout(() => {
        hiddenGraceTimer = null
        reportSessionEnd()
      }, HIDDEN_GRACE_MS)
    }
  })

  // Belt-and-suspenders for an actual tab close / navigation away — these
  // can race with the grace timer above; reportSessionEnd() only ever
  // sends once.
  window.addEventListener('pagehide', reportSessionEnd)
  window.addEventListener('beforeunload', reportSessionEnd)

  // --- "new visit" notification — sent at most once per browser/device ---
  let isNewVisit = false
  try {
    isNewVisit = !localStorage.getItem(VISIT_KEY)
    if (isNewVisit) localStorage.setItem(VISIT_KEY, '1')
  } catch {
    // localStorage unavailable — don't block tracking, just don't persist.
    isNewVisit = true
  }

  if (isNewVisit) {
    postOpenEvent({
      type: 'open',
      openTimeIso: new Date().toISOString(),
      device: detectDevice(),
      browser: detectBrowser(),
    })
  }
}
