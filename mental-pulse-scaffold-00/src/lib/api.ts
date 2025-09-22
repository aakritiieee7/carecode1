import axios, { AxiosResponse } from 'axios'

// API Base Configuration
const API_BASE_URL = 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Response Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: any[]
}

// Auth API
export const authApi = {
  register: async (userData: {
    email: string
    password: string
    fullName: string
    userType: 'student' | 'mentor' | 'admin'
    anonymityLevel?: number
  }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => {
    return api.post('/auth/register', userData)
  },

  login: async (credentials: {
    email: string
    password: string
  }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => {
    return api.post('/auth/login', credentials)
  },

  getCurrentUser: async (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => {
    return api.get('/users/me')
  },

  updatePrivacy: async (data: {
    anonymityLevel: number
  }): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => {
    return api.patch('/users/me/privacy', data)
  },
}

// Mood Tracking API
export const moodApi = {
  createEntry: async (entry: {
    moodScore: number
    notes?: string
    location?: string
  }): Promise<AxiosResponse<ApiResponse<{ moodEntry: MoodEntry }>>> => {
    return api.post('/check-ins', entry)
  },

  getEntries: async (params?: {
    page?: number
    limit?: number
  }): Promise<AxiosResponse<ApiResponse<{ moodEntries: MoodEntry[]; pagination: PaginationInfo }>>> => {
    return api.get('/check-ins', { params })
  },

  getHistory: async (days?: number): Promise<AxiosResponse<ApiResponse<{
    history: MoodEntry[]
    statistics: MoodStatistics
    dailyAverages: DailyAverage[]
  }>>> => {
    return api.get('/check-ins/history', { params: { days } })
  },
}

// Chatbot API
export const chatApi = {
  sendMessage: async (message: {
    text: string
  }): Promise<AxiosResponse<ApiResponse<{
    sessionId: string
    userMessage: ChatMessage
    botMessage: ChatMessage
  }>>> => {
    return api.post('/chatbot/chat', message)
  },

  getSessions: async (sessionId?: string): Promise<AxiosResponse<ApiResponse<{
    sessions: ChatSession[]
  }>>> => {
    return api.get('/chatbot/chat', { params: sessionId ? { sessionId } : {} })
  },

  clearHistory: async (sessionId?: string): Promise<AxiosResponse<ApiResponse>> => {
    return api.delete('/chatbot/chat', { params: sessionId ? { sessionId } : {} })
  },
}

// Mentorship API
export const mentorshipApi = {
  createProfile: async (profile: {
    department: string
    year: string
    specialties: string[]
    bio?: string
  }): Promise<AxiosResponse<ApiResponse<{ profile: MentorProfile }>>> => {
    return api.post('/mentors/profile', profile)
  },

  updateProfile: async (profile: Partial<{
    department: string
    year: string
    specialties: string[]
    bio: string
  }>): Promise<AxiosResponse<ApiResponse<{ profile: MentorProfile }>>> => {
    return api.patch('/mentors/profile', profile)
  },

  getMentors: async (params?: {
    department?: string
    specialty?: string
    available?: boolean
    page?: number
    limit?: number
  }): Promise<AxiosResponse<ApiResponse<{
    mentors: Mentor[]
    pagination: PaginationInfo
    filters: any
  }>>> => {
    return api.get('/mentors', { params })
  },

  getMentor: async (mentorId: string): Promise<AxiosResponse<ApiResponse<{
    mentor: Mentor
  }>>> => {
    return api.get(`/mentors/${mentorId}`)
  },

  requestConnection: async (data: {
    mentorId: string
  }): Promise<AxiosResponse<ApiResponse<{ connection: Connection }>>> => {
    return api.post('/connections', data)
  },

  getConnections: async (status?: string): Promise<AxiosResponse<ApiResponse<{
    connections: Connection[]
    pagination: PaginationInfo
  }>>> => {
    return api.get('/connections', { params: status ? { status } : {} })
  },

  respondToConnection: async (requestId: string, action: 'accept' | 'reject'): Promise<AxiosResponse<ApiResponse<{
    connection: Connection
  }>>> => {
    return api.patch(`/connections/${requestId}`, { action })
  },
}

// Crisis API
export const crisisApi = {
  createAlert: async (alert: {
    areaOfConcern: string
    description?: string
  }): Promise<AxiosResponse<ApiResponse<{ alert: CrisisAlert }>>> => {
    return api.post('/crisis/alert', alert)
  },
}

// Admin API
export const adminApi = {
  getOverview: async (): Promise<AxiosResponse<ApiResponse<AdminOverview>>> => {
    return api.get('/admin/overview')
  },

  getHeatmap: async (days?: number): Promise<AxiosResponse<ApiResponse<{
    heatmapData: HeatmapData[]
    statistics: any
    trendingStressAreas: any[]
    metadata: any
  }>>> => {
    return api.get('/admin/heatmap', { params: { days } })
  },

  getCrisisAlerts: async (params?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<AxiosResponse<ApiResponse<{
    alerts: CrisisAlert[]
    pagination: PaginationInfo
    statistics: any
  }>>> => {
    return api.get('/admin/crisis-alerts', { params })
  },

  updateCrisisAlert: async (data: {
    alertId: string
    isResolved: boolean
  }): Promise<AxiosResponse<ApiResponse<{ alert: CrisisAlert }>>> => {
    return api.patch('/admin/crisis-alerts', data)
  },
}

// Campaign API
export const campaignApi = {
  create: async (campaign: {
    title: string
    date: string
    department: string
    description?: string
    status?: 'draft' | 'scheduled' | 'active' | 'completed'
  }): Promise<AxiosResponse<ApiResponse<{ campaign: Campaign }>>> => {
    return api.post('/campaigns', campaign)
  },

  getAll: async (params?: {
    status?: string
    department?: string
    page?: number
    limit?: number
  }): Promise<AxiosResponse<ApiResponse<{
    campaigns: Campaign[]
    pagination: PaginationInfo
    statistics?: any
    filters: any
  }>>> => {
    return api.get('/campaigns', { params })
  },

  update: async (campaignId: string, data: any): Promise<AxiosResponse<ApiResponse<{
    campaign: Campaign
  }>>> => {
    return api.patch('/campaigns', { campaignId, ...data })
  },
}

// Resources API
export const resourceApi = {
  getAll: async (category?: string): Promise<AxiosResponse<ApiResponse<{
    resources: Resource[]
    resourcesByCategory: Record<string, Resource[]>
    categories: string[]
    pagination: PaginationInfo
  }>>> => {
    return api.get('/resources', { params: category ? { category } : {} })
  },

  create: async (resource: {
    title: string
    description?: string
    url?: string
    category: string
    isPublic?: boolean
  }): Promise<AxiosResponse<ApiResponse<{ resource: Resource }>>> => {
    return api.post('/resources', resource)
  },
}

// Health Check
export const healthApi = {
  check: async (): Promise<AxiosResponse<{
    status: string
    timestamp: string
    database: string
    version: string
    environment: string
  }>> => {
    return api.get('/health')
  },
}

// Type Definitions
export interface User {
  id: string
  email: string
  fullName: string
  userType: 'student' | 'mentor' | 'admin'
  anonymityLevel: number
  isActive: boolean
  createdAt: string
  mentorProfile?: MentorProfile
}

export interface MoodEntry {
  id: string
  moodScore: number
  notes?: string
  location?: string
  timestamp: string
}

export interface MoodStatistics {
  totalEntries: number
  averageMood: number
  streak: number
  period: number
}

export interface DailyAverage {
  date: string
  averageMood: number
  entryCount: number
}

export interface ChatMessage {
  id: string
  text: string
  timestamp: string
  senderType: 'user' | 'bot'
}

export interface ChatSession {
  id: string
  userId: string
  createdAt: string
  messages: ChatMessage[]
}

export interface MentorProfile {
  id: string
  userId: string
  department: string
  year: string
  specialties: string[]
  bio?: string
  isAvailable: boolean
  rating?: number
  createdAt: string
  user: {
    id: string
    fullName: string
    email?: string
  }
}

export interface Mentor {
  id: string
  department: string
  year: string
  specialties: string[]
  bio?: string
  isAvailable: boolean
  rating?: number
  createdAt: string
  user: {
    id: string
    fullName: string
    anonymityLevel: number
  }
  connectionStatus?: string
  connectionId?: string
}

export interface Connection {
  id: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
  student: {
    id: string
    fullName: string
    email?: string
    anonymityLevel: number
  }
  mentor: {
    id: string
    fullName: string
    email?: string
    anonymityLevel: number
    mentorProfile?: {
      department: string
      year: string
      specialties: string[]
      rating?: number
    }
  }
}

export interface CrisisAlert {
  id: string
  areaOfConcern: string
  description?: string
  timestamp: string
  isResolved: boolean
  resolvedAt?: string
  reporter?: {
    id?: string
    name: string
    email?: string
    canContact: boolean
  }
  priority: 'low' | 'medium' | 'high' | 'critical'
  timeElapsed: number
}

export interface Campaign {
  id: string
  title: string
  date: string
  department: string
  description?: string
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  reach?: number
  createdAt: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  url?: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

export interface AdminOverview {
  overview: {
    totalStudents: number
    dailyActiveUsers: number
    activeCrisisAlerts: number
    averageMoodScore: number
    totalMentors: number
    activeConnections: number
    pendingConnections: number
  }
  engagement: {
    totalChatSessions: number
    totalMoodEntries: number
    usersThisWeek: number
    moodEntriesThisWeek: number
  }
  trends: {
    dailyMoodTrends: DailyAverage[]
  }
  alerts: {
    recent: CrisisAlert[]
    totalActive: number
  }
}

export interface HeatmapData {
  location: string
  totalEntries: number
  averageMood: number
  stressLevel: number
  intensity: number
}