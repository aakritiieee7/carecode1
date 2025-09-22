import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    // Get additional user data including related profiles
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        anonymityLevel: true,
        isActive: true,
        createdAt: true,
        mentorProfile: {
          select: {
            id: true,
            department: true,
            year: true,
            specialties: true,
            bio: true,
            isAvailable: true,
            rating: true
          }
        }
      }
    })

    return NextResponse.json({
      user: userData
    })

  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}