import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await getAuthenticatedAdmin(request)

    // Get current date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total student count
    const totalStudents = await prisma.user.count({
      where: {
        userType: 'student',
        isActive: true
      }
    })

    // Daily active users (users who logged mood or used chatbot today)
    const dailyActiveUsers = await prisma.user.count({
      where: {
        userType: 'student',
        isActive: true,
        OR: [
          {
            moodEntries: {
              some: {
                timestamp: {
                  gte: today
                }
              }
            }
          },
          {
            chatSessions: {
              some: {
                messages: {
                  some: {
                    timestamp: {
                      gte: today
                    }
                  }
                }
              }
            }
          }
        ]
      }
    })

    // Active crisis alerts
    const activeCrisisAlerts = await prisma.crisisAlert.count({
      where: {
        isResolved: false
      }
    })

    // Average mood score (last 30 days)
    const recentMoodEntries = await prisma.moodEntry.findMany({
      where: {
        timestamp: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        moodScore: true
      }
    })

    const averageMoodScore = recentMoodEntries.length > 0
      ? recentMoodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / recentMoodEntries.length
      : 0

    // Weekly growth metrics
    const usersThisWeek = await prisma.user.count({
      where: {
        userType: 'student',
        createdAt: {
          gte: thisWeek
        }
      }
    })

    const moodEntriesThisWeek = await prisma.moodEntry.count({
      where: {
        timestamp: {
          gte: thisWeek
        }
      }
    })

    // Mental health engagement metrics
    const totalChatSessions = await prisma.chatSession.count()
    const totalMoodEntries = await prisma.moodEntry.count()

    // Crisis and mentorship metrics
    const totalMentors = await prisma.user.count({
      where: {
        userType: 'mentor',
        isActive: true
      }
    })

    const activeConnections = await prisma.connection.count({
      where: {
        status: 'accepted'
      }
    })

    const pendingConnections = await prisma.connection.count({
      where: {
        status: 'pending'
      }
    })

    // Recent trends (last 7 days)
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

      const dailyMoods = await prisma.moodEntry.findMany({
        where: {
          timestamp: {
            gte: date,
            lt: nextDate
          }
        },
        select: {
          moodScore: true
        }
      })

      const dailyAverage = dailyMoods.length > 0
        ? dailyMoods.reduce((sum, entry) => sum + entry.moodScore, 0) / dailyMoods.length
        : 0

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        averageMood: Math.round(dailyAverage * 100) / 100,
        entryCount: dailyMoods.length
      })
    }

    // Campus-wide alerts summary
    const recentAlerts = await prisma.crisisAlert.findMany({
      where: {
        timestamp: {
          gte: thisWeek
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5,
      select: {
        id: true,
        areaOfConcern: true,
        timestamp: true,
        isResolved: true
      }
    })

    return NextResponse.json({
      overview: {
        totalStudents,
        dailyActiveUsers,
        activeCrisisAlerts,
        averageMoodScore: Math.round(averageMoodScore * 100) / 100,
        totalMentors,
        activeConnections,
        pendingConnections
      },
      engagement: {
        totalChatSessions,
        totalMoodEntries,
        usersThisWeek,
        moodEntriesThisWeek
      },
      trends: {
        dailyMoodTrends: dailyStats
      },
      alerts: {
        recent: recentAlerts,
        totalActive: activeCrisisAlerts
      }
    })

  } catch (error) {
    console.error('Admin overview error:', error)
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