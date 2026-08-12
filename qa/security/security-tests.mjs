// Automated security tests — defensive checks against MY OWN deployment.
//
//   npm run test:security
//   BASE_URL=http://localhost:3000 npm run test:security
//
// Covers: security headers + CSP quality, cookie hygiene, secret/PII
// exposure in the shipped bundle, and API hardening (method enforcement,
// malformed input, reflected-payload and stack-trace leaks).

import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = (process.env.BASE_URL || 'https://soyed-solaman.vercel.app').replace(/\/$/, '')

// ── Transport & headers ───────────────────────────────────────────────

test('production runs on HTTPS', (t) => {
  if (BASE.includes('localhost') || BASE.includes('127.0.0.1')) return t.skip('local run')
  assert.match(BASE, /^https:/)
})

test('security headers: clickjacking, MIME sniffing, referrer, permissions', async () => {
  const h = (await fetch(`${BASE}/`)).headers
  assert.equal(h.get('x-frame-options'), 'DENY')
  assert.equal(h.get('x-content-type-options'), 'nosniff')
  assert.equal(h.get('referrer-policy'), 'strict-origin-when-cross-origin')
  const perms = h.get('permissions-policy') ?? ''
  for (const feature of ['camera=()', 'microphone=()', 'geolocation=()']) {
    assert.ok(perms.includes(feature), `Permissions-Policy denies ${feature}`)
  }
})

test('CSP is strict where it matters', async () => {
  const csp = (await fetch(`${BASE}/`)).headers.get('content-security-policy')
  assert.ok(csp, 'CSP header present')
  assert.match(csp, /default-src 'self'/)
  assert.match(csp, /frame-ancestors 'none'/)
  assert.match(csp, /base-uri 'self'/)
  const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) ?? ''
  assert.ok(!scriptSrc.includes("'unsafe-inline'"), 'script-src has no unsafe-inline')
  assert.ok(!scriptSrc.includes("'unsafe-eval'"), 'script-src has no unsafe-eval')
  assert.ok(!/script-src[^;]*\s\*/.test(scriptSrc), 'script-src has no wildcard host')
})

test('API responses carry the same hardening headers', async () => {
  const h = (await fetch(`${BASE}/api/jobs?category=qa`)).headers
  assert.equal(h.get('x-content-type-options'), 'nosniff')
})

test('no cookies are set — the site tracks nothing server-side', async () => {
  const res = await fetch(`${BASE}/`)
  assert.equal(res.headers.get('set-cookie'), null)
})

// ── Secrets & PII in the shipped bundle ───────────────────────────────

const LEAK_PATTERNS = [
  [/AIza[0-9A-Za-z_-]{30,}/, 'Google API key'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'secret-key-shaped token'],
  [/\+880\s?1?\d{8,}/, 'Bangladeshi phone number'],
  [/GEMINI_API_KEY\s*[:=]\s*["'][^"']+/, 'inlined Gemini env var'],
  [/RAPIDAPI_KEY\s*[:=]\s*["'][^"']+/, 'inlined RapidAPI env var'],
]

test('shipped HTML and JS contain no API keys or phone numbers', async () => {
  const html = await (await fetch(`${BASE}/`)).text()
  const assets = [...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
  assert.ok(assets.length > 0, 'found JS bundles to scan')

  const sources = [['index.html', html]]
  for (const path of assets) {
    sources.push([path, await (await fetch(`${BASE}${path}`)).text()])
  }
  for (const [name, text] of sources) {
    for (const [pattern, label] of LEAK_PATTERNS) {
      assert.ok(!pattern.test(text), `${label} must not appear in ${name}`)
    }
  }
})

// ── API hardening ─────────────────────────────────────────────────────

test('unsupported methods are rejected, not silently handled', async () => {
  for (const method of ['DELETE', 'PUT']) {
    const res = await fetch(`${BASE}/api/jobs`, { method })
    assert.equal(res.status, 405, `${method} /api/jobs → 405`)
  }
})

test('malformed JSON body → clean 4xx, never a 500', async () => {
  const res = await fetch(`${BASE}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"topic": "manual", "difficulty": ', // truncated on purpose
  })
  assert.ok(res.status >= 400 && res.status < 500, `got ${res.status}`)
})

test('script payload in input is rejected and never reflected back raw', async () => {
  const payload = '<script>alert("xss")</script>'
  const res = await fetch(`${BASE}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic: payload, difficulty: 'easy', count: 3 }),
  })
  assert.equal(res.status, 400)
  const body = await res.text()
  assert.ok(!body.includes(payload), 'payload not reflected unescaped')
})

test('SQL-ish payload in query param is rejected cleanly', async () => {
  const res = await fetch(`${BASE}/api/jobs?category=${encodeURIComponent("qa' OR '1'='1")}`)
  assert.equal(res.status, 400)
})

test('error responses leak no stack traces or internals', async () => {
  const responses = await Promise.all([
    fetch(`${BASE}/api/jobs`), // 400
    fetch(`${BASE}/api/generate-quiz`, { method: 'POST' }), // 400 (empty body)
  ])
  for (const res of responses) {
    const text = await res.text()
    for (const marker of ['    at ', 'node_modules', 'node:internal', '.js:']) {
      assert.ok(!text.includes(marker), `response must not contain "${marker}"`)
    }
  }
})
