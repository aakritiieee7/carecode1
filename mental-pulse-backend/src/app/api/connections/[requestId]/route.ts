import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateConnectionSchema = z.object({
  action: z.enum(['accept', 'reject'], {
    errorMap: () => ({ message: 'Action must be either accept or reject' })
  })
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    const { requestId } = params
    const body = await request.json()

    // Validate input
    const validation = updateConnectionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { action } = validation.data

    // Find the connection request
    const connection = await prisma.connection.findUnique({
      where: { id: requestId },
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

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection request not found' },
        { status: 404 }
      )
    }

    // Only the mentor can accept/reject connection requests
    if (connection.mentorId !== user.id) {
      return NextResponse.json(
        { error: 'Only the mentor can accept or reject connection requests' },
        { status: 403 }
      )
    }

    // Check if connection is still pending
    if (connection.status !== 'pending') {
      return NextResponse.json(
        { error: `Connection request has already been ${connection.status}` },
        { status: 400 }
      )
    }

    // Update connection status
    const newStatus = action === 'accept' ? 'accepted' : 'rejected'
    const updatedConnection = await prisma.connection.update({
      where: { id: requestId },
      data: { 
        status: newStatus,
        updatedAt: new Date()
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
      message: `Connection request ${action}ed successfully`,
      connection: updatedConnection
    })

  } catch (error) {
    console.error('Update connection request error:', error)
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

export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    const { requestId } = params

    // Find the connection
    const connection = await prisma.connection.findUnique({
      where: { id: requestId },
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
      }
    })

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    // Only allow access to the student, mentor, or admin
    if (connection.studentId !== user.id && 
        connection.mentorId !== user.id && 
        user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to view this connection' },
        { status: 403 }
      )
    }

    // Apply anonymity filtering
    const sanitizedConnection = {
      id: connection.id,
      status: connection.status,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
      student: {
        id: connection.student.id,
        fullName: connection.student.anonymityLevel > 70 ? 'Anonymous Student' : connection.student.fullName,
        email: connection.student.anonymityLevel < 30 || connection.status === 'accepted' ? connection.student.email : null,
        anonymityLevel: connection.student.anonymityLevel
      },
      mentor: {
        id: connection.mentor.id,
        fullName: connection.mentor.anonymityLevel > 70 ? 'Anonymous Mentor' : connection.mentor.fullName,
        email: connection.mentor.anonymityLevel < 30 || connection.status === 'accepted' ? connection.mentor.email : null,
        anonymityLevel: connection.mentor.anonymityLevel,
        mentorProfile: connection.mentor.mentorProfile
      }
    }

    return NextResponse.json({
      connection: sanitizedConnection
    })

  } catch (error) {
    console.error('Get connection details error:', error)
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