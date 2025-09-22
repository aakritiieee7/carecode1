import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { mentorProfileSchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Only allow mentor or admin users to create mentor profiles
    if (user.userType !== 'mentor' && user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Only mentors can create mentor profiles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = mentorProfileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { department, year, specialties, bio } = validation.data

    // Check if mentor profile already exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Mentor profile already exists. Use PATCH to update.' },
        { status: 409 }
      )
    }

    // Create mentor profile
    const mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        department,
        year,
        specialties,
        bio
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Mentor profile created successfully',
      profile: mentorProfile
    }, { status: 201 })

  } catch (error) {
    console.error('Create mentor profile error:', error)
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
    const user = await getAuthenticatedUser(request)
    const body = await request.json()

    // Validate input
    const validation = mentorProfileSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Check if mentor profile exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id }
    })

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Mentor profile not found' },
        { status: 404 }
      )
    }

    // Update mentor profile
    const updatedProfile = await prisma.mentorProfile.update({
      where: { userId: user.id },
      data: validation.data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Mentor profile updated successfully',
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Update mentor profile error:', error)
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