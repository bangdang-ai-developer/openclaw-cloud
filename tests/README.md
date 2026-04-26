# 🧪 Browser Testing Guide with Playwright

## 🚀 Quick Start

### **Step 1: Install Playwright**

```bash
cd "C:\Users\bang\Personal Project\PassiveIncome\openclaw-cloud\landing"

# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

### **Step 2: Run Tests**

```bash
# Run all tests (headed - see browser)
npm run test:e2e

# Run tests in headless mode
npm run test:e2e:headless

# Run specific test file
npx playwright test tests/landing-page.spec.ts

# Run with UI (interactive)
npx playwright test --ui
```

---

## 📋 Test Coverage

### **Landing Page Tests:**
- ✅ Page loads successfully
- ✅ Vietnamese content displays correctly
- ✅ Pricing section shows correct amounts (₫1,250,000, ₫2,500,000)
- ✅ Email collection form exists
- ✅ Email submission works
- ✅ Mobile responsive (375x667 viewport)

### **Auth Pages Tests:**
- ✅ Register page loads
- ✅ Login page loads
- ✅ Dashboard redirects to login (protected route)
- ✅ Form validation works

### **API Tests:**
- ✅ Email subscription via API
- ✅ Invalid email rejection
- ✅ Waitlist count retrieval

---

## 📦 Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test --headed",
    "test:e2e:headless": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## 🎯 Test Results Example

```bash
Running 12 tests using 1 worker

✓ Landing page tests (6)
  ✓ should load landing page successfully
  ✓ should display Vietnamese content correctly
  ✓ should have pricing section
  ✓ should display email collection form
  ✓ should submit email successfully
  ✓ should be mobile responsive

✓ Auth pages tests (4)
  ✓ should load register page
  ✓ should load login page
  ✓ should redirect dashboard to login
  ✓ should show validation errors on register

✓ API tests (2)
  ✓ should subscribe email successfully
  ✓ should reject invalid email

12 passed (12.3s)
```

---

## 🎬 Watch Tests Run (Recommended for First Time)

Run this to see browser automation in action:

```bash
npx playwright test --headed
```

This will:
1. Open Chrome browser
2. Navigate to your site
3. Run all tests
4. Show you what's happening
5. Close browser when done

---

## 🐛 Debugging

### **Run in Debug Mode:**
```bash
npx playwright test --debug
```

This:
- Opens browser with inspector
- Pauses at each test
- Lets you step through
- Shows console logs

### **Run Specific Test:**
```bash
npx playwright test -g "should load landing page"
```

### **Run with Trace:**
```bash
npx playwright test --trace on
```

View trace:
```bash
npx playwright show-trace trace.zip
```

---

## 📊 Test Reports

### **HTML Report:**
```bash
npx playwright show-report
```

This generates:
- Visual test results
- Screenshots of failures
- Timeline of actions
- Network requests

---

## 🎨 Custom Tests

### **Add Your Own Tests:**

Create new file: `tests/my-feature.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('my custom test', async ({ page }) => {
  await page.goto('https://openclaw-cloud-ls9a.vercel.app');

  // Your test logic here
  await expect(page.locator('h1')).toBeVisible();
});
```

### **Test Different Viewports:**

```typescript
test('mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('https://openclaw-cloud-ls9a.vercel.app');
  // Test mobile layout
});

test('desktop view', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://openclaw-cloud-ls9a.vercel.app');
  // Test desktop layout
});
```

---

## 🌐 Cross-Browser Testing

### **Test All Browsers:**
```bash
# Test Chrome, Firefox, Safari
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### **Configure in playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

---

## 📝 CI/CD Integration

### **Add to GitHub Actions:**

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 💡 Best Practices

### **1. Use Data Test IDs:**
```tsx
<button data-testid="submit-button">Submit</button>

// In test:
await page.click('[data-testid="submit-button"]');
```

### **2. Wait for Elements:**
```typescript
// Instead of:
await page.waitForTimeout(5000);

// Use:
await expect(page.locator('.result')).toBeVisible();
```

### **3. Handle Dynamic Content:**
```typescript
// Wait for API response
await page.waitForResponse(response =>
  response.url().includes('/api/subscribe')
);

// Wait for navigation
await page.waitForURL(/.*dashboard/);
```

---

## 🎯 Current Test Status

### **Tests Written:**
- ✅ Landing page (6 tests)
- ✅ Auth pages (4 tests)
- ✅ API endpoints (2 tests)

**Total: 12 tests**

### **Coverage:**
- ✅ Page rendering
- ✅ Vietnamese content
- ✅ Form validation
- ✅ API responses
- ✅ Mobile responsiveness
- ✅ Protected routes

---

## 🚀 Next Steps

1. **Install Playwright** (5 minutes)
2. **Run tests** (2 minutes)
3. **Fix any failures** (if any)
4. **Add more tests** (optional)
5. **Set up CI/CD** (optional)

---

## 📞 If Tests Fail

### **Common Issues:**

**Issue 1: "Test timeout"**
```
Solution: Increase timeout in test
await test.setTimeout(60000); // 60 seconds
```

**Issue 2: "Element not found"**
```
Solution: Use more specific selectors
await page.locator('button.submit-btn').click();
```

**Issue 3: "API returns 500"**
```
Solution: Check API logs, fix server-side issue
```

---

**Ready to test? Run this now:**

```bash
cd "C:\Users\bang\Personal Project\PassiveIncome\openclaw-cloud\landing"
npm install -D @playwright/test
npx playwright install
npx playwright test --headed
```

**Watch your site being tested automatically!** 🎉
