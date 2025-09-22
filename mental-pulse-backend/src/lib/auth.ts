import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { prisma } from './db'

export interface JWTPayload {
  userId: string
  email: string
  userType: string
}

export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

export function verifyToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  
  try {
    return jwt.verify(token, secret) as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid authorization header')
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        anonymityLevel: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive')
    }

    return user
  } catch (error) {
    throw new Error('Authentication failed')
  }
}

export async function getAuthenticatedAdmin(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  
  if (user.userType !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return user
}
