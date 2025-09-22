import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await getAuthenticatedAdmin(request)

    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '7')
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Get mood entries with location data
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        timestamp: {
          gte: startDate
        },
        location: {
          not: null
        }
      },
      select: {
        moodScore: true,
        location: true,
        timestamp: true
      }
    })

    // Group by location and calculate statistics
    const locationStats: { [key: string]: any } = {}

    moodEntries.forEach(entry => {
      const location = entry.location!
      if (!locationStats[location]) {
        locationStats[location] = {
          location,
          moodScores: [],
          totalEntries: 0,
          averageMood: 0,
          stressLevel: 0 // Inverse of mood (1-5 becomes 5-1)
        }
      }
      
      locationStats[location].moodScores.push(entry.moodScore)
      locationStats[location].totalEntries += 1
    })

    // Calculate averages and stress levels
    const heatmapData = Object.values(locationStats).map((stat: any) => {
      const average = stat.moodScores.reduce((sum: number, score: number) => sum + score, 0) / stat.moodScores.length
      const stressLevel = 6 - average // Convert mood to stress (1=high stress, 5=low stress)
      
      return {
        location: stat.location,
        totalEntries: stat.totalEntries,
        averageMood: Math.round(average * 100) / 100,
        stressLevel: Math.round(stressLevel * 100) / 100,
        intensity: Math.min(stat.totalEntries / 10, 1) // Normalize intensity for heatmap
      }
    })

    // Sort by stress level (highest first)
    heatmapData.sort((a, b) => b.stressLevel - a.stressLevel)

    // Get overall campus statistics
    const overallStats = {
      totalLocationsTracked: heatmapData.length,
      totalEntries: moodEntries.length,
      averageCampusMood: moodEntries.length > 0 
        ? moodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / moodEntries.length 
        : 0,
      highStressAreas: heatmapData.filter(area => area.stressLevel > 3.5).length,
      period: days
    }

    // Identify trending stress areas (areas with recent increase in stress)
    const recentDays = Math.min(days, 3)
    const recentDate = new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000)
    
    const recentEntries = await prisma.moodEntry.findMany({
      where: {
        timestamp: {
          gte: recentDate
        },
        location: {
          not: null
        }
      },
      select: {
        moodScore: true,
        location: true
      }
    })

    const recentLocationStats: { [key: string]: number[] } = {}
    recentEntries.forEach(entry => {
      if (!recentLocationStats[entry.location!]) {
        recentLocationStats[entry.location!] = []
      }
      recentLocationStats[entry.location!].push(entry.moodScore)
    })

    const trendingAreas = Object.entries(recentLocationStats).map(([location, scores]) => {
      const recentAverage = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const overallArea = heatmapData.find(area => area.location === location)
      const overallAverage = overallArea?.averageMood || recentAverage
      
      return {
        location,
        recentStressLevel: 6 - recentAverage,
        overallStressLevel: 6 - overallAverage,
        trend: (6 - recentAverage) - (6 - overallAverage), // Positive means increasing stress
        entryCount: scores.length
      }
    }).filter(area => area.trend > 0.5).sort((a, b) => b.trend - a.trend)

    return NextResponse.json({
      heatmapData,
      statistics: {
        ...overallStats,
        averageCampusMood: Math.round(overallStats.averageCampusMood * 100) / 100
      },
      trendingStressAreas: trendingAreas.slice(0, 5), // Top 5 trending areas
      metadata: {
        generatedAt: new Date().toISOString(),
        dataRange: {
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
          days
        }
      }
    })

  } catch (error) {
    console.error('Admin heatmap error:', error)
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