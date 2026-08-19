import { motion } from 'framer-motion'
import { useUiStore } from '../../store/useUiStore'
import { sfx } from '../../game/sfx'

// Guild quest board: what Soyed can be hired for. Facts trace back to
// lib/profile.js (skills + experience) — keep the two in sync.
const SERVICES = [
  {
    icon: '🗡️',
    title: 'Software Testing — Manual',
    color: 'var(--neon)',
    pitch:
      'Full manual QA of your web app or API: test case design, exploratory testing, UAT and clear bug reports. Daily craft at BRAC IT on enterprise microservices & ERP systems.',
    loot: ['Test cases & charters', 'API testing (Postman/Swagger)', 'Database checks', 'UAT & bug reports'],
  },
  {
    icon: '🛡️',
    title: 'Software Testing — Automation',
    color: 'var(--pix-purple)',
    pitch:
      'Regression suites that run while you sleep: Playwright or Selenium for the UI, scripted API checks, and n8n pipelines wiring it all together.',
    loot: ['Playwright / Selenium suites', 'API automation', 'n8n workflows', 'CI-friendly reports'],
  },
  {
    icon: '⚙️',
    title: 'Software Development',
    color: 'var(--pix-yellow)',
    pitch:
      'Backend and frontend builds by a QA who codes: Java + Spring Boot microservices (shipped at CMED Health), React/Next.js fronts — this whole world is one.',
    loot: ['Spring Boot / NestJS APIs', 'React / Next.js UI', 'REST integrations', 'MySQL / PostgreSQL'],
  },
  {
    icon: '🤖',
    title: 'AI Agents & Automation',
    color: 'var(--pix-orange)',
    pitch:
      'Practical AI features, not demos: agents and integrations on Gemini / GPT-4 with validation and fallbacks, AI-assisted QA, and Claude Code workflows. The quiz bot in Round 2 is one.',
    loot: ['AI agents & chatbots', 'Gemini / GPT-4 integration', 'AI-assisted QA', 'Workflow automation'],
  },
]

/** Guild board: services on offer, each with the loot you walk away with. */
export default function ServicesSection() {
  const openSection = useUiStore((s) => s.openSection)
  return (
    <div className="space-y-4 text-sm">
      <p className="font-body text-ink-dim">
        The guild board — quests I take on. Every service is backed by the gear in the{' '}
        <span className="text-neon">Skills Inventory</span>, no borrowed armor.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((sv, i) => (
          <motion.li
            key={sv.title}
            className="border-2 bg-night/60 p-3"
            style={{ borderColor: sv.color }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <h3 className="font-pixel text-[10px]" style={{ color: sv.color }}>
              <span aria-hidden="true">{sv.icon} </span>
              {sv.title}
            </h3>
            <p className="mt-2 font-body text-xs text-ink-dim">{sv.pitch}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${sv.title} deliverables`}>
              {sv.loot.map((t) => (
                <li key={t} className="border border-panel-2 px-1.5 py-0.5 font-body text-[11px]">
                  {t}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>

      <motion.div
        className="pixel-panel text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
      >
        <p className="font-body text-xs text-ink-dim">Got a quest that fits? Post it on the board.</p>
        <button
          className="pixel-btn mt-3"
          onClick={() => {
            sfx.blip()
            openSection('ask')
          }}
        >
          💌 SEND A RAVEN
        </button>
      </motion.div>
    </div>
  )
}
