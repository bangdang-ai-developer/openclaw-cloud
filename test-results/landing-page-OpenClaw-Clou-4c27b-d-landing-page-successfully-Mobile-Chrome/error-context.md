# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> OpenClaw Cloud - Landing Page Tests >> should load landing page successfully
- Location: tests\landing-page.spec.ts:8:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /OpenClaw Cloud/
Received string:  "Create Next App"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    9 × unexpected value "Create Next App"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e7]: 🦞
          - generic [ref=e8]: OpenClaw Cloud
        - button "Dùng thử miễn phí" [ref=e9]
    - generic [ref=e10]:
      - generic [ref=e11]: 🎉 Ưu đãi sớm - Giảm 50% cho 100 khách hàng đầu tiên
      - heading "Trợ Lý AI Tự Động Hóa Doanh Nghiệp Của Bạn" [level=1] [ref=e12]:
        - text: Trợ Lý AI Tự Động Hóa
        - text: Doanh Nghiệp Của Bạn
      - paragraph [ref=e13]: Drowning trong email, lịch họp, và tasks hàng ngày? Để AI lo hết. Bạn dành thời gian cho việc quan trọng hơn - phát triển doanh nghiệp.
      - generic [ref=e14]:
        - button "🚀 Bắt đầu miễn phí - 14 ngày" [ref=e15]
        - button "📹 Xem demo video" [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: ✓
          - text: Không cần thẻ tín dụng
        - generic [ref=e20]:
          - generic [ref=e21]: ✓
          - text: Setup trong 5 phút
        - generic [ref=e22]:
          - generic [ref=e23]: ✓
          - text: Hủy bất cứ lúc nào
    - generic [ref=e25]:
      - paragraph [ref=e26]: Đã có 23 doanh nghiệp đăng ký chờ đợi
      - generic [ref=e27]:
        - generic [ref=e28]: Công ty A
        - generic [ref=e29]: Doanh nghiệp B
        - generic [ref=e30]: Startup C
        - generic [ref=e31]: Nhóm D
    - generic [ref=e33]:
      - heading "Bạn có đang gặp những vấn đề này?" [level=2] [ref=e34]
      - generic [ref=e35]:
        - generic [ref=e36]:
          - generic [ref=e37]: 📧
          - heading "Drowning trong email" [level=3] [ref=e38]
          - paragraph [ref=e39]: Mất 2-4 giờ mỗi ngày chỉ để đọc và phân loại email. Quan trọng bị淹没 trong spam.
        - generic [ref=e40]:
          - generic [ref=e41]: 📅
          - heading "Lịch họp lộn xộn" [level=3] [ref=e42]
          - paragraph [ref=e43]: Double-bookings, no-shows, và hàng giờ来回 email chỉ để set up một cuộc họp.
        - generic [ref=e44]:
          - generic [ref=e45]: 😫
          - heading "Không có thời gian cho chiến lược" [level=3] [ref=e46]
          - paragraph [ref=e47]: Dành cả ngày cho tactical tasks, không còn thời gian để think về big picture.
    - generic [ref=e49]:
      - heading "OpenClaw Cloud giải quyết tất cả" [level=2] [ref=e50]
      - paragraph [ref=e51]: AI assistant làm việc 24/7, không bao giờ complain, không bao giờ sick.
      - generic [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e55]: 📧
          - generic [ref=e56]:
            - heading "Email Triage Thông Minh" [level=3] [ref=e57]
            - paragraph [ref=e58]: "AI tự động phân loại email thành: Khẩn cấp, Quan trọng, Bình thường, Spam. Draft responses cho các inquiry thường gặp. Bạn chỉ cần review và click send."
            - paragraph [ref=e59]: ⏱️ Tiết kiệm 2-3 giờ/ngày
        - generic [ref=e60]:
          - generic [ref=e62]: 📅
          - generic [ref=e63]:
            - heading "Calendar Auto-Scheduling" [level=3] [ref=e64]
            - paragraph [ref=e65]: AI tự động lên lịch họp, giải quyết conflicts, send reminders, và thậm chí reschedule nếu có thay đổi.
            - paragraph [ref=e66]: ⏱️ Tiết kiệm 5-10 giờ/tuần
        - generic [ref=e67]:
          - generic [ref=e69]: ✅
          - generic [ref=e70]:
            - heading "Task Management" [level=3] [ref=e71]
            - paragraph [ref=e72]: AI tự động tạo tasks từ email, chat, và meetings. Theo dõi deadlines, send reminders, và weekly summaries.
            - paragraph [ref=e73]: ⏱️ Không bao giờ miss deadline nữa
        - generic [ref=e74]:
          - generic [ref=e76]: 💬
          - generic [ref=e77]:
            - heading "Customer Support Auto-Response" [level=3] [ref=e78]
            - paragraph [ref=e79]: Xử lý 80% customer inquiries automatically. Chỉ escalate cases phức tạp đến bạn.
            - paragraph [ref=e80]: ⏱️ Giảm 70% support workload
    - generic [ref=e82]:
      - heading "Kết quả thực tế từ customers" [level=2] [ref=e83]
      - generic [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]: 10+
          - generic [ref=e87]: giờ tiết kiệm mỗi tuần
        - generic [ref=e88]:
          - generic [ref=e89]: 3x
          - generic [ref=e90]: tăng response speed
        - generic [ref=e91]:
          - generic [ref=e92]: "0"
          - generic [ref=e93]: email bị missed
      - generic [ref=e94]:
        - paragraph [ref=e95]: "\"Tôi đã skeptic về AI automation, nhưng OpenClaw Cloud thực sự works. Email inbox của tôi luôn clean, và tôi không còn miss meetings nữa. Best investment cho business của tôi.\""
        - generic [ref=e96]:
          - generic [ref=e98]: 👤
          - generic [ref=e99]:
            - generic [ref=e100]: Nguyễn Văn A
            - generic [ref=e101]: Founder, Marketing Agency ABC
    - generic [ref=e103]:
      - heading "Bảng giá đơn giản" [level=2] [ref=e104]
      - paragraph [ref=e105]: Không có hidden fees. Hủy bất cứ lúc nào.
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]:
            - heading "Starter" [level=3] [ref=e109]
            - generic [ref=e110]: ₫1,250,000
            - generic [ref=e111]: /tháng
            - generic [ref=e112]: 🎉 Ưu đãi sớm - Giảm 50%
          - list [ref=e113]:
            - listitem [ref=e114]:
              - generic [ref=e115]: ✓
              - text: 1 AI Agent
            - listitem [ref=e116]:
              - generic [ref=e117]: ✓
              - text: Email automation
            - listitem [ref=e118]:
              - generic [ref=e119]: ✓
              - text: Calendar scheduling
            - listitem [ref=e120]:
              - generic [ref=e121]: ✓
              - text: 5,000 API calls/tháng
            - listitem [ref=e122]:
              - generic [ref=e123]: ✓
              - text: Community support
          - button "Bắt đầu miễn phí" [ref=e124]
        - generic [ref=e125]:
          - generic [ref=e126]:
            - generic [ref=e127]: ⭐ PHỔ BIẾN NHẤT
            - heading "Business" [level=3] [ref=e128]
            - generic [ref=e129]: ₫2,500,000
            - generic [ref=e130]: /tháng
          - list [ref=e131]:
            - listitem [ref=e132]:
              - generic [ref=e133]: ✓
              - text: 3 AI Agents
            - listitem [ref=e134]:
              - generic [ref=e135]: ✓
              - text: Tất cả Starter features
            - listitem [ref=e136]:
              - generic [ref=e137]: ✓
              - text: Task management
            - listitem [ref=e138]:
              - generic [ref=e139]: ✓
              - text: Social media automation
            - listitem [ref=e140]:
              - generic [ref=e141]: ✓
              - text: 25,000 API calls/tháng
            - listitem [ref=e142]:
              - generic [ref=e143]: ✓
              - text: Priority support
          - button "Bắt đầu miễn phí" [ref=e144]
        - generic [ref=e145]:
          - generic [ref=e146]:
            - heading "Enterprise" [level=3] [ref=e147]
            - generic [ref=e148]: Custom
            - generic [ref=e149]: Liên hệ để báo giá
          - list [ref=e150]:
            - listitem [ref=e151]:
              - generic [ref=e152]: ✓
              - text: Unlimited AI Agents
            - listitem [ref=e153]:
              - generic [ref=e154]: ✓
              - text: Tất cả Business features
            - listitem [ref=e155]:
              - generic [ref=e156]: ✓
              - text: Custom integrations
            - listitem [ref=e157]:
              - generic [ref=e158]: ✓
              - text: Dedicated infrastructure
            - listitem [ref=e159]:
              - generic [ref=e160]: ✓
              - text: SLA guarantees
            - listitem [ref=e161]:
              - generic [ref=e162]: ✓
              - text: Vietnamese account manager
          - button "Liên hệ" [ref=e163]
    - generic [ref=e165]:
      - heading "Câu hỏi thường gặp" [level=2] [ref=e166]
      - generic [ref=e167]:
        - generic [ref=e168]:
          - heading "Tôi cần kỹ thuật gì để dùng OpenClaw Cloud?" [level=3] [ref=e169]
          - paragraph [ref=e170]: Không cần! Đó là điểm mạnh của chúng tôi. Setup trong 5 phút với guided wizard. Không cần coding, không cần IT knowledge. Nếu bạn biết dùng email và calendar, bạn có thể dùng OpenClaw Cloud.
        - generic [ref=e171]:
          - heading "Dữ liệu của tôi có an toàn không?" [level=3] [ref=e172]
          - paragraph [ref=e173]: Tuyệt đối an toàn. Dữ liệu được lưu tại Vietnam data centers, encrypted AES-256. Chúng tôi tuân thủ Vietnam cybersecurity laws. Bạn có toàn quyền control data của mình.
        - generic [ref=e174]:
          - heading "Tôi có thể hủy bất cứ lúc nào không?" [level=3] [ref=e175]
          - paragraph [ref=e176]: Có, không có contract lock-in. Hủy anytime, không có cancellation fee. Bạn chỉ trả cho những tháng bạn dùng.
        - generic [ref=e177]:
          - heading "AI có thể hiểu tiếng Việt không?" [level=3] [ref=e178]
          - paragraph [ref=e179]: Có! OpenClaw Cloud được thiết kế cho Vietnam market. AI hiểu và viết tiếng Việt tự nhiên. Bạn có thể giao tiếp bằng tiếng Việt 100%.
        - generic [ref=e180]:
          - heading "Tôi có thể thanh toán như thế nào?" [level=3] [ref=e181]
          - paragraph [ref=e182]: Chúng tôi chấp nhận Momo, chuyển khoản ngân hàng (VietQR), và thẻ tín dụng/ghi nợ. Đối với enterprise, chúng tôi cũng chấp nhận invoice thanh toán sau.
    - generic [ref=e184]:
      - heading "Sẵn sàng tiết kiệm 10+ giờ mỗi tuần?" [level=2] [ref=e185]
      - paragraph [ref=e186]: Tham gia 23+ doanh nghiệp Việt Nam đang chờ đợi OpenClaw Cloud
      - generic [ref=e187]:
        - generic [ref=e188]:
          - generic [ref=e189]:
            - textbox "Email của bạn *" [ref=e190]
            - textbox "Họ và tên" [ref=e191]
          - textbox "Tên công ty" [ref=e192]
          - button "🚀 Bắt đầu miễn phí - 14 ngày" [disabled] [ref=e193]
        - paragraph [ref=e194]: Không cần thẻ tín dụng • Setup trong 5 phút • Hủy bất cứ lúc nào
      - generic [ref=e195]:
        - generic [ref=e196]:
          - generic [ref=e197]: ✓
          - text: Dùng thử 14 ngày miễn phí
        - generic [ref=e198]:
          - generic [ref=e199]: ✓
          - text: Không cần thẻ tín dụng
        - generic [ref=e200]:
          - generic [ref=e201]: ✓
          - text: Hủy bất cứ lúc nào
    - contentinfo [ref=e202]:
      - generic [ref=e203]:
        - generic [ref=e204]:
          - generic [ref=e205]:
            - generic [ref=e206]:
              - generic [ref=e208]: 🦞
              - generic [ref=e209]: OpenClaw Cloud
            - paragraph [ref=e210]: Trợ lý AI tự động hóa doanh nghiệp của bạn
          - generic [ref=e211]:
            - heading "Product" [level=4] [ref=e212]
            - list [ref=e213]:
              - listitem [ref=e214]:
                - link "Tính năng" [ref=e215] [cursor=pointer]:
                  - /url: "#features"
              - listitem [ref=e216]:
                - link "Bảng giá" [ref=e217] [cursor=pointer]:
                  - /url: "#pricing"
              - listitem [ref=e218]:
                - link "Case studies" [ref=e219] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e220]:
                - link "Documentation" [ref=e221] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e222]:
            - heading "Company" [level=4] [ref=e223]
            - list [ref=e224]:
              - listitem [ref=e225]:
                - link "About us" [ref=e226] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e227]:
                - link "Blog" [ref=e228] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e229]:
                - link "Careers" [ref=e230] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e231]:
                - link "Contact" [ref=e232] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e233]:
            - heading "Legal" [level=4] [ref=e234]
            - list [ref=e235]:
              - listitem [ref=e236]:
                - link "Privacy Policy" [ref=e237] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e238]:
                - link "Terms of Service" [ref=e239] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e240]:
                - link "Security" [ref=e241] [cursor=pointer]:
                  - /url: "#"
        - generic [ref=e242]:
          - paragraph [ref=e243]: © 2026 OpenClaw Cloud. All rights reserved.
          - paragraph [ref=e244]: Made with ❤️ in Vietnam
  - alert [ref=e245]
```

# Test source

```ts
  1   | import { test, expect, describe } from '@playwright/test';
  2   | 
  3   | // Test Configuration
  4   | const BASE_URL = process.env.BASE_URL || 'https://openclaw-cloud-ls9a.vercel.app';
  5   | 
  6   | test.describe('OpenClaw Cloud - Landing Page Tests', () => {
  7   | 
  8   |   test('should load landing page successfully', async ({ page }) => {
  9   |     await page.goto(BASE_URL);
  10  | 
  11  |     // Check page title
> 12  |     await expect(page).toHaveTitle(/OpenClaw Cloud/);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
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
  109 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  110 | 
  111 |     console.log('✅ Register page loaded');
  112 |   });
```