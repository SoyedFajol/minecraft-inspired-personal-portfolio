import { PROFILE, RESUME_URL } from '../../data/profile'
import { useUiStore } from '../../store/useUiStore'
import { sfx } from '../../game/sfx'

/** "My Resume" — the print-ready CV. Contact spells live in Ask Me / Party Up. */
export default function ContactSection() {
  const openSection = useUiStore((s) => s.openSection)
  return (
    <div className="space-y-4 text-center">
      <p aria-hidden="true" className="text-5xl">📄</p>
      <h3 className="text-xs text-pix-yellow">THE OFFICIAL QUEST SCROLL</h3>
      <p className="mx-auto max-w-md font-body text-sm text-ink-dim">
        Everything this world says, in recruiter format — print-ready.
      </p>

      <div className="mx-auto grid max-w-md gap-3">
        {RESUME_URL ? (
          <a className="pixel-btn pixel-btn--warn !text-[10px]" href={RESUME_URL} onClick={() => sfx.blip()}>
            📄 View Resume (print-ready)
          </a>
        ) : (
          <button className="pixel-btn pixel-btn--warn !text-[10px]" onClick={() => { sfx.blip(); openSection('ask') }}>
            📄 Resume — send a raven to request it
          </button>
        )}
      </div>

      <p className="font-body text-xs text-ink-dim">
        Based in {PROFILE.location} · Want to talk?{' '}
        <button className="underline" onClick={() => { sfx.blip(); openSection('ask') }}>
          Ask Me / Party Up
        </button>{' '}
        has the raven, the links and the booking calendar.
      </p>
    </div>
  )
}
