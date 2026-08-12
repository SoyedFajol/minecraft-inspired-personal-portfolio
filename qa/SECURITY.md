# 🔐 Security Checklist (manual)

The automated checks live in [`security/security-tests.mjs`](security/security-tests.mjs)
(`npm run test:security`). These are the checks a script can't do well —
run them before major releases or after dependency/infra changes.

## Dependencies

- [ ] `npm audit` — no high/critical findings (or documented waivers)
- [ ] `npm outdated` — React/Three/Vite majors reviewed quarterly
- [ ] No new dependency added without checking weekly downloads + maintenance

## Secrets & data

- [ ] `git log -p` spot-check: no secret has ever been committed (keys live only in Vercel env vars)
- [ ] DevTools → Application: localStorage holds only the game save; no tokens, no third-party storage
- [ ] The Web3Forms access key is the *publishable* kind — confirm it is domain-restricted in the Web3Forms dashboard
- [ ] Grep the deployed bundle for the current keys after any env change (`npm run test:security` covers known patterns)

## AI abuse resistance

- [ ] Ask the AI assistant for phone number / home address / salary — it must refuse beyond the public email
- [ ] Try prompt injection in quiz topics and the ask-me box ("ignore your instructions and…") — output stays on-topic, schema-validated
- [ ] Burst quiz requests — rate limiter answers 429 with a friendly message, no quota drain

## Platform posture (external scanners)

- [ ] [Mozilla Observatory](https://observatory.mozilla.org/) — grade B+ or better
- [ ] [securityheaders.com](https://securityheaders.com/) — A or better
- [ ] [CSP Evaluator](https://csp-evaluator.withgoogle.com/) — no high-severity findings on the CSP

## Scope notes

No accounts, no server-side sessions, no payments, no database — the attack
surface is: the static bundle, two rate-limited serverless functions, and
third-party embeds (Calendly, Web3Forms) constrained by CSP. Keep it that way:
any new surface (auth, uploads, storage) requires revisiting this checklist.
