// Serverless API route: POST /api/visit
// Vercel format (this file is auto-detected as a serverless function when
// deployed to Vercel — no extra config needed).
//
// Relays two kinds of anonymous, minimal visit events to a private Telegram
// chat: 'open' (the site was just opened for the first time on this
// device/browser) and 'close' (that viewing session just ended, with an
// approximate active-viewing duration). No visit data is stored anywhere —
// this function is a stateless relay to the Telegram Bot API.
//
// Required environment variables (set these in your host's dashboard, never
// commit them): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.

import { buildTelegramMessage, sendTelegramMessage, readJsonBody } from './_visitCore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  let payload
  try {
    payload = req.body && typeof req.body === 'object' ? req.body : await readJsonBody(req)
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' })
    return
  }

  const message = buildTelegramMessage(payload)
  if (!message) {
    // Unknown/invalid event type — accept quietly, don't error the beacon.
    res.status(204).end()
    return
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (token && chatId) {
    try {
      await sendTelegramMessage(token, chatId, message)
    } catch (err) {
      // Don't leak details to the client; just log server-side.
      console.error('Telegram notification failed:', err)
    }
  } else {
    console.warn('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping notification.')
  }

  res.status(200).json({ ok: true })
}
