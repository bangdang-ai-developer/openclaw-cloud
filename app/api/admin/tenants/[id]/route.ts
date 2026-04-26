import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import {
  findTenantById,
  updateTenant,
  deleteTenant,
  suspendTenant,
  getTenantUsers
} from '@/lib/tenant'

// GET /api/admin/tenants/[id] - Get tenant details (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const authResult = await withAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id: tenantId } = await params

    // Get tenant
    const tenant = await findTenantById(tenantId)

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Get tenant users
    const users = await getTenantUsers(tenantId)

    return NextResponse.json({
      success: true,
      data: {
        ...tenant,
        users
      }
    })
  } catch (error: any) {
    console.error('Get tenant error:', error)
    return NextResponse.json(
      { error: 'Failed to get tenant' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/tenants/[id] - Update tenant (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const authResult = await withAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id: tenantId } = await params
    const body = await request.json()

    // Check if tenant exists
    const existing = await findTenantById(tenantId)
    if (!existing) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Update tenant
    const updated = await updateTenant(tenantId, {
      business_name: body.businessName,
      logo_url: body.logoUrl,
      industry: body.industry,
      contact_email: body.contactEmail,
      contact_phone: body.contactPhone,
      tier: body.tier,
      status: body.status,
      trial_ends_at: body.trialEndsAt,
      settings: body.settings
    })

    return NextResponse.json({
      success: true,
      message: 'Tenant updated successfully',
      data: updated
    })
  } catch (error: any) {
    console.error('Update tenant error:', error)
    return NextResponse.json(
      { error: 'Failed to update tenant' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tenants/[id] - Delete or suspend tenant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const authResult = await withAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id: tenantId } = await params

    // Check if tenant exists
    const existing = await findTenantById(tenantId)
    if (!existing) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Check query parameter for soft delete vs hard delete
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'suspend'

    if (action === 'suspend') {
      // Soft delete - just suspend
      const suspended = await suspendTenant(tenantId)
      return NextResponse.json({
        success: true,
        message: 'Tenant suspended successfully',
        data: suspended
      })
    } else if (action === 'delete') {
      // Hard delete - permanently delete
      await deleteTenant(tenantId)
      return NextResponse.json({
        success: true,
        message: 'Tenant deleted permanently'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "suspend" or "delete"' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Delete tenant error:', error)
    return NextResponse.json(
      { error: 'Failed to delete tenant' },
      { status: 500 }
    )
  }
}
