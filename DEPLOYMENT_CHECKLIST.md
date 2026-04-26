# 🚀 Deployment & Production Launch Checklist

**Purpose:** Ensure smooth deployment and production readiness
**Status:** Ready for deployment
**Last Updated:** 2026-04-26

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup ✅ Required

- [ ] **Choose Database Provider:**
  - [ ] Vercel Postgres (Recommended - $0/mo for trial)
  - [ ] Neon (Free tier - good for development)
  - [ ] Supabase (Free tier - includes auth UI)
  - [ ] Self-hosted PostgreSQL

- [ ] **Create Database:**
  - [ ] Sign up for chosen provider
  - [ ] Create new project/database
  - [ ] Choose region (Singapore for Vietnam)
  - [ ] Copy connection string (DATABASE_URL)

**Database Connection String Format:**
```
postgresql://username:password@host:port/database?sslmode=require
```

### 2. Environment Variables ✅ Required

- [ ] **Generate JWT Secret:**
  ```bash
  # Run this command to generate secure secret
  openssl rand -base64 32
  ```

- [ ] **Gather All Environment Variables:**

**For Local (.env.local):**
```bash
# Database
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-generated-jwt-secret

# Gmail OAuth (Already have these)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback

# Email Service (Already have this)
RESEND_API_KEY=re_Tc1XCNyt_2qhV63WCERPG4gfBcj6XtkD3
OWNER_EMAIL=bangdang007112@gmail.com

# App URLs (Local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**For Vercel (Production):**
```bash
# Same as above, but update URLs:
GOOGLE_REDIRECT_URI=https://openclaw-cloud-five.vercel.app/api/gmail/callback
NEXT_PUBLIC_APP_URL=https://openclaw-cloud-five.vercel.app
NEXT_PUBLIC_API_URL=https://openclaw-cloud-five.vercel.app
```

### 3. Database Schema Migration ✅ Required

- [ ] **Run Database Schema:**
  ```bash
  # Option 1: Using psql command line
  psql $DATABASE_URL -f openclaw-cloud/init-db.sql

  # Option 2: Using Vercel Postgres dashboard
  # Go to Storage → Postgres → Query → Paste init-db.sql → Execute

  # Option 3: Using Neon/Supabase SQL editor
  # Paste init-db.sql and run
  ```

- [ ] **Enable Row-Level Security:**
  ```bash
  # Using psql
  psql $DATABASE_URL -f scripts/enable-rls.sql

  # Or run via database dashboard SQL editor
  ```

- [ ] **Verify Schema Created:**
  ```sql
  -- Check tables exist
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;

  -- Should see: users, tenants, tenant_users, agents, integrations, activity_logs, skills, agent_skills, usage_metrics

  -- Check RLS enabled
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('agents', 'integrations', 'activity_logs');
  ```

### 4. Gmail OAuth Setup ✅ Required

- [ ] **Update Redirect URI in Google Cloud Console:**
  1. Go to: https://console.cloud.google.com
  2. Select project: **windy-planet-494507-n9**
  3. APIs & Services → Credentials
  4. Edit OAuth client: **788266067148-2rq154rotjibseaorcqatpg0ge2rjjn1**
  5. Add to **Authorized redirect URIs**:
     ```
     https://openclaw-cloud-five.vercel.app/api/gmail/callback
     ```
  6. Save changes

### 5. Build Verification ✅ Test Locally

- [ ] **Install Dependencies:**
  ```bash
  cd landing
  npm install
  ```

- [ ] **Test Build:**
  ```bash
  npm run build
  ```

- [ ] **Fix Any Build Errors:**
  - [ ] Check TypeScript errors
  - [ ] Check missing dependencies
  - [ ] Verify imports

---

## 🧪 Testing Checklist

### Local Development Testing

#### 1. Start Dev Server ✅
```bash
cd landing
npm run dev
```

#### 2. Test Authentication ✅
- [ ] **Register New User:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "test123456",
      "fullName": "Test User"
    }'
  ```
  Expected: User created, token returned

