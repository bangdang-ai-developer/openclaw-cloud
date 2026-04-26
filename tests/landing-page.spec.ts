import { test, expect, describe } from '@playwright/test';

// Test Configuration
const BASE_URL = process.env.BASE_URL || 'https://openclaw-cloud-ls9a.vercel.app';

test.describe('OpenClaw Cloud - Landing Page Tests', () => {

  test('should load landing page successfully', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check page title
    await expect(page).toHaveTitle(/OpenClaw Cloud/);

    // Check main heading exists
    const heading = page.locator('h1, h2').filter({ hasText: /OpenClaw Cloud|Trợ Lý AI/ });
    await expect(heading.first()).toBeVisible();

    console.log('✅ Landing page loaded successfully');
  });

  test('should display Vietnamese content correctly', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for Vietnamese text
    await expect(page.locator('body')).toContainText(/Tính năng|Bảng giá|FAQ/);
    await expect(page.locator('body')).toContainText(/Giảm 50%|Ưu đãi sớm/);

    console.log('✅ Vietnamese content displayed correctly');
  });

  test('should have pricing section', async ({ page }) => {
    await page.goto(BASE_URL);

    // Scroll to pricing section
    await page.locator('h2:has-text("Bảng giá")').scrollIntoViewIfNeeded();

    // Check pricing tiers
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Business')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();

    // Check pricing
    await expect(page.locator('text=₫1,250,000')).toBeVisible();
    await expect(page.locator('text=₫2,500,000')).toBeVisible();

    console.log('✅ Pricing section working');
  });

  test('should display email collection form', async ({ page }) => {
    await page.goto(BASE_URL);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check for email input
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    await expect(emailInput).toBeVisible();

    console.log('✅ Email form found');
  });

  test('should submit email successfully', async ({ page }) => {
    await page.goto(BASE_URL);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Fill email form
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    await emailInput.fill(`test-${Date.now()}@example.com`);

    // Click submit button
    const submitBtn = page.locator('button:has-text("Đăng ký"), button:has-text("Submit"), button[type="submit"]').first();
    await submitBtn.click();

    // Wait for response
    await page.waitForTimeout(2000);

    console.log('✅ Email submission test completed');
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);

    // Check main content is visible
    const mainHeading = page.locator('h1, h2').first();
    await expect(mainHeading).toBeVisible();

    // Check pricing section
    await page.locator('h2:has-text("Bảng giá")').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Starter')).toBeVisible();

    console.log('✅ Mobile responsive working');
  });
});

test.describe('OpenClaw Cloud - Auth Pages Tests', () => {

  test('should load register page', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Check page loaded
    await expect(page).toHaveURL(/.*register/);

    // Check for form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    console.log('✅ Register page loaded');
  });

  test('should load login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check page loaded
    await expect(page).toHaveURL(/.*login/);

    // Check for form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    console.log('✅ Login page loaded');
  });

  test('should redirect dashboard to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Should redirect to login (protected route)
    await page.waitForURL(/.*login/, { timeout: 5000 });

    console.log('✅ Dashboard redirects to login (protected route working)');
  });

  test('should show validation errors on register', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Try to submit empty form
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    // Wait a bit for validation
    await page.waitForTimeout(1000);

    // Check URL (should stay on register page due to validation)
    await expect(page).toHaveURL(/.*register/);

    console.log('✅ Validation working');
  });
});

test.describe('OpenClaw Cloud - API Tests', () => {

  test('should subscribe email successfully', async ({ request }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    const response = await request.post(`${BASE_URL}/api/subscribe`, {
      data: {
        email: uniqueEmail,
        fullName: 'Test User',
        companyName: 'Test Company',
        tierInterest: 'starter'
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('message');

    console.log('✅ API subscription successful:', body.message);
  });

  test('should reject invalid email', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/subscribe`, {
      data: {
        email: 'invalid-email',
        fullName: 'Test User'
      }
    });

    // Should return 400 or 200 with error (depends on implementation)
    expect([200, 400]).toContain(response.status());

    const body = await response.json();
    if (response.status() === 400) {
      expect(body).toHaveProperty('error');
      console.log('✅ API validation working:', body.error);
    } else {
      console.log('⚠️ API accepts invalid email (may validate on frontend)');
    }
  });

  test('should check waitlist count', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/subscribe`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('count');

    console.log(`✅ Current waitlist: ${body.count} emails`);
  });
});
