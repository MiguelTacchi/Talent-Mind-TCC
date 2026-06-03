import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./contexts/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobResumes from "./pages/JobResumes";
import UploadResume from "./pages/UploadResume";
import AnalyzeResumes from "./pages/AnalyzeResumes";
import Team from "./pages/Team";
import CompanySettings from "./pages/CompanySettings";
import CreatorCompanies from "./pages/CreatorCompanies";
import CreatorAdmin from "./pages/CreatorAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs/:id/resumes"
        element={
          <ProtectedRoute>
            <JobResumes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs/:id/upload"
        element={
          <ProtectedRoute>
            <UploadResume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs/:id/analyze"
        element={
          <ProtectedRoute>
            <AnalyzeResumes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team"
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <CompanySettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/companies"
        element={
          <ProtectedRoute>
            <CreatorCompanies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <CreatorAdmin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