- [ ] **Login:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "test123456"
    }'
  ```
  Expected: Token returned, user data included

#### 3. Test Tenant Management ✅
- [ ] **Create Tenant (requires admin token):**
  ```bash
  curl -X POST http://localhost:3000/api/admin/tenants \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "businessName": "Test Business",
      "tier": "trial",
      "adminEmail": "test@example.com"
    }'
  ```
  Expected: Tenant created

- [ ] **List Tenants:**
  ```bash
  curl http://localhost:3000/api/admin/tenants \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```
  Expected: Array of tenants returned

#### 4. Test UI ✅
- [ ] **Visit Admin Dashboard:**
  - Navigate to: http://localhost:3000/admin
  - Expected: Dashboard loads, shows stats

- [ ] **Visit Tenant List:**
  - Navigate to: http://localhost:3000/admin/tenants
  - Expected: Tenant list table displayed

- [ ] **Create Tenant via UI:**
  - Navigate to: http://localhost:3000/admin/tenants/new
  - Fill out form
  - Expected: Tenant created, redirected to detail page

#### 5. Test Trial Signup ✅
- [ ] **Visit Trial Signup:**
  - Navigate to: http://localhost:3000/trial/signup
  - Complete 3-step form
  - Expected: Tenant + user created

---

## 🚀 Production Deployment

### 1. Push to GitHub ✅

- [ ] **Commit All Changes:**
  ```bash
  git add .
  git status
  ```

- [ ] **Create Commit:**
  ```bash
  git commit -m "feat: complete multi-tenant SaaS platform

  - Phase 1: Database & authentication foundation
  - Phase 2: Tenant management backend API
  - Phase 3: Admin dashboard UI
  - Phase 4: Tenant isolation with RLS
  - Phase 5: Per-Tenant Gmail OAuth
  - Phase 6: Onboarding flows
  - Phase 7: Production hardening

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  ```

- [ ] **Push to GitHub:**
  ```bash
  git push origin main
  ```

### 2. Deploy to Vercel ✅

- [ ] **Add Environment Variables in Vercel:**
  1. Go to: https://vercel.com/dashboard
  2. Select project: **openclaw-cloud-five**
  3. Settings → Environment Variables
  4. Add/update:
     - `DATABASE_URL` = Your PostgreSQL connection string
     - `JWT_SECRET` = Your generated secret
     - `GOOGLE_REDIRECT_URI` = https://openclaw-cloud-five.vercel.app/api/gmail/callback
     - `NEXT_PUBLIC_APP_URL` = https://openclaw-cloud-five.vercel.app
     - `NEXT_PUBLIC_API_URL` = https://openclaw-cloud-five.vercel.app
  5. Keep existing variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, RESEND_API_KEY, OWNER_EMAIL)

- [ ] **Deploy:**
  - Vercel will auto-deploy when you push to GitHub
  - Monitor deployment in Vercel dashboard

### 3. Production Testing ✅

- [ ] **Test Production URLs:**
  - Landing page: https://openclaw-cloud-five.vercel.app
  - Admin dashboard: https://openclaw-cloud-five.vercel.app/admin
  - Trial signup: https://openclaw-cloud-five.vercel.app/trial/signup

- [ ] **Test Authentication in Production:**
  ```bash
  curl -X POST https://openclaw-cloud-five.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "your-email@example.com",
      "password": "your-password"
    }'
  ```

- [ ] **Test Tenant Creation:**
  - Login to admin dashboard
  - Create a test tenant
  - Verify it appears in tenant list

- [ ] **Test Gmail OAuth:**
  - Go to /api/gmail/auth with valid JWT
  - Grant permissions
  - Verify token stored in database

---

## ✅ Pre-Launch Verification

### 1. Functionality Check

- [ ] **User can register**
- [ ] **User can login**
- [ ] **Admin can create tenant**
- [ ] **Admin can view tenant list**
- [ ] **Admin can edit tenant**
- [ ] **Admin can suspend tenant**
- [ ] **Admin can add users to tenant**
- [ ] **Trial signup creates tenant**
- [ ] **Gmail OAuth works**
- [ ] **Data isolation verified**

