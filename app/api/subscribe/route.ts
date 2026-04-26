import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Simple file-based fallback for development
const fs = require('fs').promises
const path = require('path')

const WAITLIST_FILE = path.join(process.cwd(), 'waitlist.json')

// Initialize waitlist file
async function initWaitlistFile() {
  try {
    await fs.access(WAITLIST_FILE)
  } catch {
    await fs.writeFile(WAITLIST_FILE, JSON.stringify([]))
  }
}

// Read waitlist from file
async function readWaitlist() {
  await initWaitlistFile()
  const data = await fs.readFile(WAITLIST_FILE, 'utf-8')
  return JSON.parse(data)
}

// Write waitlist to file
async function writeWaitlist(waitlist: any[]) {
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(waitlist, null, 2))
}

// Add email to waitlist
async function addToWaitlist(email: string, fullName: string, companyName: string, tierInterest: string) {
  const waitlist = await readWaitlist()

  // Check if email already exists
  if (waitlist.some((item: any) => item.email === email)) {
    return { exists: true }
  }

  // Add new subscriber
  const newSubscriber = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    fullName,
    companyName,
    tierInterest,
    source: 'landing_page',
    status: 'active',
    createdAt: new Date().toISOString(),
    metadata: {
      userAgent: 'api',
      ip: 'unknown',
      referrer: 'direct'
    }
  }

  waitlist.push(newSubscriber)
  await writeWaitlist(waitlist)

  return { exists: false, subscriber: newSubscriber }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, companyName, tierInterest } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Add to waitlist
    const result = await addToWaitlist(email, fullName || '', companyName || '', tierInterest || '')

    if (result.exists) {
      return NextResponse.json({
        success: true,
        message: 'Bạn đã đăng ký trước đó rồi!',
        isNew: false
      })
    }

    return NextResponse.json({
      success: true,
      message: '🎉 Chúc mừng! Bạn đã được thêm vào danh sách chờ. Chúng tôi sẽ liên hệ sớm!',
      isNew: true
    })
  } catch (error: any) {
    console.error('Error subscribing email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      // Return all waitlist (for admin)
      const waitlist = await readWaitlist()
      return NextResponse.json({
        success: true,
        count: waitlist.length,
        data: waitlist
      })
    }

    // Find specific email
    const waitlist = await readWaitlist()
    const subscriber = waitlist.find((item: any) => item.email === email.toLowerCase())

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: subscriber
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
