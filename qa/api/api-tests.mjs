// Automated API + smoke tests, using Node's built-in test runner.
//
//   npm run test:api                                  → against production
//   BASE_URL=http://localhost:3000 npm run test:api   → against `vercel dev`
//
// Deliberately reuses lib/validateQuiz.js — the exact validator the server
// runs — so these tests and the API can never disagree about the contract.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateQuiz } from '../../lib/validateQuiz.js'
import { TOPIC_IDS } from '../../lib/fallbackQuizzes.js'

const BASE = (process.env.BASE_URL || 'https://soyed-solaman.vercel.app').replace(/\/$/, '')

// ── Basic site smoke ──────────────────────────────────────────────────

test('GET / serves the app shell', async () => {
  const res = await fetch(`${BASE}/`)
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type') ?? '', /text\/html/)
  const html = await res.text()
  assert.match(html, /Soyed/i, 'page should mention the owner')
  assert.match(html, /<div id="root">/, 'React mount point present')
})

test('security headers are present', async () => {
  const res = await fetch(`${BASE}/`)
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(res.headers.get('x-frame-options'), 'DENY')
  assert.ok(res.headers.get('content-security-policy'), 'CSP header set')
  assert.ok(res.headers.get('referrer-policy'), 'Referrer-Policy set')
})

test('SPA rewrite: unknown path still serves the app (client 404)', async () => {
  const res = await fetch(`${BASE}/definitely-not-a-page`)
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type') ?? '', /text\/html/)
})

// ── /api/jobs ─────────────────────────────────────────────────────────

test('GET /api/jobs without category → 400', async () => {
  const res = await fetch(`${BASE}/api/jobs`)
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.ok(body.error, 'error message present')
})

test('GET /api/jobs?category=qa → jobs array (live or fallback)', async () => {
  const res = await fetch(`${BASE}/api/jobs?category=qa`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.ok(Array.isArray(body.jobs), 'jobs is an array')
  assert.equal(typeof body.fallback, 'boolean')
  for (const job of body.jobs) {
    assert.equal(typeof job.title, 'string')
    assert.ok(job.title.length > 0)
  }
})

test('POST /api/jobs → 405 with Allow header', async () => {
  const res = await fetch(`${BASE}/api/jobs`, { method: 'POST' })
  assert.equal(res.status, 405)
  assert.equal(res.headers.get('allow'), 'GET')
})

// ── /api/generate-quiz ────────────────────────────────────────────────

test('GET /api/generate-quiz → 405 with Allow header', async () => {
  const res = await fetch(`${BASE}/api/generate-quiz`)
  assert.equal(res.status, 405)
  assert.equal(res.headers.get('allow'), 'POST')
})

test('POST /api/generate-quiz with unknown topic → 400', async () => {
  const res = await fetch(`${BASE}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic: 'astrology', difficulty: 'easy', count: 3 }),
  })
  assert.equal(res.status, 400)
})

test('POST /api/generate-quiz with bad count → 400', async () => {
  const res = await fetch(`${BASE}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic: TOPIC_IDS[0], difficulty: 'easy', count: 99 }),
  })
  assert.equal(res.status, 400)
})

test('POST /api/generate-quiz happy path → valid quiz (ai or fallback)', async () => {
  const res = await fetch(`${BASE}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic: TOPIC_IDS[0], difficulty: 'easy', count: 3 }),
  })
  // 429 = the rate limiter doing its job (e.g. repeated local runs) — accept it
  if (res.status === 429) return
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.ok(['ai', 'fallback'].includes(body.source), `source is ai|fallback, got ${body.source}`)
  const quiz = validateQuiz(body.quiz)
  assert.ok(quiz, 'response passes the server-side quiz schema')
  assert.ok(quiz.questions.length >= 3, 'at least the requested question count')
})