### 2. Security Check

- [ ] **Passwords hashed in database**
- [ ] **JWT tokens expire after 7 days**
- [ ] **RLS policies enabled**
- [ ] **SQL injection prevention works**
- [ ] **CSRF protection enabled**
- [ ] **Input validation works**

### 3. Performance Check

- [ ] **Page load time < 3 seconds**
- [ ] **API response time < 500ms**
- [ ] **Database queries optimized**
- [ ] **Indexes created on all foreign keys**
- [ ] **Connection pooling configured**

### 4. Documentation Check

- [ ] **API documentation available**
- [ ] **Setup guide complete**
- [ ] **Troubleshooting guide exists**
- [ ] **Deployment guide written**

---

## 🎯 Launch Checklist

### 1. Marketing Materials

- [ ] **Update landing page** with new capabilities
- [ ] **Create demo video** of admin platform
- [ ] **Prepare pitch deck** for potential customers
- [ ] **Write blog post** about launch
- [ ] **Setup social media** announcements

### 2. Customer Communication

- [ ] **Prepare welcome email** template
- [ ] **Setup onboarding email sequence**
- [ ] **Create user documentation**
- [ ] **Prepare FAQ**
- [ ] **Setup support channel** (email/form)

### 3. Monitoring Setup

- [ ] **Vercel Analytics** enabled
- [ ] **Error tracking** (Sentry or similar)
- [ ] **Uptime monitoring** (Pingdom/UptimeRobot)
- [ ] **Database monitoring** (provider's dashboard)
- [ ] **Alert configuration**

---

## 📊 Success Metrics

### Day 1 Targets
- [ ] Platform deployed and accessible
- [ ] Can create 10+ test tenants
- [ ] All features working
- [ ] Zero critical bugs

### Week 1 Targets
- [ ] 5-10 real signups
- [ ] Collect user feedback
- [ ] Fix any bugs found
- [ ] Iterate on features

### Month 1 Targets
- [ ] 20-50 active tenants
- [ ] Convert 5+ to paid
- [ ] Gather testimonials
- [ ] Refine marketing message

---

## 🆘 Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Check TypeScript errors
npm run lint

# Check for missing dependencies
npm audit

# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: Database Connection Fails

**Solution:**
- Verify DATABASE_URL is correct
- Check SSL mode: `?sslmode=require`
- Test with psql: `psql $DATABASE_URL`
- Check firewall rules

### Issue: Gmail OAuth Fails

**Solution:**
- Verify redirect URI matches exactly
- Check Google Cloud Console
- Ensure OAuth client is not restricted
- Try incognito mode

### Issue: RLS Blocks All Queries

**Solution:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables;

-- Set tenant context
SELECT set_tenant_context('user-uuid');

-- Verify user has tenant memberships
SELECT * FROM tenant_users WHERE user_id = 'user-uuid';
```

---

## 📞 Support Resources

### Documentation
- Phase 1: Database & Auth Guide
- Phase 2 & 3: API & Admin UI Guide
- Phase 4: Tenant Isolation Guide
- Phase 5: Gmail OAuth Guide
- Master: Platform Complete Guide

### External Resources
- Vercel Docs: https://vercel.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs
- Next.js Docs: https://nextjs.org/docs
- Gmail API Docs: https://developers.google.com/gmail

### Getting Help
- GitHub Issues: Create issue in repository
- Vercel Support: https://vercel.com/support
- Community: Discord/Slack channels

---

## ✨ Ready to Launch!

**Checklist Completion:**
- [ ] All pre-deployment items complete
- [ ] All tests passing
- [ ] Production deployed
- [ ] All production tests passing
- [ ] Marketing materials ready
- [ ] Monitoring configured

**When all items checked:**
🚀 **YOU ARE READY TO LAUNCH!**

---

**Last Updated:** 2026-04-26
**Version:** 1.0.0
**Status:** Production Ready

**Good luck with the launch! 🎉**
