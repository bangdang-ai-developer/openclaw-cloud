# 🗄️ Supabase Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select project: **qswngadupfdpyvntlccg**
3. Click **SQL Editor** in left sidebar

### Step 2: Run Database Schema

1. Click **New Query**
2. Copy the entire contents of `openclaw-cloud/init-db.sql`
3. Paste into SQL Editor
4. Click **RUN** (or Ctrl+Enter)

**Expected Output:**
```
Success
```

You should see these tables created:
- users
- tenants
- tenant_users
- agents
- integrations
- activity_logs
- usage_metrics
- skills
- agent_skills

### Step 3: Enable Row-Level Security

1. Click **New Query** again
2. Copy the contents of `scripts/enable-rls.sql`
3. Paste into SQL Editor
4. Click **RUN**

**Expected Output:**
```
Success
```

### Step 4: Verify Tables Created

Run this query to verify:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Should see all 9 tables.**

---

## 📝 Add Environment Variables to Vercel

### Step 1: Go to Vercel

1. Visit: https://vercel.com/dashboard
2. Select project: **openclaw-cloud-five**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Click **Add New** and add each:

```bash
# Database
DATABASE_URL=postgres://postgres.qswngadupfdpyvntlccg:mvbyCysNeBANWSRZ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_URL=postgres://postgres.qswngadupfdpyvntlccg:mvbyCysNeBANWSRZ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x

# JWT Secret
JWT_SECRET=9kAPHwmHgh6a77wclNzgJxzTYUrt/umjWm1bYg63JPtzfeHSlMchlPiecTgIWIIRzSJik/0agNW1OKBIZcKfXA==

# App URLs
NEXT_PUBLIC_APP_URL=https://openclaw-cloud-five.vercel.app
NEXT_PUBLIC_API_URL=https://openclaw-cloud-five.vercel.app
```

**Keep existing variables:**
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- RESEND_API_KEY
- OWNER_EMAIL

### Step 3: Redeploy

After adding environment variables:
- Vercel will automatically redeploy
- Or click **Deployments** → **Redeploy**

---

## 🧪 Test Database Connection

After environment variables added and redeployed:

### Test 1: Check API Health
```bash
curl https://openclaw-cloud-five.vercel.app/api/subscribe
```
Should return: `{"success": true, "system": "Resend Email Service", ...}`

### Test 2: Register User
```bash
curl -X POST https://openclaw-cloud-five.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "fullName": "Test User"
  }'
```

Should return: User created successfully

### Test 3: Login
```bash
curl -X POST https://openclaw-cloud-five.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

Should return: JWT token with tenant info

---

## 🐛 Troubleshooting

### Issue: "relation does not exist"

**Solution:** Database schema not initialized
- Run init-db.sql in Supabase SQL Editor (see Step 2)

### Issue: "Failed to fetch"

**Solution:** Environment variables not added to Vercel
- Add DATABASE_URL to Vercel environment variables
- Redeploy application

### Issue: "Invalid JWT"

**Solution:** JWT_SECRET not set or changed
- Add JWT_SECRET to Vercel environment variables
- Redeploy application

### Issue: "SSL certificate error"

**Solution:** Using SQL Editor avoids this completely
- No need to use command line
- SQL Editor handles SSL properly

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Supabase SQL Editor shows all 9 tables
- [ ] DATABASE_URL added to Vercel
- [ ] JWT_SECRET added to Vercel
- [ ] App redeployed successfully
- [ ] Can register new user
- [ ] Can login with JWT
- [ ] Tenant creation works
- [ ] Trial signup works

---

## 🎯 Next Steps

Once database is verified working:

1. **Test Trial Signup:**
   - Visit: https://openclaw-cloud-five.vercel.app/trial/signup
   - Complete 3-step form
   - Verify tenant created in database

2. **Test Admin Dashboard:**
   - Visit: https://openclaw-cloud-five.vercel.app/admin
   - Create test tenant
   - Verify it appears in list

3. **Test Gmail OAuth:**
   - Visit: https://openclaw-cloud-five.vercel.app/api/gmail/auth
   - Should redirect to Google consent screen
   - After callback, check integrations table

---

## 🚀 Ready for Production!

Once all verification passes, you are **READY TO LAUNCH!**

The multi-tenant SaaS platform is fully functional with:
- ✅ Database-backed authentication
- ✅ JWT tokens with bcrypt
- ✅ Multi-tenant data isolation
- ✅ Admin dashboard
- ✅ Self-service trial signup
- ✅ Per-tenant Gmail OAuth

**START MARKETING!** 🎯
