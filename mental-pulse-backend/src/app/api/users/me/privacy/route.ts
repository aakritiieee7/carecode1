import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { updatePrivacySchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const body = await request.json()

    // Validate input
    const validation = updatePrivacySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { anonymityLevel } = validation.data

    // Update user's anonymity level
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { anonymityLevel },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        anonymityLevel: true,
        isActive: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update privacy error:', error)
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