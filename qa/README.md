# 🧪 QA Suite

The test artifacts for this portfolio — written the way I test at work:
manual test cases, a release checklist, automated API tests, and a k6 load
test. (The 55-test unit suite lives in `/tests` and runs with `npm test`.)

| Artifact | What it covers | How to run |
| --- | --- | --- |
| [`TEST-CASES.md`](TEST-CASES.md) | Manual functional test cases (30+) | read & execute |
| [`CHECKLIST.md`](CHECKLIST.md) | Pre-release regression checklist | tick before every deploy |
| [`api/api-tests.mjs`](api/api-tests.mjs) | Automated API + smoke tests | `npm run test:api` |
| [`security/security-tests.mjs`](security/security-tests.mjs) | Automated security tests (headers, CSP, secret/PII leaks, API hardening) | `npm run test:security` |
| [`SECURITY.md`](SECURITY.md) | Manual security checklist (deps, AI abuse, external scanners) | run before major releases |
| [`load/k6-load.js`](load/k6-load.js) | Load & smoke performance tests | `k6 run qa/load/k6-load.js` |

## API tests

Built on Node's built-in test runner (`node:test`) — zero extra dependencies.
They hit the deployed site by default and reuse the same schema validator the
server uses (`lib/validateQuiz.js`), so the contract can never drift.

```bash
npm run test:api                                  # against production
BASE_URL=http://localhost:3000 npm run test:api   # against `vercel dev`
```

> Note: `npm run dev` (Vite) serves only the frontend — API routes need
> `vercel dev` or the deployed site.

## Load tests

Requires [k6](https://k6.io/docs/get-started/installation/) (a single binary).

```bash
k6 run qa/load/k6-load.js                       # smoke: 1 VU, 30s
k6 run -e PROFILE=load qa/load/k6-load.js       # load: ramp 0→15→0 VUs over 3m
k6 run -e BASE_URL=https://preview-url qa/load/k6-load.js
```

Thresholds: p(95) < 800 ms, error rate < 1%. Rate-limited `429`s from the
API are counted as *correct* behavior (the limiter working), not failures.

⚠️ Be polite: the load profile is capped at 15 VUs on purpose — this runs
against free-tier infrastructure. Don't point it at hosts you don't own.
