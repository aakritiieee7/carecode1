import { Server as HTTPServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

export interface AuthenticatedSocket {
  userId: string
  userType: string
  email: string
}

let io: SocketServer | null = null

export const initializeWebSocket = (server: HTTPServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const secret = process.env.JWT_SECRET
      if (!secret) {
        return next(new Error('JWT secret not configured'))
      }

      const decoded = jwt.verify(token, secret) as any
      
      // Verify user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          userType: true,
          isActive: true
        }
      })

      if (!user || !user.isActive) {
        return next(new Error('Invalid user or account inactive'))
      }

      // Attach user info to socket
      socket.data.user = {
        userId: user.id,
        userType: user.userType,
        email: user.email
      } as AuthenticatedSocket

      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  // Connection handler
  io.on('connection', (socket) => {
    const user = socket.data.user as AuthenticatedSocket
    console.log(`User ${user.userId} (${user.userType}) connected`)

    // Join user to their personal room
    socket.join(`user:${user.userId}`)

    // Join rooms for active connections
    socket.on('join-connection', async (connectionId: string) => {
      try {
        // Verify user is part of this connection
        const connection = await prisma.connection.findFirst({
          where: {
            id: connectionId,
            OR: [
              { studentId: user.userId },
              { mentorId: user.userId }
            ],
            status: 'accepted'
          }
        })

        if (connection) {
          socket.join(`connection:${connectionId}`)
          socket.emit('joined-connection', { connectionId })
        } else {
          socket.emit('error', { message: 'Unauthorized to join this connection' })
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join connection' })
      }
    })

    // Handle private messages between mentor and student
    socket.on('send-message', async (data: {
      connectionId: string
      message: string
    }) => {
      try {
        const { connectionId, message } = data

        // Verify connection exists and user is part of it
        const connection = await prisma.connection.findFirst({
          where: {
            id: connectionId,
            OR: [
              { studentId: user.userId },
              { mentorId: user.userId }
            ],
            status: 'accepted'
          },
          include: {
            student: { select: { id: true, fullName: true } },
            mentor: { select: { id: true, fullName: true } }
          }
        })

        if (!connection) {
          socket.emit('error', { message: 'Connection not found or unauthorized' })
          return
        }

        // Create message record (you might want to add a MentorMessage model)
        const messageData = {
          connectionId,
          senderId: user.userId,
          message,
          timestamp: new Date(),
          senderName: user.userId === connection.studentId ? connection.student.fullName : connection.mentor.fullName,
          senderType: user.userType
        }

        // Broadcast message to connection room
        io.to(`connection:${connectionId}`).emit('new-message', messageData)
        
        // Also send to individual user rooms for notification
        const recipientId = user.userId === connection.studentId ? connection.mentorId : connection.studentId
        io.to(`user:${recipientId}`).emit('message-notification', {
          connectionId,
          senderName: messageData.senderName,
          message: message.substring(0, 100) // Preview
        })

      } catch (error) {
        console.error('Send message error:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle typing indicators
    socket.on('typing-start', (data: { connectionId: string }) => {
      socket.to(`connection:${data.connectionId}`).emit('user-typing', {
        userId: user.userId,
        userType: user.userType
      })
    })

    socket.on('typing-stop', (data: { connectionId: string }) => {
      socket.to(`connection:${data.connectionId}`).emit('user-stopped-typing', {
        userId: user.userId,
        userType: user.userType
      })
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${user.userId} disconnected`)
    })
  })

  return io
}

export const getWebSocketServer = () => io

// Helper function to emit to specific users
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data)
  }
}