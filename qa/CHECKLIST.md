# ✅ Pre-release Checklist

Run top to bottom before every production deploy. A failed box blocks the
release until fixed or consciously waived.

## Gates (automated)

- [ ] `npm test` — all unit tests green
- [ ] `npm run lint` — clean
- [ ] `npm run build` — succeeds, no new chunk-size warnings
- [ ] `npm run test:api` — API contract tests green against the current deploy
- [ ] `npm run test:security` — security tests green against the current deploy

## Functional smoke (5 minutes, desktop)

- [ ] Start screen → START GAME → world loads
- [ ] Scroll-walk a full Round 1, open 2–3 sections
- [ ] Jump works (Space), gap auto-jump works
- [ ] Cliff fall → respawn at start
- [ ] Coins collect, XP toast, save survives a reload
- [ ] Learning Game plays a full quiz (fallback path is fine)
- [ ] Contact form validates; bug-report mailto opens

## Mobile smoke (real device or 360 px emulation)

- [ ] GO / ▼ / GYRO / 🔍± / JUMP buttons all work
- [ ] No horizontal overflow on intro, world, or any overlay
- [ ] Pinch zoom + sideways-drag look work; taps never misfire as drags
- [ ] Frame rate feels smooth walking through the city

## Accessibility

- [ ] Reduced-motion OS setting → flat version renders
- [ ] Tab order sane; Esc closes overlays; focus trapped in dialogs
- [ ] Mute toggle silences everything and persists

## Security & privacy

- [ ] No API keys anywhere in `dist/` (search the built JS)
- [ ] No phone number / home address in UI, bundle, or meta
- [ ] Security headers present on the deploy (CSP, XFO, nosniff)
- [ ] Forms post only to Web3Forms/Calendly per CSP `form-action`

## Meta

- [ ] `<title>` + OG/twitter cards correct (link previewer check)
- [ ] Favicon + manifest load; no 404s in the console
- [ ] `robots.txt` + `sitemap.xml` still served

## Deploy & post-deploy

- [ ] `git push origin main` (CI green)
- [ ] `vercel --prod --yes` → READY + aliased to soyed-solaman.vercel.app
- [ ] Live site: hard-refresh smoke — start, walk, one section, one quiz
- [ ] `npm run test:api` against production one more time
- [ ] No new errors in the browser console on the live site
