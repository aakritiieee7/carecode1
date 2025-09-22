import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  userType: z.enum(['student', 'admin', 'mentor'], {
    errorMap: () => ({ message: 'User type must be student, admin, or mentor' })
  }),
  anonymityLevel: z.number().min(0).max(100).optional().default(50)
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export const updatePrivacySchema = z.object({
  anonymityLevel: z.number().min(0).max(100)
})

// Mood tracking validation schemas
export const moodEntrySchema = z.object({
  moodScore: z.number().int().min(1).max(5),
  notes: z.string().optional(),
  location: z.string().optional()
})

// Chat validation schemas
export const chatMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long')
})

// Mentor profile validation schemas
export const mentorProfileSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  bio: z.string().optional()
})

// Connection validation schemas
export const connectionRequestSchema = z.object({
  mentorId: z.string().uuid('Invalid mentor ID')
})

// Crisis alert validation schemas
export const crisisAlertSchema = z.object({
  areaOfConcern: z.string().min(1, 'Area of concern is required'),
  description: z.string().optional()
})

// Campaign validation schemas
export const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().datetime('Invalid date format'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'active', 'completed']).optional().default('draft')
})

// Resource validation schemas
export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  url: z.string().url('Invalid URL').optional(),
  category: z.string().min(1, 'Category is required'),
  isPublic: z.boolean().optional().default(true)
})