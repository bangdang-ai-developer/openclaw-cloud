# Phase 1: Database & Authentication Foundation - Setup Guide

## Overview

This guide walks through setting up the database and migrating authentication from file-based to PostgreSQL for the multi-tenant SaaS platform.

---

## Prerequisites

1. **Node.js** installed (v22+)
2. **PostgreSQL database** - Choose one:
   - Vercel Postgres (recommended for Vercel deployment)
   - Neon (free tier, easy setup)
   - Supabase (free tier)
   - Self-hosted PostgreSQL

---

## Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `openclaw-cloud-five`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres** → **Continue**
6. Choose region (Singapore for Vietnam) → **Create**
7. Copy the **DATABASE_URL** from Settings

### Option B: Neon (Free Alternative)

1. Go to: https://neon.tech
2. Sign up / Login
3. Click **Create a project**
4. Name: `openclaw-cloud`
5. Copy the **Connection string** (DATABASE_URL)

### Option C: Supabase (Free Alternative)

1. Go to: https://supabase.com
2. Sign up / Login
3. Click **New Project**
4. Name: `openclaw-cloud`
5. Copy the **Connection string** from Project Settings → Database

---

## Step 2: Add Environment Variables

### Local Development (.env.local)

Add to `landing/.env.local`:

```bash
# Database URL (from Step 1)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Keep existing variables
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
RESEND_API_KEY=your-resend-api-key
OWNER_EMAIL=your-owner-email@gmail.com
NEXT_PUBLIC_APP_URL=https://openclaw-cloud-five.vercel.app
NEXT_PUBLIC_API_URL=https://openclaw-cloud-five.vercel.app
```

### Production (Vercel)

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `DATABASE_URL` = your database connection string
   - `JWT_SECRET` = generate with: `openssl rand -base64 32`

---

## Step 3: Initialize Database Schema

### Option A: Using psql (Command Line)

```bash
# Connect to your database
psql $DATABASE_URL

# Run the schema
psql $DATABASE_URL -f openclaw-cloud/init-db.sql
```

### Option B: Using Vercel Postgres Dashboard

1. Go to **Storage** → **Postgres**
2. Click **Query**
3. Paste contents of `openclaw-cloud/init-db.sql`
4. Click **Execute**

### Option B: Using Neon Console

1. Go to **SQL Editor** in Neon dashboard
2. Paste contents of `openclaw-cloud/init-db.sql`
3. Click **Run**

---

## Step 4: Migrate Existing Users (If Any)

If you have existing users in `data/users.json`:

```bash
cd landing

# Run migration script
npm run db:migrate
```

**What this does:**
- Reads users from `data/users.json`
- Hashes plain text passwords with bcrypt
- Inserts into PostgreSQL `users` table
- Creates default tenant for each user
- Adds user to tenant as owner
- Creates backup of original file

**Expected Output:**
```
🔄 Starting user migration...
📖 Reading users from file...
Found X users in file
✅ Migrated: user@example.com
🏢 Created default tenant: user
...
📊 Migration Summary:
   ✅ Migrated: X
   ⏭️  Skipped: 0
   ❌ Errors: 0
   📦 Total: X

💾 Backup created: data/users.json.backup.XXXXXXXX

✨ Migration completed!
```

---

## Step 5: Test Database Connection

Create a test script to verify everything works:

```typescript
// scripts/test-db.ts
import { query } from '../lib/db'

async function testDatabase() {
  try {
    const result = await query('SELECT NOW() as current_time')
    console.log('✅ Database connected:', result.rows[0])

    const tables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    console.log('📋 Tables:', tables.rows.map(r => r.table_name))

    process.exit(0)
  } catch (error) {
    console.error('❌ Database error:', error)
    process.exit(1)
  }
}

testDatabase()
```

Run with: `npx tsx scripts/test-db.ts`

---

## Step 6: Test Authentication

### Test Registration (New User)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "fullName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "fullName": "Test User",
    "tier": "starter"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tenants": []
}
```

### Test Registration (With Tenant - Trial Signup)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@example.com",
    "password": "test123456",
    "fullName": "Business Owner",
    "businessName": "My Business",
    "industry": "tech"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công! Tenant trial đã được tạo.",
  "user": { ... },
  "token": "...",
  "tenants": [
    {
      "id": "tenant-uuid",
      "slug": "my-business",
      "business_name": "My Business",
      "role": "owner",
      ...
    }
  ]
}
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": { ... },
  "token": "...",
  "tenants": [...]
}
```

