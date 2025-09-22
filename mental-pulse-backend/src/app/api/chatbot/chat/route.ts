import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { chatMessageSchema } from '@/lib/validations'
import { generateAIResponse } from '@/lib/gemini'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const body = await request.json()

    // Validate input
    const validation = chatMessageSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { text } = validation.data

    // Get or create active chat session
    let chatSession = await prisma.chatSession.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 20 // Last 20 messages for context
        }
      }
    })

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: { userId: user.id },
        include: {
          messages: true
        }
      })
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType: 'user',
        text
      }
    })

    // Prepare conversation history for AI context
    const conversationHistory = chatSession.messages.map(msg => ({
      role: msg.senderType,
      content: msg.text
    }))

    // Add current user message to context
    conversationHistory.push({
      role: 'user',
      content: text
    })

    // Generate AI response
    const aiResponseText = await generateAIResponse(text, conversationHistory)

    // Save AI response
    const botMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType: 'bot',
        text: aiResponseText
      }
    })

    return NextResponse.json({
      sessionId: chatSession.id,
      userMessage: {
        id: userMessage.id,
        text: userMessage.text,
        timestamp: userMessage.timestamp,
        senderType: 'user'
      },
      botMessage: {
        id: botMessage.id,
        text: botMessage.text,
        timestamp: botMessage.timestamp,
        senderType: 'bot'
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
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
    
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    let whereClause: any = { userId: user.id }
    if (sessionId) {
      whereClause.id = sessionId
    }

    // Get chat session(s) with messages
    const chatSessions = await prisma.chatSession.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: sessionId ? 1 : 10 // If specific session, get 1, otherwise get last 10
    })

    return NextResponse.json({
      sessions: chatSessions
    })

  } catch (error) {
    console.error('Get chat sessions error:', error)
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
    const user = await getAuthenticatedUser(request)
    
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    if (sessionId) {
      // Delete specific session
      await prisma.chatSession.deleteMany({
        where: {
          id: sessionId,
          userId: user.id
        }
      })
    } else {
      // Delete all sessions for user
      await prisma.chatSession.deleteMany({
        where: { userId: user.id }
      })
    }

    return NextResponse.json({
      message: 'Chat history cleared successfully'
    })

  } catch (error) {
    console.error('Clear chat history error:', error)
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