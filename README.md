# For Archuu ❤️ — Birthday Website

A private, one-of-a-kind birthday website built for Archuu's 20th birthday
(11 September 2026, midnight IST). React + Vite, no backend, works as a
static site.

---

## 1. Install

You need [Node.js](https://nodejs.org) 18+ installed. Then, inside this
folder:

```bash
npm install
```

## 2. Run it locally (to preview / test)

```bash
npm run dev
```

This starts a local dev server (usually `http://localhost:5173`) and
auto-reloads whenever you edit a file.

## 3. Build for production

```bash
npm run build
```

This creates a `dist/` folder with the final, optimized static site — this
is what you deploy.

You can also preview the production build locally with:

```bash
npm run preview
```

---

## 4. The photos

`public/images/` already contains all 15 real photos pulled from your Google
Drive folder, named `photo-01.jpg` through `photo-15.jpg`, each already
resized and compressed for the web (all under ~500KB). `src/data/photos.js`
has a matching, handwritten caption for every single one, and they're used
throughout the site — the featured cinematic photo, the polaroid scroll
gallery, breathing-room photos inside the love letter, and the final photo at
the very end all pull from this same set of 15.

This is a fixed set on purpose — exactly 15, no extra empty slots. If you
want to swap one out or change a caption:

1. Replace the file in `public/images/` (keep the same filename, e.g.
   `photo-07.jpg`), and/or
2. Edit that entry's `caption` in `src/data/photos.js`.

You can also reorder them, or add/remove entries entirely — the site never
crashes on a missing photo. If a file is ever removed, that spot just shows a
soft placeholder icon instead of breaking the layout.

The final photo at the very end of the site (`finalPhoto` in
`src/data/photos.js`) currently reuses `photo-14.jpg`. Change the index there
(`photos[13]`) if you'd rather feature a different one.

## 5. Adding music

1. Pick a song and export/save it as an `.mp3` file.
2. Name it `song.mp3` and put it in `public/music/song.mp3` (replacing the
   placeholder file there).

The site does **not** autoplay music (browsers block that anyway). A small
"♪ Music" button appears in the top-right corner once she's tapped/scrolled
the page once — she can turn it on or off herself.

To use a different filename, edit `SRC` at the top of
`src/components/MusicButton.jsx`.

---

## 6. Preview Mode — testing before the real birthday

Everything is controlled from **`src/config.js`**:

```js
export const PREVIEW_MODE = true
export const REAL_BIRTHDAY_TARGET = '2026-09-11T00:00:00+05:30'
export const PREVIEW_SECONDS = 15
```

- **`PREVIEW_MODE = true`** → the countdown counts down from
  `PREVIEW_SECONDS` seconds from right now (default: 15 seconds), so you can
  see the entire midnight reveal experience almost immediately every time you
  reload the page.
- **`PREVIEW_MODE = false`** → the countdown uses the real target,
  **11 September 2026, 12:00:00 AM India Standard Time (IST / UTC+5:30)**,
  no matter what timezone the visitor's device is set to.

While `PREVIEW_MODE = true`, a small gear icon (⚙) appears in the
bottom-left corner of the screen — **this is a developer-only panel that is
never shown when `PREVIEW_MODE = false`.** It lets you jump straight to any
part of the experience without waiting:

- **Preview Countdown (reset)** — restarts the pre-midnight countdown screen
- **10 Seconds Before Midnight** — jumps the countdown to 10 seconds left
- **Trigger Midnight Now** — jumps straight to the cinematic midnight reveal
- **Skip to Birthday Experience** — jumps straight into the full scrollable
  site (timeline, photos, love letter, etc.)
- **Skip to Final Letter** — jumps into the site and scrolls to the very last
  section

Use these to check every part of the site before sending it to her.

### Testing the exact midnight moment

To test the automatic "countdown hits zero → cinematic reveal → full
experience" flow end to end:

1. Make sure `PREVIEW_MODE = true`.
2. Set `PREVIEW_SECONDS = 10` (or any small number) in `src/config.js`.
3. Run `npm run dev` and open the site.
4. Watch the countdown run `00:00:10 → 00:00:00`, then watch it
   automatically transition into the midnight reveal and then into the full
   birthday experience — no refresh needed.

---

## 7. Switching to production (before you actually send it to her)

Before sending the site to Archuu, open `src/config.js` and set:

```js
export const PREVIEW_MODE = false
```

Save the file, run `npm run build` again, and redeploy. Now:

- Before **11 September 2026, 12:00 AM IST**, visitors see the elegant
  countdown screen (correct no matter what timezone they're in).
- The moment that instant arrives, the site automatically plays the midnight
  reveal, with no refresh required.
- After that moment (e.g. if she opens the link a day later), the site skips
  straight to the full birthday experience — it never shows a countdown that
  has already finished, and it never shows a negative countdown.
- The developer preview controls (⚙) are completely gone — they only exist
  when `PREVIEW_MODE = true`.

---

## 8. Deploying

This is a static site (just `dist/` after building), so any static host
works.

### Netlify

1. Push this project to a GitHub repo (or use Netlify's drag-and-drop).
2. In Netlify: **Add new site → Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy.

Or, without git: run `npm run build` locally, then drag the `dist/` folder
onto [app.netlify.com/drop](https://app.netlify.com/drop).

### Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **Add New → Project → Import** your repo.
3. Framework preset: Vite (auto-detected).
4. Build command: `npm run build`, Output directory: `dist`.
5. Deploy.

### GitHub Pages

1. Push this project to a GitHub repo.
2. Run `npm run build` to generate `dist/`.
3. Either:
   - Use the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package to
     publish `dist/` to a `gh-pages` branch, or
   - Use a GitHub Actions workflow that runs `npm run build` and deploys
     `dist/` to Pages.
4. Because `vite.config.js` uses `base: './'` (relative paths), the build
   works correctly whether it's served from the root of a domain or from a
   GitHub Pages subpath like `username.github.io/repo-name/`.

**Note:** GitHub Pages only serves static files — it can't run the
`/api/visit` serverless function described below, so the Telegram visit
notifications only work when deployed to Netlify or Vercel. Everything else
about the site works fine on GitHub Pages.

---

## 9. Visit notifications (Telegram) — optional

The site can quietly notify you on Telegram when it's first opened, and
again when that viewing session ends (with an approximate active-viewing
time). This is entirely separate from the birthday experience itself —
nothing about the countdown, reveal, photos, letter, or any other visible
part of the site changes because of this.

**How it works, in short:** the site calls a tiny serverless function at
`/api/visit` (`api/visit.js` for Vercel, `netlify/functions/visit.js` for
Netlify — both included, pick whichever host you deploy to) which relays a
short message to a Telegram chat using a bot token. The token never touches
the browser — it only ever lives in a server-side environment variable.

### One-time setup

1. **Create a Telegram bot:** message [@BotFather](https://t.me/BotFather)
   on Telegram, send `/newbot`, follow the prompts. It gives you a bot token
   that looks like `123456789:AAExampleTokenTextHere`.
2. **Get your chat ID:** message your new bot at least once (anything, e.g.
   "hi"), then message [@userinfobot](https://t.me/userinfobot) to get your
   own numeric Telegram user ID — that's your `TELEGRAM_CHAT_ID`.
3. **Add both as environment variables on your host** (never commit them —
   `.env` is already git-ignored, and `.env.example` shows the exact names):
   - **Vercel:** Project → Settings → Environment Variables → add
     `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
   - **Netlify:** Site configuration → Environment variables → add the same
     two.
4. Redeploy. That's it — no code changes needed.

### What you'll receive

When she opens the site for the first time on a given browser/device:

```
🎂 ARCHUU BIRTHDAY WEBSITE
NEW VISIT
🕐 Opened: 12:03:14 AM IST
📱 Device: Mobile
🌐 Browser: Safari
```

When that viewing session ends (tab closed, or she's navigated away/left it
backgrounded for a while):

```
💗 ARCHUU'S SESSION ENDED
🕐 Last seen: 12:27:41 AM IST
⏱️ Active time: ~24 min 27 sec
```

"Active time" pauses automatically whenever the tab is hidden/backgrounded
or there's been no scroll/tap/click for about 3 minutes, and resumes the
moment there's activity again — so it reflects roughly how long she was
actually looking at the page, not just how long the tab happened to be open.

### Behavior you should know about

- **Preview mode is always silent.** While `PREVIEW_MODE = true` (see
  section 6), `src/tracking.js` does nothing at all — no requests are ever
  made, so testing the site yourself never sends a notification. Tracking
  only activates once you set `PREVIEW_MODE = false`.
- **Refreshing doesn't spam you.** A one-time anonymous marker is stored in
  that browser's `localStorage`, so the "NEW VISIT" message is sent at most
  once per browser/device — reloading the page won't send it again. (Clearing
  that browser's site data, opening the link in a different browser, another
  device, or a private/incognito window will look like a new visit — that's
  expected.) Extremely short sessions (under ~5 seconds, the kind an
  accidental refresh produces) also don't trigger a "session ended" message.
- **What's collected:** only what's needed for the two messages above —
  an approximate open time, a coarse Mobile/Desktop guess and a best-guess
  browser name (both read from the browser's standard, non-invasive
  `navigator` info), and an approximate active-time duration. There's no
  precise location, no fingerprinting, no persistent server-side database —
  the serverless function only relays a message to Telegram and stores
  nothing.

### Testing it locally

The Vite dev server (`npm run dev`) doesn't run serverless functions on its
own. To test the `/api/visit` endpoint locally, use your host's CLI instead,
e.g. `vercel dev` or `netlify dev` (after `npm i -g vercel` or
`npm i -g netlify-cli` and setting up a local `.env` from `.env.example`) —
either will run the site and the function together on one local port.

---

## Project structure

```
archi-birth/
├── package.json
├── index.html
├── vite.config.js
├── netlify.toml         ← Netlify build settings (Vercel needs no config file)
├── .env.example         ← names of the two Telegram env vars (copy → .env)
├── README.md
├── api/
│   ├── visit.js         ← POST /api/visit — Vercel serverless function
│   └── _visitCore.js    ← shared message-formatting + Telegram-sending logic
├── netlify/
│   └── functions/
│       └── visit.js     ← POST /api/visit — Netlify function (same behavior)
├── public/
│   ├── images/        ← her 15 photos live here (see section 4)
│   └── music/         ← put song.mp3 here (see section 5)
└── src/
    ├── main.jsx
    ├── App.jsx              ← stage machine: countdown → reveal → experience
    ├── config.js            ← PREVIEW_MODE, dates, her name — start here
    ├── tracking.js          ← visit/session notifications (see section 9)
    ├── index.css            ← design system (colors, type, layout helpers)
    ├── hooks/
    │   └── useCountdown.js
    ├── data/
    │   ├── photos.js        ← photo list + captions
    │   ├── loveLetter.js    ← the 20-chapter love letter
    │   └── content.js       ← timeline, 20 things I love, open-when, etc.
    └── components/
        ├── NightSky.jsx
        ├── Countdown.jsx
        ├── DevControls.jsx
        ├── BirthdayReveal.jsx
        ├── Timeline.jsx
        ├── PhotoGallery.jsx
        ├── LoveLetter.jsx
        ├── ThingsILove.jsx
        ├── OpenWhen.jsx
        ├── NeverSaid.jsx
        ├── BackTo2021.jsx
        ├── BirthdayWish.jsx
        ├── FinalSection.jsx
        ├── MusicButton.jsx
        └── SafeImage.jsx    ← image wrapper that never breaks on a missing file
```

## Editing the words

Almost everything you'd want to personalize further lives in plain text in
`src/data/loveLetter.js` and `src/data/content.js` — no coding needed, just
edit the strings.
