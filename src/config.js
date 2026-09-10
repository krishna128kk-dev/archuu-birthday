// ============================================================================
// ARCHUU'S BIRTHDAY WEBSITE — MASTER CONFIG
// ============================================================================
// This is the ONLY file you should need to touch to switch this site from
// "testing it myself" to "sending it to Archuu for real".
// ============================================================================

// ---------------------------------------------------------------------------
// 1. PREVIEW MODE
// ---------------------------------------------------------------------------
// true  -> the countdown uses PREVIEW_TARGET (for testing everything now)
// false -> the countdown uses REAL_BIRTHDAY_TARGET (11 Sept 2026, 12:00 AM IST)
//
// IMPORTANT: set this to `false` before you actually send the site to Archuu.
export const PREVIEW_MODE = false

// ---------------------------------------------------------------------------
// 2. THE REAL BIRTHDAY
// ---------------------------------------------------------------------------
// September 11, 2026, 12:00:00 AM, Asia/Kolkata (IST, UTC+5:30).
// The "+05:30" offset is what makes this timezone-safe: it does not matter
// what timezone the visitor's phone/laptop is set to, this exact instant
// in time is always the same moment everywhere in the world.
export const REAL_BIRTHDAY_TARGET = '2026-09-11T00:00:00+05:30'

// ---------------------------------------------------------------------------
// 3. PREVIEW TARGET (only used when PREVIEW_MODE = true)
// ---------------------------------------------------------------------------
// Easiest way to test the midnight reveal: change PREVIEW_SECONDS below and
// reload the page. The countdown will always be "PREVIEW_SECONDS away from
// right now", counting down exactly like the real thing.
//
// If you'd rather test against a fixed clock-on-the-wall time instead of a
// rolling "N seconds from now", set PREVIEW_TARGET_OVERRIDE to an ISO string
// (e.g. "2026-09-10T23:59:50+05:30") and it will be used instead.
export const PREVIEW_SECONDS = 15
export const PREVIEW_TARGET_OVERRIDE = null

export function getPreviewTarget() {
  if (PREVIEW_TARGET_OVERRIDE) return PREVIEW_TARGET_OVERRIDE
  return new Date(Date.now() + PREVIEW_SECONDS * 1000).toISOString()
}

// ---------------------------------------------------------------------------
// 4. WHICH TARGET IS ACTUALLY USED
// ---------------------------------------------------------------------------
// Nothing else in the app should read PREVIEW_TARGET / REAL_BIRTHDAY_TARGET
// directly — everything should import BIRTHDAY_TARGET_ISO from here.
export const BIRTHDAY_TARGET_ISO = PREVIEW_MODE
  ? getPreviewTarget()
  : REAL_BIRTHDAY_TARGET

// ---------------------------------------------------------------------------
// 5. HER NAME / SMALL DETAILS
// ---------------------------------------------------------------------------
export const HER_NAME = 'Archuu'
export const HER_FULL_NICKNAME = 'Archuuu'
export const MY_NAME = 'Krishna'
export const HER_AGE_TURNING = 20
export const BIRTH_YEAR = 2006
export const RELATIONSHIP_START_YEAR = 2021
