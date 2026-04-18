import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

// Pages (will create these next)
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Log from "./pages/Log";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Sidebar from "./components/Sidebar";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
    </div>
  );
  
  return user ? <>{children}</> : <Navigate to="/" />;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout><Dashboard /></MainLayout>
            </PrivateRoute>
          } />
          <Route path="/recipes" element={
            <PrivateRoute>
              <MainLayout><Recipes /></MainLayout>
            </PrivateRoute>
          } />
          <Route path="/log" element={
            <PrivateRoute>
              <MainLayout><Log /></MainLayout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <MainLayout><Profile /></MainLayout>
            </PrivateRoute>
          } />
        </Routes>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
