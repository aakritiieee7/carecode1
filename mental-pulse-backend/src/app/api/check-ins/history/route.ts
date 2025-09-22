import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Get query parameters for date range
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get mood entries for the specified period
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: user.id,
        timestamp: {
          gte: startDate
        }
      },
      select: {
        id: true,
        moodScore: true,
        notes: true,
        location: true,
        timestamp: true
      },
      orderBy: { timestamp: 'desc' }
    })

    // Calculate statistics
    const totalEntries = moodEntries.length
    const averageMood = totalEntries > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / totalEntries 
      : 0

    // Calculate streak (consecutive days with entries)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let streak = 0
    let currentDate = new Date(today)
    
    while (streak < days) {
      const dayStart = new Date(currentDate)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(23, 59, 59, 999)
      
      const hasEntryForDay = moodEntries.some(entry => {
        const entryDate = new Date(entry.timestamp)
        return entryDate >= dayStart && entryDate <= dayEnd
      })
      
      if (hasEntryForDay) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    // Group entries by day for trend analysis
    const dailyMoods = moodEntries.reduce((acc, entry) => {
      const date = entry.timestamp.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(entry.moodScore)
      return acc
    }, {} as Record<string, number[]>)

    // Calculate daily averages
    const dailyAverages = Object.entries(dailyMoods).map(([date, scores]) => ({
      date,
      averageMood: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      entryCount: scores.length
    })).sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      history: moodEntries,
      statistics: {
        totalEntries,
        averageMood: Math.round(averageMood * 100) / 100,
        streak,
        period: days
      },
      dailyAverages
    })

  } catch (error) {
    console.error('Get mood history error:', error)
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