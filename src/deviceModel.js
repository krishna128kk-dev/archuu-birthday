// ============================================================================
// iPhone MODEL DETECTION — best-effort, and NEVER a guess
// ============================================================================
// Short version: a website cannot reliably learn an iPhone's exact model.
//
//   1. User-Agent: since iOS 13, every iPhone reports the exact same
//      generic string ("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac
//      OS X) ..."). Apple deliberately removed model-specific UA info.
//
//   2. User-Agent Client Hints (navigator.userAgentData) — the API a site
//      could use to ask Chrome for a device model on Android — is a
//      Chromium-only feature. WebKit (Safari, and every browser on iOS is
//      WebKit under the hood) has publicly declined to implement it, for
//      the same fingerprinting concerns. It's simply undefined in Safari.
//
//   3. That leaves screen.width / screen.height / devicePixelRatio, the
//      last remaining signal — but Apple deliberately reuses the exact same
//      screen size across 3–5 iPhone generations per chassis (the 12, 12
//      Pro, 13, 13 Pro and 14 are all 390×844 @3x, for example). Checking
//      every iPhone chassis since the iPhone 6: every screen bucket
//      currently in real-world use is shared by more than one model.
//
// Net effect: resolveIphoneModel() below will honestly return null (→
// "iPhone (model unavailable)") for almost every real visit. That's not a
// bug — it's the accurate answer. This module still does the full best-
// effort lookup so the rare, truly-unambiguous case is still caught, and so
// nothing here ever fabricates a specific model it isn't sure of.
// ============================================================================

// Each entry maps one (width, height, devicePixelRatio) screen bucket to
// every iPhone model known to share it. Only entries with EXACTLY one
// model are ever returned as a resolved match — everything else means
// "more than one iPhone has this exact screen," which is the normal case.
//
// Deliberately does not include recent/unconfirmed chassis sizes (e.g.
// iPhone 16 Pro / 16 Pro Max) where exact CSS-point dimensions aren't
// something we could verify with confidence — an unrecognized bucket
// safely falls through to "unavailable" anyway, so leaving an uncertain
// entry out costs nothing and guarantees we never assert a wrong model.
const SCREEN_BUCKETS = [
  { w: 320, h: 480, dpr: 1, models: ['iPhone (original)', 'iPhone 3G', 'iPhone 3GS'] },
  { w: 320, h: 480, dpr: 2, models: ['iPhone 4', 'iPhone 4s'] },
  { w: 320, h: 568, dpr: 2, models: ['iPhone 5', 'iPhone 5c', 'iPhone 5s', 'iPhone SE (1st gen)'] },
  { w: 375, h: 667, dpr: 2, models: ['iPhone 6', 'iPhone 6s', 'iPhone 7', 'iPhone 8', 'iPhone SE (2nd gen)', 'iPhone SE (3rd gen)'] },
  { w: 414, h: 736, dpr: 3, models: ['iPhone 6 Plus', 'iPhone 6s Plus', 'iPhone 7 Plus', 'iPhone 8 Plus'] },
  { w: 375, h: 812, dpr: 3, models: ['iPhone X', 'iPhone XS', 'iPhone 11 Pro', 'iPhone 12 mini', 'iPhone 13 mini'] },
  { w: 414, h: 896, dpr: 2, models: ['iPhone XR', 'iPhone 11'] },
  { w: 414, h: 896, dpr: 3, models: ['iPhone XS Max', 'iPhone 11 Pro Max'] },
  { w: 390, h: 844, dpr: 3, models: ['iPhone 12', 'iPhone 12 Pro', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 14'] },
  { w: 428, h: 926, dpr: 3, models: ['iPhone 12 Pro Max', 'iPhone 13 Pro Max', 'iPhone 14 Plus'] },
  { w: 393, h: 852, dpr: 3, models: ['iPhone 14 Pro', 'iPhone 15', 'iPhone 15 Pro', 'iPhone 16'] },
  { w: 430, h: 932, dpr: 3, models: ['iPhone 14 Pro Max', 'iPhone 15 Plus', 'iPhone 15 Pro Max', 'iPhone 16 Plus'] },
]

const UNAVAILABLE_LABEL = 'iPhone (model unavailable)'

function readIphoneScreenSignals() {
  if (typeof window === 'undefined' || typeof screen === 'undefined') return null
  const dprRaw = window.devicePixelRatio || 1
  const a = screen.width
  const b = screen.height
  if (!a || !b) return null
  // screen.width/height swap between portrait and landscape — iPhone specs
  // are always given in portrait, so compare the smaller value against the
  // larger regardless of current orientation.
  return {
    w: Math.min(a, b),
    h: Math.max(a, b),
    dpr: Math.round(dprRaw * 100) / 100,
  }
}

// Returns a specific model name ONLY if every available signal points to
// exactly one iPhone. Returns null for anything else (ambiguous screen
// bucket, unrecognized bucket, or not an iPhone at all) — the caller is
// responsible for turning null into the honest "model unavailable" label.
export function resolveIphoneModel(ua) {
  try {
    if (!/iPhone/i.test(ua || '')) return null

    // User-Agent Client Hints: the one API that could give us a real model
    // name directly, on browsers that support it. Included for
    // completeness / future-proofing — Safari does not implement this
    // (navigator.userAgentData is undefined there), so this is always a
    // no-op on iPhone today, but costs nothing to check.
    const uaData = typeof navigator !== 'undefined' ? navigator.userAgentData : undefined
    if (uaData && typeof uaData.platform === 'string') {
      // Low-entropy hints only ever give platform/brand, never a model —
      // the model itself requires the async getHighEntropyValues(['model'])
      // call, which WebKit has stated it will not implement. Nothing
      // further to extract here; falls through to the screen-metrics check.
    }

    const signals = readIphoneScreenSignals()
    if (!signals) return null

    const matches = SCREEN_BUCKETS.filter(
      (b) => b.w === signals.w && b.h === signals.h && Math.abs(b.dpr - signals.dpr) < 0.01,
    )
    if (matches.length === 1 && matches[0].models.length === 1) {
      return matches[0].models[0]
    }
    return null
  } catch {
    return null
  }
}

// What tracking.js actually sends: the resolved model, or the honest
// "unavailable" label — never a guess. Returns null entirely for non-iPhone
// devices (Android, desktop, etc.), so the caller can omit the field.
export function getIphoneModelLabel(ua) {
  if (!/iPhone/i.test(ua || '')) return null
  return resolveIphoneModel(ua) || UNAVAILABLE_LABEL
}
