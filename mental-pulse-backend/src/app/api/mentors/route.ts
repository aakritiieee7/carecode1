import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Get query parameters for filtering
    const url = new URL(request.url)
    const department = url.searchParams.get('department')
    const specialty = url.searchParams.get('specialty')
    const available = url.searchParams.get('available')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build filter conditions
    const whereClause: any = {
      isAvailable: available === 'false' ? false : true // Default to available mentors
    }

    if (department) {
      whereClause.department = {
        contains: department,
        mode: 'insensitive'
      }
    }

    if (specialty) {
      whereClause.specialties = {
        has: specialty
      }
    }

    // Get mentors with user information
    const mentors = await prisma.mentorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            anonymityLevel: true,
            createdAt: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.mentorProfile.count({
      where: whereClause
    })

    // Apply anonymity filtering based on user privacy settings
    const sanitizedMentors = mentors.map(mentor => {
      const anonymityLevel = mentor.user.anonymityLevel
      
      return {
        id: mentor.id,
        department: mentor.department,
        year: mentor.year,
        specialties: mentor.specialties,
        bio: mentor.bio,
        isAvailable: mentor.isAvailable,
        rating: mentor.rating,
        createdAt: mentor.createdAt,
        user: {
          id: mentor.user.id,
          // Show full name only if anonymity level is low
          fullName: anonymityLevel > 70 ? 'Anonymous Mentor' : mentor.user.fullName,
          anonymityLevel: mentor.user.anonymityLevel
        }
      }
    })

    return NextResponse.json({
      mentors: sanitizedMentors,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        department,
        specialty,
        available
      }
    })

  } catch (error) {
    console.error('Get mentors error:', error)
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