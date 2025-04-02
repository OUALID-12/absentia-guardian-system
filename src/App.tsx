
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAbsences from "./pages/student/StudentAbsences";
import StudentClaims from "./pages/student/StudentClaims";
import StudentProfile from "./pages/student/StudentProfile";

// Supervisor Pages
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import SupervisorAbsences from "./pages/supervisor/SupervisorAbsences";
import SupervisorClasses from "./pages/supervisor/SupervisorClasses";
import SupervisorProfile from "./pages/supervisor/SupervisorProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/absences" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentAbsences />
              </ProtectedRoute>
            } />
            <Route path="/student/claims" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentClaims />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            
            {/* Supervisor Routes */}
            <Route path="/supervisor/dashboard" element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/absences" element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorAbsences />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/classes" element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorClasses />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/profile" element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorProfile />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
