import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi, User } from '@/lib/api'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    fullName: string
    userType: 'student' | 'mentor' | 'admin'
    anonymityLevel?: number
  }) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
  isStudent: boolean
  isMentor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Verify token is still valid by fetching current user
          const response = await authApi.getCurrentUser()
          setUser(response.data.user)
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        } catch (error) {
          // Token is invalid, clear auth state
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      const { user: userData, token: userToken } = response.data
      
      setUser(userData)
      setToken(userToken)
      localStorage.setItem('auth_token', userToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      toast.success('Login successful!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }

  const register = async (userData: {
    email: string
    password: string
    fullName: string
    userType: 'student' | 'mentor' | 'admin'
    anonymityLevel?: number
  }) => {
    try {
      const response = await authApi.register(userData)
      const { user: newUser, token: userToken } = response.data
      
      setUser(newUser)
      setToken(userToken)
      localStorage.setItem('auth_token', userToken)
      localStorage.setItem('user_data', JSON.stringify(newUser))
      
      toast.success('Registration successful!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    queryClient.clear() // Clear all cached queries
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.userType === 'admin',
    isStudent: user?.userType === 'student',
    isMentor: user?.userType === 'mentor',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Component
export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requiredRole 
}: { 
  children: ReactNode
  requireAuth?: boolean
  requiredRole?: 'student' | 'mentor' | 'admin'
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wellness"></div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredRole && user?.userType !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}