import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { connectionRequestSchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const body = await request.json()

    // Only students can request connections
    if (user.userType !== 'student') {
      return NextResponse.json(
        { error: 'Only students can request mentor connections' },
        { status: 403 }
      )
    }

    // Validate input
    const validation = connectionRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { mentorId } = validation.data

    // Check if mentor exists and is available
    const mentor = await prisma.user.findFirst({
      where: {
        id: mentorId,
        userType: 'mentor',
        isActive: true
      },
      include: {
        mentorProfile: true
      }
    })

    if (!mentor || !mentor.mentorProfile) {
      return NextResponse.json(
        { error: 'Mentor not found or not available' },
        { status: 404 }
      )
    }

    if (!mentor.mentorProfile.isAvailable) {
      return NextResponse.json(
        { error: 'Mentor is currently not accepting new connections' },
        { status: 400 }
      )
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        studentId: user.id,
        mentorId: mentorId
      }
    })

    if (existingConnection) {
      return NextResponse.json(
        { 
          error: 'Connection already exists', 
          status: existingConnection.status,
          connectionId: existingConnection.id
        },
        { status: 409 }
      )
    }

    // Create connection request
    const connection = await prisma.connection.create({
      data: {
        studentId: user.id,
        mentorId: mentorId,
        status: 'pending'
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        mentor: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Connection request sent successfully',
      connection: connection
    }, { status: 201 })

  } catch (error) {
    console.error('Create connection request error:', error)
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
    
    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where clause based on user type
    let whereClause: any
    if (user.userType === 'student') {
      whereClause = { studentId: user.id }
    } else if (user.userType === 'mentor') {
      whereClause = { mentorId: user.id }
    } else {
      // Admin can see all connections
      whereClause = {}
    }

    if (status) {
      whereClause.status = status
    }

    // Get connections
    const connections = await prisma.connection.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            anonymityLevel: true
          }
        },
        mentor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            anonymityLevel: true,
            mentorProfile: {
              select: {
                department: true,
                year: true,
                specialties: true,
                rating: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.connection.count({
      where: whereClause
    })

    // Apply anonymity filtering
    const sanitizedConnections = connections.map(conn => ({
      id: conn.id,
      status: conn.status,
      createdAt: conn.createdAt,
      updatedAt: conn.updatedAt,
      student: {
        id: conn.student.id,
        fullName: conn.student.anonymityLevel > 70 ? 'Anonymous Student' : conn.student.fullName,
        email: conn.student.anonymityLevel < 30 ? conn.student.email : null,
        anonymityLevel: conn.student.anonymityLevel
      },
      mentor: {
        id: conn.mentor.id,
        fullName: conn.mentor.anonymityLevel > 70 ? 'Anonymous Mentor' : conn.mentor.fullName,
        email: conn.mentor.anonymityLevel < 30 ? conn.mentor.email : null,
        anonymityLevel: conn.mentor.anonymityLevel,
        mentorProfile: conn.mentor.mentorProfile
      }
    }))

    return NextResponse.json({
      connections: sanitizedConnections,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Get connections error:', error)
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