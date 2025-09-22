import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    const { mentorId } = params

    // Get mentor profile with user information
    const mentor = await prisma.mentorProfile.findUnique({
      where: { id: mentorId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            anonymityLevel: true,
            createdAt: true
          }
        }
      }
    })

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      )
    }

    // Check if current user has an existing connection with this mentor
    const existingConnection = await prisma.connection.findFirst({
      where: {
        studentId: user.id,
        mentorId: mentor.userId
      }
    })

    // Apply anonymity filtering
    const anonymityLevel = mentor.user.anonymityLevel
    const sanitizedMentor = {
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
        fullName: anonymityLevel > 70 ? 'Anonymous Mentor' : mentor.user.fullName,
        // Show email only to connected students or if anonymity is very low
        email: (existingConnection?.status === 'accepted' || anonymityLevel < 30) 
          ? mentor.user.email 
          : null,
        anonymityLevel: mentor.user.anonymityLevel,
        createdAt: mentor.user.createdAt
      },
      connectionStatus: existingConnection?.status || null,
      connectionId: existingConnection?.id || null
    }

    // Get some statistics about the mentor (if connection exists or low anonymity)
    if (existingConnection?.status === 'accepted' || anonymityLevel < 50) {
      const connectionStats = await prisma.connection.aggregate({
        where: {
          mentorId: mentor.userId,
          status: 'accepted'
        },
        _count: true
      })

      sanitizedMentor['stats'] = {
        activeConnections: connectionStats._count
      }
    }

    return NextResponse.json({
      mentor: sanitizedMentor
    })

  } catch (error) {
    console.error('Get mentor details error:', error)
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