// Shared, transport-agnostic core used by both serverless targets:
//   - api/visit.js                (Vercel)
//   - netlify/functions/visit.js  (Netlify)
//
// Keeps the message format and Telegram-sending logic in exactly one place.

const IST_TIME_OPTS = {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
}

function formatIstTime(isoString) {
  const date = isoString ? new Date(isoString) : new Date()
  const valid = !Number.isNaN(date.getTime()) ? date : new Date()
  return `${valid.toLocaleTimeString('en-US', IST_TIME_OPTS)} IST`
}

function formatActiveDuration(activeSeconds) {
  const total = Math.max(0, Math.round(Number(activeSeconds) || 0))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  if (minutes <= 0) return `~${seconds} sec`
  return `~${minutes} min ${seconds} sec`
}

// Very small, best-effort sanity limits — this endpoint has no auth, so we
// just make sure a stray/garbage POST can't produce a huge or malformed
// Telegram message.
function clampString(value, maxLen) {
  if (typeof value !== 'string') return ''
  return value.slice(0, maxLen)
}

export function buildTelegramMessage(payload) {
  if (!payload || typeof payload !== 'object') return null

  if (payload.type === 'open') {
    const openedAt = formatIstTime(payload.openTimeIso)
    const device = clampString(payload.device, 20) || 'Unknown'
    const browser = clampString(payload.browser, 30) || 'Unknown'
    // Only ever a specific model (e.g. "iPhone 15 Pro") or the honest
    // "iPhone (model unavailable)" label sent by the client — never
    // fabricated here. Omitted on the device line entirely for non-iPhone
    // visitors (Android, desktop, etc.), where it's simply not present.
    const deviceModel = clampString(payload.deviceModel, 40)
    const deviceLine = deviceModel ? `📱 Device: ${device} — ${deviceModel}` : `📱 Device: ${device}`
    return [
      '🎂 ARCHUU BIRTHDAY WEBSITE',
      'NEW VISIT',
      `🕐 Opened: ${openedAt}`,
      deviceLine,
      `🌐 Browser: ${browser}`,
    ].join('\n')
  }

  if (payload.type === 'close') {
    const lastSeen = formatIstTime(payload.lastSeenIso)
    const activeTime = formatActiveDuration(payload.activeSeconds)
    return [
      "💗 ARCHUU'S SESSION ENDED",
      `🕐 Last seen: ${lastSeen}`,
      `⏱️ Active time: ${activeTime}`,
    ].join('\n')
  }

  return null
}

// Strips the bot token out of any string before it's ever logged — the
// request URL below embeds it (Telegram's API shape requires that), and a
// network-level fetch failure can otherwise echo the full URL back inside
// its error message. This keeps the token out of Vercel/Netlify logs even
// in that case.
function redact(str, token) {
  if (!token || typeof str !== 'string') return str
  return str.split(token).join('[redacted]')
}

export async function sendTelegramMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_notification: false }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Telegram API responded ${res.status}: ${redact(body, token)}`)
    }
  } catch (err) {
    const safeMessage = redact(err instanceof Error ? err.message : String(err), token)
    throw new Error(safeMessage)
  }
}

// Reads a JSON body off a Node-style (Vercel) request when it hasn't already
// been parsed for us.
export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 10_000) {
        reject(new Error('Body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}
