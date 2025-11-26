import { test, expect } from '@playwright/test';

test('GET /api/classes/active returns active live classes for the student', async ({ request }) => {
  const response = await request.get('/api/classes/active');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
  if(data.length > 0) {
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('status');
    expect(data[0].status).toBe('LIVE');
  }
});

test('Student can see active live classes on the dashboard', async ({ page }) => {
  await page.goto('/auth/login');
  // TODO: Replace with valid test credentials or mock auth
  await page.fill('input[name="email"]', 'student@decviacademy.com');
  await page.fill('input[name="password"]', 'StudentPass123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Check live class card or section in dashboard
  const liveClassSection = page.locator('text=Live React Workshop');
  await expect(liveClassSection).toBeVisible();

  // Check join/live link/button present
  const joinButton = page.locator('text=Join Live Class');
  await expect(joinButton).toBeVisible();
});
