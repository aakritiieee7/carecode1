import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { moodEntrySchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const body = await request.json()

    // Validate input
    const validation = moodEntrySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { moodScore, notes, location } = validation.data

    // Create mood entry
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: user.id,
        moodScore,
        notes,
        location
      },
      select: {
        id: true,
        moodScore: true,
        notes: true,
        location: true,
        timestamp: true
      }
    })

    return NextResponse.json({
      message: 'Mood entry created successfully',
      moodEntry
    }, { status: 201 })

  } catch (error) {
    console.error('Create mood entry error:', error)
    if (error instanceof Error && error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Get query parameters for pagination
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get user's mood entries
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        moodScore: true,
        notes: true,
        location: true,
        timestamp: true
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.moodEntry.count({
      where: { userId: user.id }
    })

    return NextResponse.json({
      moodEntries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Get mood entries error:', error)
    if (error instanceof Error && error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}