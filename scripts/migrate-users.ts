import { promises as fs } from 'fs'
import path from 'path'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function migrateUsers() {
  console.log('🔄 Starting user migration...')

  try {
    // Read existing users from file
    console.log('📖 Reading users from file...')
    const fileData = await fs.readFile(USERS_FILE, 'utf-8')
    const fileUsers = JSON.parse(fileData)

    console.log(`Found ${fileUsers.length} users in file`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const fileUser of fileUsers) {
      try {
        // Check if user already exists in database
        const existingResult = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [fileUser.email.toLowerCase()]
        )

        if (existingResult.rows.length > 0) {
          console.log(`⏭️  Skipping existing user: ${fileUser.email}`)
          skipped++
          continue
        }

        // Hash password if it's plain text
        let passwordHash = fileUser.password_hash
        if (!fileUser.password_hash.startsWith('$2a$') && !fileUser.password_hash.startsWith('$2b$')) {
          console.log(`🔐 Hashing password for: ${fileUser.email}`)
          passwordHash = await bcrypt.hash(fileUser.password_hash, 12)
        }

        // Insert user into database
        await pool.query(
          `INSERT INTO users (id, email, password_hash, full_name, phone, tier, status, created_at, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            fileUser.id,
            fileUser.email.toLowerCase(),
            passwordHash,
            fileUser.full_name || null,
            fileUser.phone || null,
            fileUser.tier || 'starter',
            fileUser.status || 'active',
            fileUser.created_at || new Date(),
            fileUser.last_login_at || null
          ]
        )

        console.log(`✅ Migrated: ${fileUser.email}`)
        migrated++

        // Create default tenant for user
        const tenantSlug = fileUser.email.toLowerCase().split('@')[0]
        const tenantResult = await pool.query(
          `INSERT INTO tenants (slug, business_name, contact_email, tier, status)
           VALUES ($1, $2, $3, $4, 'active')
           ON CONFLICT (slug) DO NOTHING
           RETURNING id`,
          [
            tenantSlug,
            `${fileUser.full_name || fileUser.email}'s Business`,
            fileUser.email.toLowerCase(),
            'trial'
          ]
        )

        if (tenantResult.rows.length > 0) {
          const tenantId = tenantResult.rows[0].id

          // Add user to tenant as owner
          await pool.query(
            `INSERT INTO tenant_users (tenant_id, user_id, role, status)
             VALUES ($1, $2, 'owner', 'active')`,
            [tenantId, fileUser.id]
          )

          console.log(`🏢 Created default tenant: ${tenantSlug}`)
        }

      } catch (error) {
        console.error(`❌ Error migrating user ${fileUser.email}:`, error)
        errors++
      }
    }

    console.log('\n📊 Migration Summary:')
    console.log(`   ✅ Migrated: ${migrated}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`   📦 Total: ${fileUsers.length}`)

    // Backup file
    const backupFile = USERS_FILE + '.backup.' + Date.now()
    await fs.copyFile(USERS_FILE, backupFile)
    console.log(`\n💾 Backup created: ${backupFile}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

// Run migration
migrateUsers()
  .then(() => {
    console.log('\n✨ Migration completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })
