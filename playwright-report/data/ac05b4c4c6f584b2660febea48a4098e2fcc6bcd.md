# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> OpenClaw Cloud - Landing Page Tests >> should have pricing section
- Location: tests\landing-page.spec.ts:31:7

# Error details

```
Error: locator.scrollIntoViewIfNeeded: Error: strict mode violation: locator('text=Bảng giá') resolved to 3 elements:
    1) <a href="#pricing" class="text-gray-600 hover:text-blue-600">Bảng giá</a> aka getByRole('navigation').getByRole('link', { name: 'Bảng giá' })
    2) <h2 class="text-4xl font-bold text-gray-900 mb-4 text-center">Bảng giá đơn giản</h2> aka getByRole('heading', { name: 'Bảng giá đơn giản' })
    3) <a href="#pricing" class="hover:text-white">Bảng giá</a> aka getByRole('contentinfo').getByRole('link', { name: 'Bảng giá' })

Call log:
  - waiting for locator('text=Bảng giá')

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
        - navigation [ref=e9]:
          - link "Tính năng" [ref=e10] [cursor=pointer]:
            - /url: "#features"
          - link "Bảng giá" [ref=e11] [cursor=pointer]:
            - /url: "#pricing"
          - link "FAQ" [ref=e12] [cursor=pointer]:
            - /url: "#faq"
        - button "Dùng thử miễn phí" [ref=e13]
    - generic [ref=e14]:
      - generic [ref=e15]: 🎉 Ưu đãi sớm - Giảm 50% cho 100 khách hàng đầu tiên
      - heading "Trợ Lý AI Tự Động Hóa Doanh Nghiệp Của Bạn" [level=1] [ref=e16]:
        - text: Trợ Lý AI Tự Động Hóa
        - text: Doanh Nghiệp Của Bạn
      - paragraph [ref=e17]: Drowning trong email, lịch họp, và tasks hàng ngày? Để AI lo hết. Bạn dành thời gian cho việc quan trọng hơn - phát triển doanh nghiệp.
      - generic [ref=e18]:
        - button "🚀 Bắt đầu miễn phí - 14 ngày" [ref=e19]
        - button "📹 Xem demo video" [ref=e20]
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]: ✓
          - text: Không cần thẻ tín dụng
        - generic [ref=e24]:
          - generic [ref=e25]: ✓
          - text: Setup trong 5 phút
        - generic [ref=e26]:
          - generic [ref=e27]: ✓
          - text: Hủy bất cứ lúc nào
    - generic [ref=e29]:
      - paragraph [ref=e30]: Đã có 23 doanh nghiệp đăng ký chờ đợi
      - generic [ref=e31]:
        - generic [ref=e32]: Công ty A
        - generic [ref=e33]: Doanh nghiệp B
        - generic [ref=e34]: Startup C
        - generic [ref=e35]: Nhóm D
    - generic [ref=e37]:
      - heading "Bạn có đang gặp những vấn đề này?" [level=2] [ref=e38]
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]: 📧
          - heading "Drowning trong email" [level=3] [ref=e42]
          - paragraph [ref=e43]: Mất 2-4 giờ mỗi ngày chỉ để đọc và phân loại email. Quan trọng bị淹没 trong spam.
        - generic [ref=e44]:
          - generic [ref=e45]: 📅
          - heading "Lịch họp lộn xộn" [level=3] [ref=e46]
          - paragraph [ref=e47]: Double-bookings, no-shows, và hàng giờ来回 email chỉ để set up một cuộc họp.
        - generic [ref=e48]:
          - generic [ref=e49]: 😫
          - heading "Không có thời gian cho chiến lược" [level=3] [ref=e50]
          - paragraph [ref=e51]: Dành cả ngày cho tactical tasks, không còn thời gian để think về big picture.
    - generic [ref=e53]:
      - heading "OpenClaw Cloud giải quyết tất cả" [level=2] [ref=e54]
      - paragraph [ref=e55]: AI assistant làm việc 24/7, không bao giờ complain, không bao giờ sick.
      - generic [ref=e56]:
        - generic [ref=e57]:
          - generic [ref=e59]: 📧
          - generic [ref=e60]:
            - heading "Email Triage Thông Minh" [level=3] [ref=e61]
            - paragraph [ref=e62]: "AI tự động phân loại email thành: Khẩn cấp, Quan trọng, Bình thường, Spam. Draft responses cho các inquiry thường gặp. Bạn chỉ cần review và click send."
            - paragraph [ref=e63]: ⏱️ Tiết kiệm 2-3 giờ/ngày
        - generic [ref=e64]:
          - generic [ref=e66]: 📅
          - generic [ref=e67]:
            - heading "Calendar Auto-Scheduling" [level=3] [ref=e68]
            - paragraph [ref=e69]: AI tự động lên lịch họp, giải quyết conflicts, send reminders, và thậm chí reschedule nếu có thay đổi.
            - paragraph [ref=e70]: ⏱️ Tiết kiệm 5-10 giờ/tuần
        - generic [ref=e71]:
          - generic [ref=e73]: ✅
          - generic [ref=e74]:
            - heading "Task Management" [level=3] [ref=e75]
            - paragraph [ref=e76]: AI tự động tạo tasks từ email, chat, và meetings. Theo dõi deadlines, send reminders, và weekly summaries.
            - paragraph [ref=e77]: ⏱️ Không bao giờ miss deadline nữa
        - generic [ref=e78]:
          - generic [ref=e80]: 💬
          - generic [ref=e81]:
            - heading "Customer Support Auto-Response" [level=3] [ref=e82]
            - paragraph [ref=e83]: Xử lý 80% customer inquiries automatically. Chỉ escalate cases phức tạp đến bạn.
            - paragraph [ref=e84]: ⏱️ Giảm 70% support workload
    - generic [ref=e86]:
      - heading "Kết quả thực tế từ customers" [level=2] [ref=e87]
      - generic [ref=e88]:
        - generic [ref=e89]:
          - generic [ref=e90]: 10+
          - generic [ref=e91]: giờ tiết kiệm mỗi tuần
        - generic [ref=e92]:
          - generic [ref=e93]: 3x
          - generic [ref=e94]: tăng response speed
        - generic [ref=e95]:
          - generic [ref=e96]: "0"
          - generic [ref=e97]: email bị missed
      - generic [ref=e98]:
        - paragraph [ref=e99]: "\"Tôi đã skeptic về AI automation, nhưng OpenClaw Cloud thực sự works. Email inbox của tôi luôn clean, và tôi không còn miss meetings nữa. Best investment cho business của tôi.\""
        - generic [ref=e100]:
          - generic [ref=e102]: 👤
          - generic [ref=e103]:
            - generic [ref=e104]: Nguyễn Văn A
            - generic [ref=e105]: Founder, Marketing Agency ABC
    - generic [ref=e107]:
      - heading "Bảng giá đơn giản" [level=2] [ref=e108]
      - paragraph [ref=e109]: Không có hidden fees. Hủy bất cứ lúc nào.
      - generic [ref=e110]:
        - generic [ref=e111]:
          - generic [ref=e112]:
            - heading "Starter" [level=3] [ref=e113]
            - generic [ref=e114]: ₫1,250,000
            - generic [ref=e115]: /tháng
            - generic [ref=e116]: 🎉 Ưu đãi sớm - Giảm 50%
          - list [ref=e117]:
            - listitem [ref=e118]:
              - generic [ref=e119]: ✓
              - text: 1 AI Agent
            - listitem [ref=e120]:
              - generic [ref=e121]: ✓
              - text: Email automation
            - listitem [ref=e122]:
              - generic [ref=e123]: ✓
              - text: Calendar scheduling
            - listitem [ref=e124]:
              - generic [ref=e125]: ✓
              - text: 5,000 API calls/tháng
            - listitem [ref=e126]:
              - generic [ref=e127]: ✓
              - text: Community support
          - button "Bắt đầu miễn phí" [ref=e128]
        - generic [ref=e129]:
          - generic [ref=e130]:
            - generic [ref=e131]: ⭐ PHỔ BIẾN NHẤT
            - heading "Business" [level=3] [ref=e132]
            - generic [ref=e133]: ₫2,500,000
            - generic [ref=e134]: /tháng
          - list [ref=e135]:
            - listitem [ref=e136]:
              - generic [ref=e137]: ✓
              - text: 3 AI Agents
            - listitem [ref=e138]:
              - generic [ref=e139]: ✓
              - text: Tất cả Starter features
            - listitem [ref=e140]:
              - generic [ref=e141]: ✓
              - text: Task management
            - listitem [ref=e142]:
              - generic [ref=e143]: ✓
              - text: Social media automation
            - listitem [ref=e144]:
              - generic [ref=e145]: ✓
              - text: 25,000 API calls/tháng
            - listitem [ref=e146]:
              - generic [ref=e147]: ✓
              - text: Priority support
          - button "Bắt đầu miễn phí" [ref=e148]
        - generic [ref=e149]:
          - generic [ref=e150]:
            - heading "Enterprise" [level=3] [ref=e151]
            - generic [ref=e152]: Custom
            - generic [ref=e153]: Liên hệ để báo giá
          - list [ref=e154]:
            - listitem [ref=e155]:
              - generic [ref=e156]: ✓
              - text: Unlimited AI Agents
            - listitem [ref=e157]:
              - generic [ref=e158]: ✓
              - text: Tất cả Business features
            - listitem [ref=e159]:
              - generic [ref=e160]: ✓
              - text: Custom integrations
            - listitem [ref=e161]:
              - generic [ref=e162]: ✓
              - text: Dedicated infrastructure
            - listitem [ref=e163]:
              - generic [ref=e164]: ✓
              - text: SLA guarantees
            - listitem [ref=e165]:
              - generic [ref=e166]: ✓
              - text: Vietnamese account manager
          - button "Liên hệ" [ref=e167]
    - generic [ref=e169]:
      - heading "Câu hỏi thường gặp" [level=2] [ref=e170]
      - generic [ref=e171]:
        - generic [ref=e172]:
          - heading "Tôi cần kỹ thuật gì để dùng OpenClaw Cloud?" [level=3] [ref=e173]
          - paragraph [ref=e174]: Không cần! Đó là điểm mạnh của chúng tôi. Setup trong 5 phút với guided wizard. Không cần coding, không cần IT knowledge. Nếu bạn biết dùng email và calendar, bạn có thể dùng OpenClaw Cloud.
        - generic [ref=e175]:
          - heading "Dữ liệu của tôi có an toàn không?" [level=3] [ref=e176]
          - paragraph [ref=e177]: Tuyệt đối an toàn. Dữ liệu được lưu tại Vietnam data centers, encrypted AES-256. Chúng tôi tuân thủ Vietnam cybersecurity laws. Bạn có toàn quyền control data của mình.
        - generic [ref=e178]:
          - heading "Tôi có thể hủy bất cứ lúc nào không?" [level=3] [ref=e179]
          - paragraph [ref=e180]: Có, không có contract lock-in. Hủy anytime, không có cancellation fee. Bạn chỉ trả cho những tháng bạn dùng.
        - generic [ref=e181]:
          - heading "AI có thể hiểu tiếng Việt không?" [level=3] [ref=e182]
          - paragraph [ref=e183]: Có! OpenClaw Cloud được thiết kế cho Vietnam market. AI hiểu và viết tiếng Việt tự nhiên. Bạn có thể giao tiếp bằng tiếng Việt 100%.
        - generic [ref=e184]:
          - heading "Tôi có thể thanh toán như thế nào?" [level=3] [ref=e185]
          - paragraph [ref=e186]: Chúng tôi chấp nhận Momo, chuyển khoản ngân hàng (VietQR), và thẻ tín dụng/ghi nợ. Đối với enterprise, chúng tôi cũng chấp nhận invoice thanh toán sau.
    - generic [ref=e188]:
      - heading "Sẵn sàng tiết kiệm 10+ giờ mỗi tuần?" [level=2] [ref=e189]
      - paragraph [ref=e190]: Tham gia 23+ doanh nghiệp Việt Nam đang chờ đợi OpenClaw Cloud
      - generic [ref=e191]:
        - generic [ref=e192]:
          - generic [ref=e193]:
            - textbox "Email của bạn *" [ref=e194]
            - textbox "Họ và tên" [ref=e195]
          - textbox "Tên công ty" [ref=e196]
          - button "🚀 Bắt đầu miễn phí - 14 ngày" [disabled] [ref=e197]
        - paragraph [ref=e198]: Không cần thẻ tín dụng • Setup trong 5 phút • Hủy bất cứ lúc nào
      - generic [ref=e199]:
        - generic [ref=e200]:
          - generic [ref=e201]: ✓
          - text: Dùng thử 14 ngày miễn phí
        - generic [ref=e202]:
          - generic [ref=e203]: ✓
          - text: Không cần thẻ tín dụng
        - generic [ref=e204]:
          - generic [ref=e205]: ✓
          - text: Hủy bất cứ lúc nào
    - contentinfo [ref=e206]:
      - generic [ref=e207]:
        - generic [ref=e208]:
          - generic [ref=e209]:
            - generic [ref=e210]:
              - generic [ref=e212]: 🦞
              - generic [ref=e213]: OpenClaw Cloud
            - paragraph [ref=e214]: Trợ lý AI tự động hóa doanh nghiệp của bạn
          - generic [ref=e215]:
            - heading "Product" [level=4] [ref=e216]
            - list [ref=e217]:
              - listitem [ref=e218]:
                - link "Tính năng" [ref=e219] [cursor=pointer]:
                  - /url: "#features"
              - listitem [ref=e220]:
                - link "Bảng giá" [ref=e221] [cursor=pointer]:
                  - /url: "#pricing"
              - listitem [ref=e222]:
                - link "Case studies" [ref=e223] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e224]:
                - link "Documentation" [ref=e225] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e226]:
            - heading "Company" [level=4] [ref=e227]
            - list [ref=e228]:
              - listitem [ref=e229]:
                - link "About us" [ref=e230] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e231]:
                - link "Blog" [ref=e232] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e233]:
                - link "Careers" [ref=e234] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e235]:
                - link "Contact" [ref=e236] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e237]:
            - heading "Legal" [level=4] [ref=e238]
            - list [ref=e239]:
              - listitem [ref=e240]:
                - link "Privacy Policy" [ref=e241] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e242]:
                - link "Terms of Service" [ref=e243] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e244]:
                - link "Security" [ref=e245] [cursor=pointer]:
                  - /url: "#"
        - generic [ref=e246]:
          - paragraph [ref=e247]: © 2026 OpenClaw Cloud. All rights reserved.
          - paragraph [ref=e248]: Made with ❤️ in Vietnam
  - alert [ref=e249]
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
> 35  |     await page.locator('text=Bảng giá').scrollIntoViewIfNeeded();
      |                                         ^ Error: locator.scrollIntoViewIfNeeded: Error: strict mode violation: locator('text=Bảng giá') resolved to 3 elements:
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
```