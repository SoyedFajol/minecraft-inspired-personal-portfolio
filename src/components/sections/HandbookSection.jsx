import { useState } from 'react'
import { motion } from 'framer-motion'
import { sfx } from '../../game/sfx'

// The QA field guide: the fundamentals Soyed actually uses at BRAC IT,
// compressed into cheat-sheet chapters. Generic QA knowledge — no client
// specifics, no made-up war stories.
const CHAPTERS = [
  {
    id: 'bug-report',
    icon: '🐛',
    title: 'Bug Report Anatomy',
    tagline: 'A report devs can act on without a follow-up ping',
    intro: 'One bug, one report. The win condition: a developer reproduces it on the first try.',
    entries: [
      { term: 'Title', tip: 'Symptom + where + condition. “Checkout: 500 on payment submit with 20+ items” beats “payment broken”.' },
      { term: 'Steps to Reproduce', tip: 'Numbered, from a clean state, every click. If step 3 needs test data, attach it.' },
      { term: 'Expected vs Actual', tip: 'Two separate lines. Expected quotes the requirement; actual quotes reality.' },
      { term: 'Evidence', tip: 'Screenshot or video, console/network logs — and the request/response pair for API bugs.' },
      { term: 'Environment', tip: 'Build or version, browser + OS, which server, which account/role.' },
      { term: 'Severity', tip: 'Set it honestly and let triage own priority — the ⚖️ chapter has the split.' },
    ],
  },
  {
    id: 'sev-pri',
    icon: '⚖️',
    title: 'Severity vs Priority',
    tagline: 'How badly it breaks vs how soon it must be fixed',
    intro: 'Severity measures damage; priority measures urgency. They travel separately — the four corners:',
    entries: [
      { term: 'High sev · High pri', tip: 'Payment crashes for every user. Drop everything.' },
      { term: 'High sev · Low pri', tip: 'Crash in a legacy report nobody has opened this year. Real, but it can wait.' },
      { term: 'Low sev · High pri', tip: 'CEO’s name misspelled on the homepage. Cosmetic — fix it today anyway.' },
      { term: 'Low sev · Low pri', tip: 'Tooltip typo on an admin-only page. Backlog.' },
    ],
  },
  {
    id: 'bug-life',
    icon: '🔁',
    title: 'Bug Life Cycle',
    tagline: 'From birth to closure — names vary per tool, the flow doesn’t',
    intro: 'Where a bug lives between “found it” and “gone”. A duplicate check at the start saves everyone’s time.',
    entries: [
      { term: 'New / Open', tip: 'Reported, awaiting triage.' },
      { term: 'Assigned → In Progress', tip: 'Triage confirms it; a developer takes it.' },
      { term: 'Fixed / Ready for QA', tip: 'Dev says done. That’s a claim, not proof — retest it.' },
      { term: 'Retest → Verified', tip: 'Run the original steps on the fixed build. Pass = verified.' },
      { term: 'Reopened', tip: 'Failed retest. Back to the dev with fresh evidence.' },
      { term: 'Closed / Deferred / Rejected', tip: 'Verified, postponed to a later release, or not-a-bug / duplicate / won’t-fix.' },
    ],
  },
  {
    id: 'test-design',
    icon: '🎯',
    title: 'Test Design Techniques',
    tagline: 'Few cases, many bugs — instead of testing everything',
    intro: 'You can’t run every input. These pick the handful of cases most likely to bleed:',
    entries: [
      { term: 'Equivalence Partitioning', tip: 'Split inputs into classes that behave the same; test one value per class.' },
      { term: 'Boundary Value Analysis', tip: 'Bugs live at the edges. An “age 18–60” field wants 17, 18, 60, 61.' },
      { term: 'Decision Tables', tip: 'Multiple conditions combining? Table every combination once — no missed pair.' },
      { term: 'State Transition', tip: 'Map the states (cart → checkout → paid) and test every legal AND illegal jump.' },
      { term: 'Error Guessing', tip: 'Experience-driven: empty input, huge input, emoji, double-click submit, back button after payment.' },
      { term: 'Exploratory Charters', tip: 'Time-boxed missions — “explore checkout on a slow network to discover timeout handling”. Notes over scripts.' },
    ],
  },
  {
    id: 'smoke-sanity',
    icon: '🚬',
    title: 'Smoke · Sanity · Regression',
    tagline: 'Three words interviews love to blur',
    intro: 'All three re-run tests; they differ in when, how wide, and how deep.',
    entries: [
      { term: 'Smoke', tip: 'Wide and shallow, on every new build: app starts, login works, main flows respond. Fail = reject the build.' },
      { term: 'Sanity', tip: 'Narrow and deep, after a change: does the touched area actually work?' },
      { term: 'Regression', tip: 'The full sweep: did today’s change break yesterday’s features? First thing worth automating.' },
      { term: 'Retesting', tip: 'Re-running the exact failed case on the fix. Not the same thing as regression.' },
    ],
  },
  {
    id: 'api-checklist',
    icon: '🔌',
    title: 'API Testing Checklist',
    tagline: 'What an endpoint survives before it earns a ✅',
    intro: 'Postman or Swagger in hand — the checks I run on every endpoint:',
    entries: [
      { term: 'Status codes', tip: '200/201 happy paths, 400 bad payloads, 401/403 auth walls, 404 ghosts — and 5xx never.' },
      { term: 'Contract', tip: 'Response shape matches the spec: fields, types, nullability. Surprise extra fields are a conversation.' },
      { term: 'Negative payloads', tip: 'Missing required fields, wrong types, empty strings, huge strings, script-looking strings.' },
      { term: 'Auth', tip: 'No token, expired token, someone ELSE’s token — the last one finds the scary bugs.' },
      { term: 'Data checks', tip: 'Query the DB after the call: created what it claimed, touched only what it should.' },
      { term: 'Send it twice', tip: 'Double-charges, duplicate rows and 500s hide behind repeated requests.' },
    ],
  },
]

