const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://postgres.qswngadupfdpyvntlccg:mvbyCysNeBANWSRZ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: false
  }
})

async function runMigration() {
  console.log('🔄 Starting database migration...')

  try {
    // Read the SQL file
    const fs = require('fs')
    const path = require('path')

    const sqlFile = path.join(process.cwd(), '..', 'init-db.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    console.log('📖 SQL file loaded')

    // Execute SQL
    await pool.query(sql)
    console.log('✅ Database schema created successfully')

    // Verify tables
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('📋 Tables created:', result.rows.map(r => r.table_name))
    console.log('\n✨ Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigration()
