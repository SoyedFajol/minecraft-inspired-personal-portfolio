import { test, expect } from '@playwright/test'

// Smoke suite: the recruiter-critical paths. Full test plan: qa/TEST-PLAN.md

test('start screen shows name, start button and skip link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /START GAME/ })).toBeVisible()
  const skip = page.getByRole('link', { name: /Skip the game/ })
  await expect(skip).toBeVisible()
  await expect(skip).toHaveAttribute('href', '/resume')
})

test('start screen shows the tested badge and hire CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /TESTED ✓/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /OPEN TO SQA ROLES/ })).toBeVisible()
})

test('pressing start reveals the HUD with resume + contact', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /START GAME/ }).click()
  await expect(page.getByRole('link', { name: 'View resume', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open contact and booking section' })).toBeVisible()
})

test('/resume renders summary, projects, skills and print button', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: 'CAREER SUMMARY' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'PROJECTS' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'SKILLS' })).toBeVisible()
  await expect(page.getByRole('button', { name: /PRINT/ })).toBeVisible()
})

test('home HTML carries indexable resume content before JS runs', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('Jr. SQA Engineer')
  expect(html).toContain('Skip the game')
  expect(html).toContain('application/ld+json')
  expect(html).toContain('soyedmdsolemanfajul@gmail.com')
})

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  expect((await request.get('/robots.txt')).ok()).toBeTruthy()
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  expect(await sitemap.text()).toContain('/resume')
})
