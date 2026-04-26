import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// This endpoint runs database migration from the web interface
// Avoids SSL certificate issues by running server-side

export async function POST(request: NextRequest) {
  try {
    // Verify this is a setup request (optional security check)
    const body = await request.json()
    const { setupKey } = body

    // Simple security check to prevent unauthorized access
    // In production, you might want to add proper authentication
    const expectedKey = process.env.SETUP_KEY || 'setup-multi-tenant-platform'

    if (setupKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      )
    }

    console.log('🔄 Starting database migration...')

    // Create database connection with SSL configuration
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    // Read and execute init-db.sql
    const fs = await import('fs')
    const path = await import('path')

    const sqlFile = path.join(process.cwd(), '..', 'init-db.sql')
    const initSql = fs.default.readFileSync(sqlFile, 'utf-8')

    console.log('📖 init-db.sql loaded, executing...')

    await pool.query(initSql)
    console.log('✅ Database schema created')

    // Read and execute enable-rls.sql
    const rlsFile = path.join(process.cwd(), 'scripts', 'enable-rls.sql')
    const rlsSql = fs.default.readFileSync(rlsFile, 'utf-8')

    console.log('📖 enable-rls.sql loaded, executing...')

    await pool.query(rlsSql)
    console.log('✅ Row-Level Security enabled')

    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('📋 Tables created:', result.rows.map(r => r.table_name))

    await pool.end()

    return NextResponse.json({
      success: true,
      message: '✅ Database migration completed successfully!',
      data: {
        tables: result.rows.map(r => r.table_name),
        count: result.rows.length
      }
    })

  } catch (error: any) {
    console.error('❌ Migration error:', error)
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error.message,
        hint: 'Make sure DATABASE_URL is set in environment variables'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check migration status
export async function GET(request: NextRequest) {
  try {
    // Check if tables already exist
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    await pool.end()

    const tables = result.rows.map(r => r.table_name)

    return NextResponse.json({
      success: true,
      status: tables.length > 0 ? 'already_migrated' : 'not_migrated',
      message: tables.length > 0
        ? `Database already initialized with ${tables.length} tables`
        : 'Database not initialized yet',
      data: {
        tables,
        count: tables.length,
        expected: ['users', 'tenants', 'tenant_users', 'agents', 'integrations', 'activity_logs']
      }
    })

  } catch (error: any) {
    console.error('Error checking migration status:', error)

    // If connection fails, database not set up
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        status: 'database_not_configured',
        message: 'Database connection failed. Please add DATABASE_URL to environment variables.',
        error: 'Database not configured'
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}