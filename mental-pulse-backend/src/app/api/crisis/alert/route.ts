import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { crisisAlertSchema } from '@/lib/validations'
import { prisma } from '@/lib/db'
import { emitToUser } from '@/lib/websocket'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const body = await request.json()

    // Validate input
    const validation = crisisAlertSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { areaOfConcern, description } = validation.data

    // Create crisis alert
    const crisisAlert = await prisma.crisisAlert.create({
      data: {
        userId: user.id,
        areaOfConcern,
        description
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            anonymityLevel: true
          }
        }
      }
    })

    // Notify all admin users immediately via WebSocket
    const admins = await prisma.user.findMany({
      where: {
        userType: 'admin',
        isActive: true
      },
      select: {
        id: true
      }
    })

    // Send real-time notifications to all admins
    admins.forEach(admin => {
      emitToUser(admin.id, 'crisis-alert', {
        id: crisisAlert.id,
        areaOfConcern: crisisAlert.areaOfConcern,
        description: crisisAlert.description,
        timestamp: crisisAlert.timestamp,
        reporter: crisisAlert.user?.anonymityLevel && crisisAlert.user.anonymityLevel > 50 
          ? 'Anonymous Student' 
          : crisisAlert.user?.fullName || 'Anonymous'
      })
    })

    return NextResponse.json({
      message: 'Crisis alert submitted successfully. Appropriate personnel have been notified.',
      alert: {
        id: crisisAlert.id,
        areaOfConcern: crisisAlert.areaOfConcern,
        description: crisisAlert.description,
        timestamp: crisisAlert.timestamp,
        isResolved: crisisAlert.isResolved
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create crisis alert error:', error)
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