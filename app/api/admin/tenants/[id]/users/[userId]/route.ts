import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import { findTenantById, removeUserFromTenant } from '@/lib/tenant'

// DELETE /api/admin/tenants/[id]/users/[userId] - Remove user from tenant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    // Verify admin access
    const authResult = await withAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id: tenantId, userId } = await params

    // Check if tenant exists
    const tenant = await findTenantById(tenantId)
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Remove user from tenant
    const removed = await removeUserFromTenant(tenantId, userId)

    if (!removed) {
      return NextResponse.json(
        { error: 'User not found in this tenant or already removed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User removed from tenant successfully'
    })
  } catch (error: any) {
    console.error('Remove user from tenant error:', error)
    return NextResponse.json(
      { error: 'Failed to remove user from tenant' },
      { status: 500 }
    )
  }
}