// Full handbooks (PDF, English + বাংলা) served from public/handbooks/.
const BOOKS = [
  {
    icon: '🎭',
    title: 'Playwright Practical Handbook',
    tagline: 'Zero to a production-grade browser automation suite — Python, 7 modules, 7 real-world labs',
    meta: 'EN + বাংলা · 35 pages',
    href: '/handbooks/Playwright-Practical-Handbook-EN-BN.pdf',
  },
  {
    icon: '🐍',
    title: 'Python Practical Handbook',
    tagline: 'Zero to production-ready scripts — 8 chapters, 8 labs, API + database capstone',
    meta: 'EN + বাংলা · 48 pages',
    href: '/handbooks/Python-Practical-Handbook-EN-BN.pdf',
  },
  {
    icon: '🤖',
    title: 'Testing AI Systems',
    tagline: 'The QA engineer’s handbook for models, chatbots & agents — 2026 edition',
    meta: 'EN + বাংলা · 61 pages',
    href: '/handbooks/Testing-AI-Systems-QA-Handbook-2026-Edition.pdf',
  },
]

/** One open chapter: intro + its term/tip cheat-sheet entries. */
function Chapter({ chapter }) {
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-ink-dim">{chapter.intro}</p>
      <ul className="space-y-3">
        {chapter.entries.map((e, i) => (
          <motion.li
            key={e.term}
            className="pixel-panel !border-pix-purple"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-[10px] text-pix-yellow">{e.term}</h3>
            <p className="mt-1.5 font-body text-xs text-ink-dim">{e.tip}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

/** The handbook hub: pick a chapter → its cheat sheet opens. */
export default function HandbookSection() {
  const [selected, setSelected] = useState(null) // null | chapter id

  if (selected) {
    const chapter = CHAPTERS.find((c) => c.id === selected)
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[10px] text-neon">
            {chapter.icon} {chapter.title.toUpperCase()}
          </h3>
          <button
            className="pixel-btn !px-3 !py-2 !text-[9px]"
            onClick={() => {
              sfx.blip()
              setSelected(null)
            }}
          >
            ← ALL CHAPTERS
          </button>
        </div>
        <Chapter chapter={chapter} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-ink-dim">
        My field guide — the QA fundamentals I use every day, compressed into
        cheat sheets. Free loot; take it into your next interview. 🐞
      </p>

      <h3 className="text-[10px] text-neon">📚 THE BOOKSHELF — FULL HANDBOOKS</h3>
      <ul className="grid gap-2 sm:grid-cols-3">
        {BOOKS.map((b, i) => (
          <motion.li
            key={b.href}
            className="pixel-panel !border-pix-yellow flex flex-col"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <h4 className="text-[10px] text-pix-yellow">
              <span aria-hidden="true">{b.icon} </span>
              {b.title}
            </h4>
            <p className="mt-1.5 flex-1 font-body text-xs text-ink-dim">{b.tagline}</p>
            <p className="mt-1.5 font-body text-[11px] text-ink-dim">{b.meta}</p>
            <a
              className="mt-2 self-start border-2 border-neon bg-night px-2 py-1 font-pixel text-[8px] text-neon transition-colors hover:bg-panel-2"
              href={b.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => sfx.coin()}
            >
              📖 OPEN PDF
            </a>
          </motion.li>
        ))}
      </ul>

      <h3 className="text-[10px] text-neon">🗒️ CHEAT-SHEET CHAPTERS</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {CHAPTERS.map((c) => (
          <motion.button
            key={c.id}
            className="pixel-btn !text-left !text-[10px]"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx.blip()
              setSelected(c.id)
            }}
          >
            {c.icon} {c.title}
            <span className="mt-1 block font-body text-xs normal-case text-ink-dim">{c.tagline}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
