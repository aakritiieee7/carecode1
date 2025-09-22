import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateAlertSchema = z.object({
  alertId: z.string().uuid('Invalid alert ID'),
  isResolved: z.boolean(),
  resolvedBy: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    await getAuthenticatedAdmin(request)
    
    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status') // 'resolved', 'active', or null for all
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}
    if (status === 'resolved') {
      whereClause.isResolved = true
    } else if (status === 'active') {
      whereClause.isResolved = false
    }

    // Get crisis alerts
    const crisisAlerts = await prisma.crisisAlert.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            anonymityLevel: true
          }
        }
      },
      orderBy: [
        { isResolved: 'asc' }, // Unresolved first
        { timestamp: 'desc' }   // Most recent first
      ],
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.crisisAlert.count({
      where: whereClause
    })

    // Apply anonymity filtering and format response
    const sanitizedAlerts = crisisAlerts.map(alert => ({
      id: alert.id,
      areaOfConcern: alert.areaOfConcern,
      description: alert.description,
      timestamp: alert.timestamp,
      isResolved: alert.isResolved,
      resolvedAt: alert.resolvedAt,
      reporter: {
        id: alert.user?.id || null,
        name: alert.user?.anonymityLevel && alert.user.anonymityLevel > 50 
          ? 'Anonymous Student' 
          : alert.user?.fullName || 'Anonymous',
        email: alert.user?.anonymityLevel && alert.user.anonymityLevel < 30 
          ? alert.user.email 
          : null,
        canContact: alert.user?.anonymityLevel && alert.user.anonymityLevel < 50
      },
      priority: determinePriority(alert.areaOfConcern, alert.description),
      timeElapsed: Date.now() - alert.timestamp.getTime()
    }))

    // Get statistics
    const stats = {
      total: totalCount,
      active: await prisma.crisisAlert.count({ where: { isResolved: false } }),
      resolved: await prisma.crisisAlert.count({ where: { isResolved: true } }),
      last24Hours: await prisma.crisisAlert.count({ 
        where: { 
          timestamp: { 
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
          } 
        } 
      })
    }

    return NextResponse.json({
      alerts: sanitizedAlerts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      statistics: stats
    })

  } catch (error) {
    console.error('Get crisis alerts error:', error)
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
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

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(request)
    const body = await request.json()

    // Validate input
    const validation = updateAlertSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { alertId, isResolved } = validation.data

    // Check if alert exists
    const existingAlert = await prisma.crisisAlert.findUnique({
      where: { id: alertId }
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Crisis alert not found' },
        { status: 404 }
      )
    }

    // Update alert
    const updatedAlert = await prisma.crisisAlert.update({
      where: { id: alertId },
      data: {
        isResolved,
        resolvedAt: isResolved ? new Date() : null
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

    return NextResponse.json({
      message: `Crisis alert ${isResolved ? 'resolved' : 'reopened'} successfully`,
      alert: {
        id: updatedAlert.id,
        areaOfConcern: updatedAlert.areaOfConcern,
        description: updatedAlert.description,
        isResolved: updatedAlert.isResolved,
        resolvedAt: updatedAlert.resolvedAt,
        resolvedBy: admin.fullName
      }
    })

  } catch (error) {
    console.error('Update crisis alert error:', error)
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
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

// Helper function to determine alert priority
function determinePriority(areaOfConcern: string, description: string | null): 'low' | 'medium' | 'high' | 'critical' {
  const highPriorityAreas = ['emergency', 'medical', 'safety', 'security', 'suicide', 'self-harm']
  const mediumPriorityAreas = ['dormitory', 'residence', 'bathroom', 'parking']
  
  const content = (areaOfConcern + ' ' + (description || '')).toLowerCase()
  
  // Check for critical keywords
  if (content.includes('suicide') || content.includes('self-harm') || content.includes('emergency')) {
    return 'critical'
  }
  
  // Check for high priority areas
  if (highPriorityAreas.some(area => content.includes(area))) {
    return 'high'
  }
  
  // Check for medium priority areas
  if (mediumPriorityAreas.some(area => content.includes(area))) {
    return 'medium'
  }
  
  return 'low'
}