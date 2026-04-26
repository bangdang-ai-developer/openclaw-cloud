# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> OpenClaw Cloud - API Tests >> should subscribe email successfully
- Location: tests\landing-page.spec.ts:155:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  67  | 
  68  |     // Fill email form
  69  |     const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
  70  |     await emailInput.fill(`test-${Date.now()}@example.com`);
  71  | 
  72  |     // Click submit button
  73  |     const submitBtn = page.locator('button:has-text("Đăng ký"), button:has-text("Submit"), button[type="submit"]').first();
  74  |     await submitBtn.click();
  75  | 
  76  |     // Wait for response
  77  |     await page.waitForTimeout(2000);
  78  | 
  79  |     console.log('✅ Email submission test completed');
  80  |   });
  81  | 
  82  |   test('should be mobile responsive', async ({ page }) => {
  83  |     // Set mobile viewport
  84  |     await page.setViewportSize({ width: 375, height: 667 });
  85  |     await page.goto(BASE_URL);
  86  | 
  87  |     // Check main content is visible
  88  |     const mainHeading = page.locator('h1, h2').first();
  89  |     await expect(mainHeading).toBeVisible();
  90  | 
  91  |     // Check pricing section
  92  |     await page.locator('text=Bảng giá').scrollIntoViewIfNeeded();
  93  |     await expect(page.locator('text=Starter')).toBeVisible();
  94  | 
  95  |     console.log('✅ Mobile responsive working');
  96  |   });
  97  | });
  98  | 
  99  | test.describe('OpenClaw Cloud - Auth Pages Tests', () => {
  100 | 
  101 |   test('should load register page', async ({ page }) => {
  102 |     await page.goto(`${BASE_URL}/register`);
  103 | 
  104 |     // Check page loaded
  105 |     await expect(page).toHaveURL(/.*register/);
  106 | 
  107 |     // Check for form elements
  108 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  109 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  110 | 
  111 |     console.log('✅ Register page loaded');
  112 |   });
  113 | 
  114 |   test('should load login page', async ({ page }) => {
  115 |     await page.goto(`${BASE_URL}/login`);
  116 | 
  117 |     // Check page loaded
  118 |     await expect(page).toHaveURL(/.*login/);
  119 | 
  120 |     // Check for form elements
  121 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  122 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  123 | 
  124 |     console.log('✅ Login page loaded');
  125 |   });
  126 | 
  127 |   test('should redirect dashboard to login', async ({ page }) => {
  128 |     await page.goto(`${BASE_URL}/dashboard`);
  129 | 
  130 |     // Should redirect to login (protected route)
  131 |     await page.waitForURL(/.*login/, { timeout: 5000 });
  132 | 
  133 |     console.log('✅ Dashboard redirects to login (protected route working)');
  134 |   });
  135 | 
  136 |   test('should show validation errors on register', async ({ page }) => {
  137 |     await page.goto(`${BASE_URL}/register`);
  138 | 
  139 |     // Try to submit empty form
  140 |     const submitBtn = page.locator('button[type="submit"]').first();
  141 |     await submitBtn.click();
  142 | 
  143 |     // Wait a bit for validation
  144 |     await page.waitForTimeout(1000);
  145 | 
  146 |     // Check URL (should stay on register page due to validation)
  147 |     await expect(page).toHaveURL(/.*register/);
  148 | 
  149 |     console.log('✅ Validation working');
  150 |   });
  151 | });
  152 | 
  153 | test.describe('OpenClaw Cloud - API Tests', () => {
  154 | 
  155 |   test('should subscribe email successfully', async ({ request }) => {
  156 |     const uniqueEmail = `test-${Date.now()}@example.com`;
  157 | 
  158 |     const response = await request.post(`${BASE_URL}/api/subscribe`, {
  159 |       data: {
  160 |         email: uniqueEmail,
  161 |         fullName: 'Test User',
  162 |         companyName: 'Test Company',
  163 |         tierInterest: 'starter'
  164 |       }
  165 |     });
  166 | 
> 167 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  168 | 
  169 |     const body = await response.json();
  170 |     expect(body).toHaveProperty('success', true);
  171 |     expect(body).toHaveProperty('message');
  172 | 
  173 |     console.log('✅ API subscription successful:', body.message);
  174 |   });
  175 | 
  176 |   test('should reject invalid email', async ({ request }) => {
  177 |     const response = await request.post(`${BASE_URL}/api/subscribe`, {
  178 |       data: {
  179 |         email: 'invalid-email',
  180 |         fullName: 'Test User'
  181 |       }
  182 |     });
  183 | 
  184 |     // Should return 400 or 200 with error (depends on implementation)
  185 |     expect([200, 400]).toContain(response.status());
  186 | 
  187 |     const body = await response.json();
  188 |     if (response.status() === 400) {
  189 |       expect(body).toHaveProperty('error');
  190 |       console.log('✅ API validation working:', body.error);
  191 |     } else {
  192 |       console.log('⚠️ API accepts invalid email (may validate on frontend)');
  193 |     }
  194 |   });
  195 | 
  196 |   test('should check waitlist count', async ({ request }) => {
  197 |     const response = await request.get(`${BASE_URL}/api/subscribe`);
  198 | 
  199 |     expect(response.status()).toBe(200);
  200 | 
  201 |     const body = await response.json();
  202 |     expect(body).toHaveProperty('success', true);
  203 |     expect(body).toHaveProperty('count');
  204 | 
  205 |     console.log(`✅ Current waitlist: ${body.count} emails`);
  206 |   });
  207 | });
  208 | 
```