# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> OpenClaw Cloud - Auth Pages Tests >> should load register page
- Location: tests\landing-page.spec.ts:101:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="password"]')
Expected: visible
Error: strict mode violation: locator('input[type="password"]') resolved to 2 elements:
    1) <input value="" required="" id="password" type="password" name="password" placeholder="Ít nhất 6 ký tự" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/> aka getByRole('textbox', { name: 'Mật khẩu', exact: true })
    2) <input value="" required="" type="password" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/> aka getByRole('textbox', { name: 'Xác nhận mật khẩu' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="password"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link "🦞 OpenClaw Cloud" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: 🦞
        - generic [ref=e8]: OpenClaw Cloud
      - heading "Bắt đầu miễn phí 🎉" [level=2] [ref=e9]
      - paragraph [ref=e10]: Đăng ký để tiết kiệm 10+ giờ mỗi tuần
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: Họ và tên
          - textbox "Họ và tên" [ref=e15]:
            - /placeholder: Nguyễn Văn A
        - generic [ref=e16]:
          - generic [ref=e17]: Email
          - textbox "Email" [ref=e18]:
            - /placeholder: email@example.com
        - generic [ref=e19]:
          - generic [ref=e20]: Mật khẩu
          - textbox "Mật khẩu" [ref=e21]:
            - /placeholder: Ít nhất 6 ký tự
        - generic [ref=e22]:
          - generic [ref=e23]: Xác nhận mật khẩu
          - textbox "Xác nhận mật khẩu" [ref=e24]:
            - /placeholder: Nhập lại mật khẩu
        - generic [ref=e25]:
          - text: Bằng cách đăng ký, bạn đồng ý với
          - link "Điều khoản dịch vụ" [ref=e26] [cursor=pointer]:
            - /url: "#"
          - text: và
          - link "Chính sách bảo mật" [ref=e27] [cursor=pointer]:
            - /url: "#"
        - button "🚀 Đăng ký ngay" [ref=e28]
      - paragraph [ref=e30]:
        - text: Đã có tài khoản?
        - link "Đăng nhập" [ref=e31] [cursor=pointer]:
          - /url: /login
    - link "← Quay lại trang chủ" [ref=e33] [cursor=pointer]:
      - /url: /
  - alert [ref=e34]
```

# Test source

```ts
  9   |     await page.goto(BASE_URL);
  10  | 
  11  |     // Check page title
  12  |     await expect(page).toHaveTitle(/OpenClaw Cloud/);
  13  | 
  14  |     // Check main heading exists
  15  |     const heading = page.locator('h1, h2').filter({ hasText: /OpenClaw Cloud|Trợ Lý AI/ });
  16  |     await expect(heading.first()).toBeVisible();
  17  | 
  18  |     console.log('✅ Landing page loaded successfully');
  19  |   });
  20  | 
  21  |   test('should display Vietnamese content correctly', async ({ page }) => {
  22  |     await page.goto(BASE_URL);
  23  | 
  24  |     // Check for Vietnamese text
  25  |     await expect(page.locator('body')).toContainText(/Tính năng|Bảng giá|FAQ/);
  26  |     await expect(page.locator('body')).toContainText(/Giảm 50%|Ưu đãi sớm/);
  27  | 
  28  |     console.log('✅ Vietnamese content displayed correctly');
  29  |   });
  30  | 
  31  |   test('should have pricing section', async ({ page }) => {
  32  |     await page.goto(BASE_URL);
  33  | 
  34  |     // Scroll to pricing
  35  |     await page.locator('text=Bảng giá').scrollIntoViewIfNeeded();
  36  | 
  37  |     // Check pricing tiers
  38  |     await expect(page.locator('text=Starter')).toBeVisible();
  39  |     await expect(page.locator('text=Business')).toBeVisible();
  40  |     await expect(page.locator('text=Enterprise')).toBeVisible();
  41  | 
  42  |     // Check pricing
  43  |     await expect(page.locator('text=₫1,250,000')).toBeVisible();
  44  |     await expect(page.locator('text=₫2,500,000')).toBeVisible();
  45  | 
  46  |     console.log('✅ Pricing section working');
  47  |   });
  48  | 
  49  |   test('should display email collection form', async ({ page }) => {
  50  |     await page.goto(BASE_URL);
  51  | 
  52  |     // Scroll to bottom
  53  |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  54  | 
  55  |     // Check for email input
  56  |     const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
  57  |     await expect(emailInput).toBeVisible();
  58  | 
  59  |     console.log('✅ Email form found');
  60  |   });
  61  | 
  62  |   test('should submit email successfully', async ({ page }) => {
  63  |     await page.goto(BASE_URL);
  64  | 
  65  |     // Scroll to bottom
  66  |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
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
> 109 |     await expect(page.locator('input[type="password"]')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
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
  167 |     expect(response.status()).toBe(200);
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