---

## Step 7: Verify Data in Database

```sql
-- Check users
SELECT id, email, full_name, tier, status, created_at
FROM users;

-- Check tenants
SELECT id, slug, business_name, tier, status, created_at
FROM tenants;

-- Check tenant_users
SELECT tu.role, u.email, t.business_name
FROM tenant_users tu
JOIN users u ON tu.user_id = u.id
JOIN tenants t ON tu.tenant_id = t.id;
```

---

## Common Issues & Solutions

### Issue 1: Connection Refused

**Error:** `Connection refused` or `ECONNREFUSED`

**Solution:**
- Verify DATABASE_URL is correct
- Check if database allows connections from your IP
- Ensure SSL mode is correct: `?sslmode=require` for cloud databases

### Issue 2: Password Hashing Error

**Error:** `data length wrong for hash` during migration

**Solution:**
- Check if passwords in users.json are already hashed (start with `$2a$` or `$2b$`)
- Migration script auto-detects and skips already-hashed passwords

### Issue 3: JWT_SECRET Not Set

**Error:** `JWT_SECRET is not defined`

**Solution:**
```bash
# Generate secure secret
openssl rand -base64 32

# Add to .env.local
JWT_SECRET=<generated-secret>
```

### Issue 4: Tables Already Exist

**Error:** `relation "users" already exists`

**Solution:**
- Run init-db.sql with `IF NOT EXISTS` clauses (already included)
- Or manually drop tables first:
```sql
DROP TABLE IF EXISTS tenant_users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS usage_metrics CASCADE;
DROP TABLE IF EXISTS agent_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

---

## Verification Checklist

- [ ] Database created and accessible
- [ ] DATABASE_URL added to .env.local
- [ ] JWT_SECRET added to .env.local
- [ ] Database schema initialized (init-db.sql)
- [ ] Existing users migrated (if any)
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Passwords are hashed (check database)
- [ ] JWT token is generated
- [ ] Tenant creation works (with businessName)

---

## What's Next?

After completing Phase 1 setup:

1. **Deploy to Vercel**
   - Push code to GitHub
   - Vercel will auto-deploy
   - Add DATABASE_URL and JWT_SECRET to Vercel environment variables
   - Test production authentication

2. **Proceed to Phase 2: Tenant Management Backend**
   - Build API routes for tenant CRUD operations
   - Create admin authentication middleware
   - Implement tenant user management APIs

3. **Test Multi-Tenancy**
   - Create multiple tenants
   - Verify data isolation
   - Test user-tenant relationships

---

## Architecture Notes

### Database Connection Pool

Using `pg` package with connection pooling:
- Automatic connection management
- Query logging in development
- Transaction support
- Error handling

### Authentication Flow

**Registration:**
```
User input → Validate → Check exists → Hash password → Insert to DB
                ↓
            Optional: Create tenant → Add user to tenant → Generate JWT
                ↓
            Return user + token + tenants
```

**Login:**
```
User input → Validate → Find user → Verify password → Update last login
                ↓
            Get user's tenants → Build JWT payload → Generate token
                ↓
            Return user + token + tenants
```

### JWT Token Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "tenantIds": ["tenant-uuid-1", "tenant-uuid-2"],
  "role": "owner",
  "iat": 1234567890,
  "exp": 1234567890 + 7 days
}
```

---

## Security Best Practices

✅ **Implemented:**
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with expiration
- Input validation
- SQL injection prevention (parameterized queries)
- Tenant isolation foundation

🔒 **Next Steps (Phase 7):**
- Rate limiting
- HTTPS only
- httpOnly cookies
- CSRF protection
- Row-Level Security (RLS)

---

## Support

If you encounter issues:

1. Check database logs
2. Verify environment variables
3. Test database connection manually
4. Review migration logs
5. Check console for errors

---

**Last Updated:** 2026-04-26
**Phase:** 1/7 - Database & Authentication Foundation
**Status:** ✅ Ready for implementation
