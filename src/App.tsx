
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import History from "./pages/History";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role
  const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
