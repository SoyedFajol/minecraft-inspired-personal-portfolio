import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PROFILE } from '../data/profile'
import { useUiStore } from '../store/useUiStore'
import { sfx } from '../game/sfx'
import { trackEvent } from '../game/analytics'
import Typewriter from './Typewriter'

// Minecraft-style yellow splash text — one per visit, rotates by the minute
const SPLASHES = [
  'Also try the real portfolio!',
  '100% bug-reported!',
  'Now with more blocks!',
  'Scroll-powered legs!',
  'QA approved!',
  'Jump the gap!',
  'Free coins inside!',
  'Made in Bangladesh! 🇧🇩',
  'Punching trees optional!',
  'Watch the cliff…',
]

const CONTROLS = [
  { icon: '🖱️', keys: 'SCROLL / ▲ GO', what: 'walk the road' },
  { icon: '⤒', keys: 'SPACE / JUMP', what: 'jump' },
  { icon: '👀', keys: 'DRAG / GYRO', what: 'look around' },
  { icon: '🔍', keys: 'CTRL+SCROLL / 🔍±', what: 'zoom the city' },
  { icon: '💎', keys: 'GLOWING CRYSTALS', what: 'open my portfolio' },
]

const GRASS = ['#4c9b50', '#57a85b', '#469348', '#5cb060', '#4fa053']
const DIRT = ['#6b4a2e', '#75522f', '#5f4229', '#7a5836']

/** Minecraft-style title screen: splash text, HOW TO PLAY, PRESS START. */
export default function IntroScreen() {
  const start = useUiStore((s) => s.start)
  const [nameDone, setNameDone] = useState(false)
  const splash = useMemo(() => SPLASHES[Math.floor(Date.now() / 60000) % SPLASHES.length], [])

  function pressStart() {
    sfx.start() // joyful jingle; first user gesture also unlocks the AudioContext
    sfx.startMusic() // ambient chiptune loop (respects the mute toggle)
    trackEvent('press_start')
    start()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-night p-6 pb-16 text-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* drifting pixel sprites */}
      {['⛏️', '👾', '🍄', '🗡️', '💎', '🌳', '🏆', '🎮'].map((e, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute text-2xl opacity-40"
          style={{ left: `${8 + i * 11.5}%`, top: `${12 + ((i * 29) % 60)}%` }}
          animate={{ y: [0, i % 2 ? -18 : 14, 0], rotate: [0, i % 2 ? 12 : -12, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 + (i % 3), ease: 'easeInOut' }}
        >
          {e}
        </motion.span>
      ))}

      <motion.p
        aria-hidden="true"
        className="text-5xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        🐞
      </motion.p>

      <div className="relative max-w-2xl">
        <h1 className="text-sm leading-relaxed text-pix-yellow sm:text-xl">
          <Typewriter text={PROFILE.name.toUpperCase()} speed={40} onDone={() => setNameDone(true)} />
        </h1>
        {nameDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="mt-3 font-pixel text-[9px] leading-relaxed sm:text-[11px]">
              <span className="text-neon">A MINECRAFT-INSPIRED </span>
              <span className="text-pix-orange">PERSONAL </span>
              <span className="text-pix-purple">PORTFOLIO</span>
            </p>
            <p className="mt-2 font-body text-xs text-ink-dim">
              {PROFILE.headline} · from {PROFILE.hometown.split(',').pop().trim()} 🥭
            </p>
            {/* the classic angled splash */}
            <motion.p
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-5 rotate-[-12deg] font-pixel text-[9px] text-pix-yellow sm:-right-16 sm:text-[10px]"
              style={{ textShadow: '2px 2px 0 #3f3500' }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              {splash}
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* HOW TO PLAY */}
      <div className="w-full max-w-sm border-4 border-panel-2 bg-panel/80 p-3 text-left shadow-[6px_6px_0_0_rgba(0,0,0,0.45)]">
        <p className="mb-2 text-center font-pixel text-[9px] text-pix-yellow">— HOW TO PLAY —</p>
        <ul className="space-y-1.5">
          {CONTROLS.map((c) => (
            <li key={c.keys} className="flex items-baseline gap-2 font-pixel text-[8px] leading-relaxed">
              <span aria-hidden="true" className="w-5 shrink-0 text-center text-[11px]">{c.icon}</span>
              <span className="text-neon">{c.keys}</span>
              <span className="ml-auto text-ink-dim">{c.what}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        className="pixel-btn press-start-blink !border-pix-yellow !px-8 !py-4 !text-sm"
        onClick={pressStart}
        autoFocus
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        ▶ START GAME
      </motion.button>

      <p className="max-w-sm font-body text-xs text-ink-dim">
        Walk two laps of a voxel world: Round 1 is my story, Round 2 is the
        playground. Collect coins, poke Bugsy — and report the bugs you find 🐞
      </p>

      {/* voxel grass strip along the bottom */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="flex-1">
            <div style={{ height: 10, background: GRASS[i % GRASS.length] }} />
            <div style={{ height: 22, background: DIRT[i % DIRT.length] }} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
