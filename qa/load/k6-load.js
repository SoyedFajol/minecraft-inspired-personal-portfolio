// k6 load test for the portfolio + its APIs.
//
//   k6 run qa/load/k6-load.js                       → smoke (1 VU, 30s)
//   k6 run -e PROFILE=load qa/load/k6-load.js       → ramp 0→15→0 VUs over 3m
//   k6 run -e BASE_URL=https://... qa/load/k6-load.js
//
// 15 VUs max on purpose — this targets free-tier infrastructure. API 429s
// count as PASS (the rate limiter working), never as errors.

import http from 'k6/http'
import { check, group, sleep } from 'k6'

const BASE = (__ENV.BASE_URL || 'https://soyed-solaman.vercel.app').replace(/\/$/, '')

const PROFILES = {
  smoke: { vus: 1, duration: '30s' },
  load: {
    stages: [
      { duration: '30s', target: 5 },
      { duration: '1m', target: 15 },
      { duration: '1m', target: 15 },
      { duration: '30s', target: 0 },
    ],
  },
}

export const options = {
  ...PROFILES[__ENV.PROFILE || 'smoke'],
  thresholds: {
    http_req_duration: ['p(95)<800'], // static + CDN-cached API responses
    checks: ['rate>0.99'],
  },
}

export default function () {
  group('homepage', () => {
    const res = http.get(`${BASE}/`)
    check(res, {
      'status 200': (r) => r.status === 200,
      'is html': (r) => (r.headers['Content-Type'] || '').includes('text/html'),
      'has app root': (r) => r.body.includes('<div id="root">'),
    })
  })

  group('jobs api (CDN-cached)', () => {
    const res = http.get(`${BASE}/api/jobs?category=qa`)
    check(res, {
      'status 200 or rate-limited 429': (r) => r.status === 200 || r.status === 429,
      'json jobs array when 200': (r) =>
        r.status !== 200 || Array.isArray(r.json('jobs')),
    })
  })

  group('quiz api (validation path only — no AI quota burned)', () => {
    // an invalid topic exercises routing + validation and returns instantly
    const res = http.post(
      `${BASE}/api/generate-quiz`,
      JSON.stringify({ topic: 'load-test-probe', difficulty: 'easy', count: 3 }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    check(res, {
      'rejects invalid topic (400) or rate-limits (429)': (r) =>
        r.status === 400 || r.status === 429,
    })
  })

  sleep(1) // ~1 iteration/s per VU — a polite, human-ish pace
}
