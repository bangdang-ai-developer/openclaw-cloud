# Admin User Creation - Known Issue & Workaround

## Issue Description

When creating a tenant via Admin Dashboard or API, the automatic admin user assignment may fail.

## Error Message

```json
{
  "error": "Admin user not found",
  "message": "Tenant created but no admin user assigned",
  "tenant": {...}
}
```

## Workaround (Manual Process)

### Option 1: Create User First, Then Create Tenant

1. **Create admin user via trial signup:**
   ```bash
   POST /api/auth/register
   {
     "email": "admin@business.com",
     "password": "securepass123",
     "fullName": "Admin Name"
   }
   ```

2. **Create tenant and assign existing user:**
   ```bash
   POST /api/admin/tenants
   {
     "businessName": "Business Name",
     "industry": "Technology",
     "contactEmail": "admin@business.com",
     "tier": "professional",
     "adminEmail": "admin@business.com"  // Existing user
   }
   ```

### Option 2: Create User Separately via Admin API

1. **Create tenant:**
   ```bash
   POST /api/admin/tenants
   {
     "businessName": "Business Name",
     "industry": "Technology"
   }
   ```

2. **Create admin user:**
   ```bash
   POST /api/auth/register
   {
     "email": "admin@business.com",
     "password": "securepass123",
     "fullName": "Admin Name"
   }
   ```

3. **Add user to tenant:**
   ```bash
   POST /api/admin/tenants/{tenantId}/users
   {
     "userId": "{userId from step 2}",
     "role": "owner"
   }
   ```

## Fixed Version

A fix has been deployed (commit: 4fceae4) that:
- Automatically creates admin user if it doesn't exist
- Requires `adminFullName` and `adminPassword` parameters
- Provides detailed logging for debugging
- Handles errors gracefully

### Updated API Usage

```bash
POST /api/admin/tenants
{
  "businessName": "Business Name",
  "slug": "business-name",  // optional
  "industry": "Technology",
  "contactEmail": "admin@business.com",
  "contactPhone": "+1234567890",  // optional
  "tier": "professional",
  "adminEmail": "admin@business.com",
  "adminFullName": "Admin Name",  // REQUIRED for new users
  "adminPassword": "securepass123"  // REQUIRED for new users
}
```

## Status

- ✅ **Fix Deployed:** Commit 4fceae4
- ✅ **Performance Indexes Added:** Database queries optimized
- ⏳ **Vercel Deploying:** Changes will be live in ~2-3 minutes

## Verification

After deployment, test with:

```bash
# Test 1: Create tenant with new admin user
curl -X POST https://openclaw-cloud-five.vercel.app/api/admin/tenants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Business",
    "adminEmail": "test-admin@example.com",
    "adminFullName": "Test Admin",
    "adminPassword": "testpass123"
  }'

# Expected: Success with user + tenant created
```

## Related Files

- `app/api/admin/tenants/route.ts` - Main fix location
- `lib/auth.ts` - registerUser function
- `lib/tenant.ts` - addUserToTenant function
