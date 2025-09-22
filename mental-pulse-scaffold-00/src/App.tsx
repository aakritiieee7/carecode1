import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHome from "./pages/student/Home";
import ChatbotPage from "./pages/student/Chatbot";
import WellnessTracker from "./pages/student/WellnessTracker";
import PeerMentorship from "./pages/student/PeerMentorship";
import CrisisHelp from "./pages/student/CrisisHelp";
import AdminOverview from "./pages/admin/Overview";
import MentorHome from "./pages/mentor/Home";
import NotFound from "./pages/NotFound";
import AdvancedAnalytics from "./pages/admin/AdvancedAnalytics";
import ResourcesLibrary from "./pages/admin/ResourcesLibrary";
import CrisisInterventionWorkflow from "./pages/admin/CrisisInterventionWorkflow";
import CulturalWellnessActivities from "./pages/admin/CulturalWellnessActivities";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Route wrapper that redirects based on auth status
function AuthenticatedApp() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wellness"></div>
      </div>
    );
  }

  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/admin/analytics" element={<AdvancedAnalytics />} />
      <Route path="/student/resources" element={<ResourcesLibrary />} />
      <Route path="/admin/crisis-workflow" element={<CrisisInterventionWorkflow />} />
      <Route path="/student/cultural-activities" element={<CulturalWellnessActivities />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.userType === 'admin' ? '/admin' : user?.userType === 'mentor' ? '/mentor' : '/student'} replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={user?.userType === 'admin' ? '/admin' : user?.userType === 'mentor' ? '/mentor' : '/student'} replace />} />
      
      {/* Protected Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute requiredRole="student">
          <DashboardLayout userType="student">
            <StudentHome />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/chatbot" element={
        <ProtectedRoute requiredRole="student">
          <DashboardLayout userType="student">
            <ChatbotPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/wellness" element={
        <ProtectedRoute requiredRole="student">
          <DashboardLayout userType="student">
            <WellnessTracker />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/mentorship" element={
        <ProtectedRoute requiredRole="student">
          <DashboardLayout userType="student">
            <PeerMentorship />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/crisis" element={
        <ProtectedRoute requiredRole="student">
          <DashboardLayout userType="student">
            <CrisisHelp />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Protected Mentor Routes */}
      <Route path="/mentor" element={
        <ProtectedRoute requiredRole="mentor">
          <DashboardLayout userType="mentor">
            <MentorHome />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminOverview />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirect root to appropriate dashboard */}
      <Route path="/dashboard" element={
        isAuthenticated ? (
          <Navigate to={user?.userType === 'admin' ? '/admin' : user?.userType === 'mentor' ? '/mentor' : '/student'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
