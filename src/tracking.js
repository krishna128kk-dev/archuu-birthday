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

// A session under this many active seconds doesn't get its own "session
// ended" notification — this is what keeps an accidental refresh (which
// tears down and instantly recreates the page) from spamming a near-zero
// length close message.
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

// Used for the final "session ended" event. sendBeacon is what actually
// makes this reliable: it's specifically designed to survive the page
// tearing down (tab closing, app being swiped away, navigation), which a
// normal fetch() is not guaranteed to do — the browser queues it and
// delivers it even after the page is gone. Falls back to a keepalive fetch
// only if sendBeacon itself isn't available.
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
  let tickInterval = null
  // Starts "already reported" so a stray hidden/pagehide event that somehow
  // fires before beginSession() runs below can't send an empty session.
  let reported = true

  const withinActivityWindow = () => Date.now() - lastActivityAt < INACTIVITY_TIMEOUT_MS
  const markActivity = () => {
    lastActivityAt = Date.now()
  }

  // Activity listeners stay attached for the page's whole lifetime — they
  // just feed lastActivityAt, independent of whichever session is current.
  ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, markActivity, { passive: true }))

  // Starts (or restarts) the per-second active-time accumulator for a fresh
  // viewing session.
  function beginSession() {
    activeMs = 0
    lastActivityAt = Date.now()
    reported = false
    if (tickInterval) clearInterval(tickInterval)
    tickInterval = setInterval(() => {
      if (isVisible && withinActivityWindow()) {
        activeMs += TICK_MS
      }
    }, TICK_MS)
  }

  // Ends the current session RIGHT NOW and — if it was long enough to be
  // worth mentioning — sends the "session ended" Telegram notification via
  // sendBeacon. Called immediately (no artificial delay) from every browser
  // lifecycle signal that can mean "she's gone": the tab/app was actually
  // closed, or it just went to the background. iOS Safari in particular
  // gives no guarantee that any further event fires after backgrounding —
  // the page can be frozen or discarded outright — so this can't afford to
  // wait and see.
  //
  // Guarded by `reported` so pagehide/visibilitychange/beforeunload racing
  // each other (which they routinely do) only ever sends one notification.
  function endSession() {
    if (reported) return
    reported = true
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }

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
      markActivity()
      // She's back after a session had already been closed out (e.g. she'd
      // locked the screen, or switched away for a while) — start tracking
      // a brand new session rather than silently reviving the old one.
      if (reported) beginSession()
    } else {
      // Tab/app just went to the background. On iPhone Safari this covers
      // locking the screen, switching apps, and swiping Safari away — end
      // the session immediately rather than guessing whether she'll return.
      endSession()
    }
  })

  // Belt-and-suspenders for an actual tab close / navigation away.
  // `pagehide` is the most reliable "really leaving" signal across
  // browsers, including iOS Safari (more reliable there than `unload`,
  // which mobile Safari often skips entirely). These race with the
  // visibilitychange handler above; endSession() only ever sends once.
  window.addEventListener('pagehide', endSession)
  window.addEventListener('beforeunload', endSession)

  beginSession()

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
