# Test Plan — soyed-solaman.vercel.app

The portfolio of an SQA engineer should itself be a tested product. This is
the plan behind the "TESTED ✓" badge on the start screen.

## Scope

**In scope**

- Start screen: renders fast, PRESS START works, skip-to-resume link, hire CTA
- Game shell: HUD (resume/contact always reachable), section overlays, save/load
- `/resume`: full content (summary, experience, projects, skills, education), print-to-PDF
- Progression logic: XP curve, ranks, rewards, quiz validation (unit level)
- Serverless APIs: `/api/generate-quiz`, `/api/jobs` — validation + fallbacks
- SEO surface: indexable HTML content, JSON-LD, robots.txt, sitemap.xml

**Out of scope**

- Visual pixel-perfection of the 3D world (eyeballed per release, see CHECKLIST.md)
- Third-party UIs (Calendly widget, Web3Forms delivery)

## Test levels

| Level | Tool | Where | When |
| --- | --- | --- | --- |
| Unit (55 tests) | Vitest | `tests/*.test.js` | every push (CI) |
| E2E smoke | Playwright | `tests/e2e/` | every push (CI), desktop + mobile viewport |
| API | node:test | `qa/api/` | before release, against preview URL |
| Security | node:test | `qa/security/` | before release |
| Load | k6 | `qa/load/` | on demand |
| Manual regression | this repo | `qa/TEST-CASES.md` + `qa/CHECKLIST.md` | before release |

## Browsers & devices

- **Automated:** Chromium desktop (1280×720) and Pixel 5 mobile viewport via Playwright.
- **Manual before release:** Chrome + Firefox on Windows, Chrome on a real
  budget Android (site's primary audience is mobile Bangladesh), Safari on iOS
  when available.
- Reduced-motion and no-WebGL paths are exercised manually (2D fallback mode).

## Entry / exit criteria

- CI (lint + unit + build + e2e) must be green before any deploy.
- Release checklist in `qa/CHECKLIST.md` completed for feature releases.

## Known bugs / limitations

- Gyro look-around needs a motion-permission grant on iOS Safari; blocked
  grants show a toast but tilt stays off.
- On very low-end devices the 3D world can drop below 30 fps — the 2D toggle
  in the HUD is the supported escape hatch.
- The AI quiz falls back to a built-in question bank when `GEMINI_API_KEY` is
  absent or the model returns invalid JSON (by design, not a bug).

Found something else? 🐞 Email soyedmdsolemanfajul@gmail.com — bug reports are
genuinely welcome here.
