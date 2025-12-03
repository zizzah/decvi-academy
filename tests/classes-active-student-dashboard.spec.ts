import { test, expect } from '@playwright/test';

test('GET /api/classes/active returns active live classes for the student', async ({ page, request }) => {
  // First, log in to get authenticated session
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', 'student@decviacademy.com');
  await page.fill('input[name="password"]', 'StudentPass123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Get cookies from the authenticated page context
  const cookies = await page.context().cookies();
  const authCookie = cookies.find(cookie => cookie.name === 'auth-token');

  // Make authenticated request
  const response = await request.get('/api/classes/active', {
    headers: {
      'Cookie': `auth-token=${authCookie?.value || ''}`
    }
  });

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('classes');
  expect(data).toHaveProperty('studentId');
  expect(Array.isArray(data.classes)).toBe(true);
  if(data.classes.length > 0) {
    expect(data.classes[0]).toHaveProperty('id');
    expect(data.classes[0]).toHaveProperty('title');
    expect(data.classes[0]).toHaveProperty('status');
    expect(data.classes[0].status).toBe('LIVE');
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
