import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import {
  findTenantById,
  getTenantUsers,
  addUserToTenant,
  removeUserFromTenant,
  updateTenantUserRole
} from '@/lib/tenant'
import { findUserByEmail } from '@/lib/auth'

// GET /api/admin/tenants/[id]/users - List tenant users (admin only)
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

    // Check if tenant exists
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
      data: users,
      meta: {
        tenantId,
        tenantName: tenant.business_name,
        total: users.length
      }
    })
  } catch (error: any) {
    console.error('List tenant users error:', error)
    return NextResponse.json(
      { error: 'Failed to list tenant users' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tenants/[id]/users - Add user to tenant (admin only)
export async function POST(
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
    const { email, role } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if tenant exists
    const tenant = await findTenantById(tenantId)
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please ask the user to register first.' },
        { status: 404 }
      )
    }

    // Add user to tenant
    const tenantUser = await addUserToTenant(
      tenantId,
      user.id,
      role || 'member'
    )

    // Get updated user list
    const users = await getTenantUsers(tenantId)

    return NextResponse.json({
      success: true,
      message: 'User added to tenant successfully',
      data: {
        tenantUser,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name
        }
      },
      users
    }, { status: 201 })
  } catch (error: any) {
    console.error('Add user to tenant error:', error)

    // Handle unique constraint violation (user already in tenant)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'User is already a member of this tenant' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add user to tenant' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/tenants/[id]/users - Update user role in tenant (admin only)
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
    const { userId, role } = body

    // Validation
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      )
    }

    if (!['owner', 'admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be owner, admin, or member' },
        { status: 400 }
      )
    }

    // Update user role
    const updated = await updateTenantUserRole(tenantId, userId, role)

    if (!updated) {
      return NextResponse.json(
        { error: 'User not found in this tenant' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      data: updated
    })
  } catch (error: any) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}
