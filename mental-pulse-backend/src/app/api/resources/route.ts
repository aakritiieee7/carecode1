import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/auth'
import { resourceSchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedAdmin(request)
    const body = await request.json()

    // Validate input
    const validation = resourceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { title, description, url, category, isPublic } = validation.data

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        url,
        category,
        isPublic: isPublic ?? true
      }
    })

    return NextResponse.json({
      message: 'Resource created successfully',
      resource
    }, { status: 201 })

  } catch (error) {
    console.error('Create resource error:', error)
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
    const category = url.searchParams.get('category')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}
    
    // Non-admin users only see public resources
    if (user.userType !== 'admin') {
      whereClause.isPublic = true
    }

    if (category) {
      whereClause.category = {
        contains: category,
        mode: 'insensitive'
      }
    }

    // Get resources
    const resources = await prisma.resource.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { title: 'asc' }
      ],
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.resource.count({
      where: whereClause
    })

    // Group resources by category
    const resourcesByCategory: { [key: string]: any[] } = {}
    resources.forEach(resource => {
      if (!resourcesByCategory[resource.category]) {
        resourcesByCategory[resource.category] = []
      }
      resourcesByCategory[resource.category].push(resource)
    })

    // Get available categories
    const categories = await prisma.resource.findMany({
      where: user.userType !== 'admin' ? { isPublic: true } : {},
      select: { category: true },
      distinct: ['category']
    }).then(results => results.map(r => r.category).sort())

    return NextResponse.json({
      resources,
      resourcesByCategory,
      categories,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        category
      }
    })

  } catch (error) {
    console.error('Get resources error:', error)
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

    const { resourceId, ...updateData } = body

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: resourceId }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Update resource
    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Resource updated successfully',
      resource: updatedResource
    })

  } catch (error) {
    console.error('Update resource error:', error)
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

export async function DELETE(request: NextRequest) {
  try {
    await getAuthenticatedAdmin(request)
    
    const url = new URL(request.url)
    const resourceId = url.searchParams.get('resourceId')

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: resourceId }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Delete resource
    await prisma.resource.delete({
      where: { id: resourceId }
    })

    return NextResponse.json({
      message: 'Resource deleted successfully'
    })

  } catch (error) {
    console.error('Delete resource error:', error)
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