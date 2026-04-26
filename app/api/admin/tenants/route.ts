import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import {
  listTenants,
  createTenant,
  findTenantBySlug,
  generateSlug,
  addUserToTenant
} from '@/lib/tenant'
import { findUserByEmail } from '@/lib/auth'

// GET /api/admin/tenants - List all tenants (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await withAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || undefined
    const tier = searchParams.get('tier') || undefined
    const search = searchParams.get('search') || undefined

    // List tenants with filters
    const result = await listTenants({
      limit,
      offset,
      status,
      tier,
      search
    })

    return NextResponse.json({
      success: true,
      data: result.tenants,
      pagination: {
        limit,
        offset,
        total: result.total
      }
    })
  } catch (error: any) {
    console.error('List tenants error:', error)
    return NextResponse.json(
      { error: 'Failed to list tenants' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tenants - Create new tenant (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await withAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const {
      businessName,
      slug,
      logoUrl,
      industry,
      contactEmail,
      contactPhone,
      tier,
      adminEmail
    } = body

    // Validation
    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || await generateUniqueSlug(businessName)

    // Check if slug already exists
    const existing = await findTenantBySlug(finalSlug)
    if (existing) {
      return NextResponse.json(
        { error: 'Tenant with this slug already exists' },
        { status: 409 }
      )
    }

    // Create tenant
    const tenant = await createTenant({
      slug: finalSlug,
      business_name: businessName,
      logo_url: logoUrl,
      industry: industry,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      tier: tier || 'trial'
    })

    // Add admin user if email provided
    if (adminEmail) {
      const adminUser = await findUserByEmail(adminEmail)

      if (adminUser) {
        await addUserToTenant(tenant.id, adminUser.id, 'owner')
      } else {
        return NextResponse.json(
          {
            error: 'Admin user not found',
            message: 'Tenant created but no admin user assigned',
            tenant
          },
          { status: 201 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tenant created successfully',
      data: tenant
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create tenant error:', error)

    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Tenant with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    )
  }
}

// Helper function to generate unique slug
async function generateUniqueSlug(baseName: string): Promise<string> {
  let slug = generateSlug(baseName)
  let counter = 1

  while (await findTenantBySlug(slug)) {
    slug = `${generateSlug(baseName)}-${counter}`
    counter++
  }

  return slug
}
