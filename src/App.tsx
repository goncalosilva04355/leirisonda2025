// APP PRINCIPAL SEM FIREBASE SDK - USANDO APENAS REST API
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminPage } from "./admin/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { SplashPage } from "./pages/SplashPage";

// Criar QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const stored = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(stored === "true");
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <SplashPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <LoginPage onLogin={() => setIsAuthenticated(true)} />
                )
              }
            />
            <Route
              path="/admin/*"
              element={
                isAuthenticated ? (
                  <AdminPage onLogout={() => setIsAuthenticated(false)} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
