import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/auth'
import { campaignSchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedAdmin(request)
    const body = await request.json()

    // Validate input
    const validation = campaignSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { title, date, department, description, status } = validation.data

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        title,
        date: new Date(date),
        department,
        description,
        status: status as any
      }
    })

    return NextResponse.json({
      message: 'Campaign created successfully',
      campaign
    }, { status: 201 })

  } catch (error) {
    console.error('Create campaign error:', error)
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

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const department = url.searchParams.get('department')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}
    if (status) {
      whereClause.status = status
    }
    if (department) {
      whereClause.department = {
        contains: department,
        mode: 'insensitive'
      }
    }

    // Get campaigns
    const campaigns = await prisma.campaign.findMany({
      where: whereClause,
      orderBy: [
        { status: 'asc' }, // Active/scheduled first
        { date: 'desc' }    // Most recent first
      ],
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.campaign.count({
      where: whereClause
    })

    // For non-admin users, filter out some sensitive information if needed
    const sanitizedCampaigns = campaigns.map(campaign => ({
      id: campaign.id,
      title: campaign.title,
      date: campaign.date,
      department: campaign.department,
      description: campaign.description,
      status: campaign.status,
      reach: user.userType === 'admin' ? campaign.reach : null, // Only admins can see reach
      createdAt: campaign.createdAt
    }))

    // Get campaign statistics (for admin)
    let statistics = null
    if (user.userType === 'admin') {
      statistics = {
        total: totalCount,
        active: await prisma.campaign.count({ where: { status: 'active' } }),
        scheduled: await prisma.campaign.count({ where: { status: 'scheduled' } }),
        completed: await prisma.campaign.count({ where: { status: 'completed' } }),
        draft: await prisma.campaign.count({ where: { status: 'draft' } }),
        totalReach: await prisma.campaign.aggregate({
          _sum: { reach: true },
          where: { status: 'completed' }
        }).then(result => result._sum.reach || 0)
      }
    }

    return NextResponse.json({
      campaigns: sanitizedCampaigns,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      statistics,
      filters: {
        status,
        department
      }
    })

  } catch (error) {
    console.error('Get campaigns error:', error)
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
    await getAuthenticatedAdmin(request)
    const body = await request.json()

    const { campaignId, ...updateData } = body

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    // Check if campaign exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // If date is being updated, convert it
    if (updateData.date) {
      updateData.date = new Date(updateData.date)
    }

    // Update campaign
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Campaign updated successfully',
      campaign: updatedCampaign
    })

  } catch (error) {
    console.error('Update campaign error:', error)
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