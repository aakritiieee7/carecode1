import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  moodApi,
  chatApi,
  mentorshipApi,
  crisisApi,
  adminApi,
  campaignApi,
  resourceApi,
  healthApi,
  MoodEntry,
  ChatMessage,
  Mentor,
  Connection,
  CrisisAlert,
  AdminOverview,
  HeatmapData,
} from '@/lib/api'

// Query Keys
export const queryKeys = {
  health: ['health'],
  mood: {
    entries: ['mood', 'entries'],
    history: (days?: number) => ['mood', 'history', days],
  },
  chat: {
    sessions: ['chat', 'sessions'],
    session: (sessionId: string) => ['chat', 'session', sessionId],
  },
  mentors: {
    all: (filters?: any) => ['mentors', 'all', filters],
    profile: (id: string) => ['mentors', 'profile', id],
  },
  connections: {
    all: (status?: string) => ['connections', 'all', status],
    detail: (id: string) => ['connections', 'detail', id],
  },
  admin: {
    overview: ['admin', 'overview'],
    heatmap: (days?: number) => ['admin', 'heatmap', days],
    crisisAlerts: (filters?: any) => ['admin', 'crisis-alerts', filters],
  },
  campaigns: {
    all: (filters?: any) => ['campaigns', 'all', filters],
  },
  resources: {
    all: (category?: string) => ['resources', 'all', category],
  },
}

// Health Check Hook
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => healthApi.check().then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Mood Tracking Hooks
export function useMoodEntries(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...queryKeys.mood.entries, page, limit],
    queryFn: () => moodApi.getEntries({ page, limit }).then(res => res.data),
  })
}

export function useMoodHistory(days = 30) {
  return useQuery({
    queryKey: queryKeys.mood.history(days),
    queryFn: () => moodApi.getHistory(days).then(res => res.data),
  })
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: moodApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mood.entries })
      queryClient.invalidateQueries({ queryKey: ['mood', 'history'] })
      toast.success('Mood entry recorded successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to record mood entry'
      toast.error(errorMessage)
    },
  })
}

// Chat Hooks
export function useChatSessions() {
  return useQuery({
    queryKey: queryKeys.chat.sessions,
    queryFn: () => chatApi.getSessions().then(res => res.data),
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to send message'
      toast.error(errorMessage)
    },
  })
}

export function useClearChatHistory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: chatApi.clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions })
      toast.success('Chat history cleared successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to clear chat history'
      toast.error(errorMessage)
    },
  })
}

// Mentorship Hooks
export function useMentors(filters?: {
  department?: string
  specialty?: string
  available?: boolean
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.mentors.all(filters),
    queryFn: () => mentorshipApi.getMentors(filters).then(res => res.data),
  })
}

export function useMentor(mentorId: string) {
  return useQuery({
    queryKey: queryKeys.mentors.profile(mentorId),
    queryFn: () => mentorshipApi.getMentor(mentorId).then(res => res.data),
    enabled: !!mentorId,
  })
}

export function useCreateMentorProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: mentorshipApi.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      toast.success('Mentor profile created successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to create mentor profile'
      toast.error(errorMessage)
    },
  })
}

export function useUpdateMentorProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: mentorshipApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      toast.success('Mentor profile updated successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to update mentor profile'
      toast.error(errorMessage)
    },
  })
}

// Connection Hooks
export function useConnections(status?: string) {
  return useQuery({
    queryKey: queryKeys.connections.all(status),
    queryFn: () => mentorshipApi.getConnections(status).then(res => res.data),
  })
}

export function useRequestConnection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: mentorshipApi.requestConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      toast.success('Connection request sent successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to send connection request'
      toast.error(errorMessage)
    },
  })
}

export function useRespondToConnection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) =>
      mentorshipApi.respondToConnection(requestId, action),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      const message = variables.action === 'accept' 
        ? 'Connection request accepted!' 
        : 'Connection request rejected'
      toast.success(message)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to respond to connection request'
      toast.error(errorMessage)
    },
  })
}

// Crisis Alert Hooks
export function useCreateCrisisAlert() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: crisisApi.createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'crisis-alerts'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview })
      toast.success('Crisis alert submitted successfully. Help is on the way.')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to submit crisis alert'
      toast.error(errorMessage)
    },
  })
}

// Admin Hooks
export function useAdminOverview() {
  return useQuery({
    queryKey: queryKeys.admin.overview,
    queryFn: () => adminApi.getOverview().then(res => res.data),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}

export function useAdminHeatmap(days = 7) {
  return useQuery({
    queryKey: queryKeys.admin.heatmap(days),
    queryFn: () => adminApi.getHeatmap(days).then(res => res.data),
  })
}

export function useCrisisAlerts(filters?: {
  status?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.admin.crisisAlerts(filters),
    queryFn: () => adminApi.getCrisisAlerts(filters).then(res => res.data),
  })
}

export function useUpdateCrisisAlert() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.updateCrisisAlert,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'crisis-alerts'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview })
      const message = variables.isResolved 
        ? 'Crisis alert marked as resolved' 
        : 'Crisis alert reopened'
      toast.success(message)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to update crisis alert'
      toast.error(errorMessage)
    },
  })
}

// Campaign Hooks
export function useCampaigns(filters?: {
  status?: string
  department?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.campaigns.all(filters),
    queryFn: () => campaignApi.getAll(filters).then(res => res.data),
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: campaignApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign created successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to create campaign'
      toast.error(errorMessage)
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: any }) =>
      campaignApi.update(campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign updated successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to update campaign'
      toast.error(errorMessage)
    },
  })
}

// Resource Hooks
export function useResources(category?: string) {
  return useQuery({
    queryKey: queryKeys.resources.all(category),
    queryFn: () => resourceApi.getAll(category).then(res => res.data),
  })
}

export function useCreateResource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: resourceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      toast.success('Resource created successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to create resource'
      toast.error(errorMessage)
    },
  })
}