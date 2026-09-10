// Serverless API route: POST /api/visit
// Netlify Functions (v2, Web-standard Request/Response) format. The `config`
// export below maps this function to the exact /api/visit path, so no
// separate redirect rule is needed in netlify.toml.
//
// Same stateless relay-to-Telegram behavior as api/visit.js (the Vercel
// version) — kept in sync via the shared ../../api/_visitCore.js module.
//
// Required environment variables (set in Netlify: Site configuration →
// Environment variables): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.

import { buildTelegramMessage, sendTelegramMessage } from '../../api/_visitCore.js'

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const message = buildTelegramMessage(payload)
  if (!message) {
    return new Response(null, { status: 204 })
  }

  // `Netlify.env` is the modern way to read env vars in Netlify Functions;
  // fall back to process.env so this keeps working on older runtimes too.
  const token =
    (typeof Netlify !== 'undefined' && Netlify.env?.get('TELEGRAM_BOT_TOKEN')) ||
    process.env.TELEGRAM_BOT_TOKEN
  const chatId =
    (typeof Netlify !== 'undefined' && Netlify.env?.get('TELEGRAM_CHAT_ID')) ||
    process.env.TELEGRAM_CHAT_ID

  if (token && chatId) {
    try {
      await sendTelegramMessage(token, chatId, message)
    } catch (err) {
      console.error('Telegram notification failed:', err)
    }
  } else {
    console.warn('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping notification.')
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/visit' }
