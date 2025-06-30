import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./global.css";

// Components
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { WorksList } from "./pages/WorksList";
import { WorkDetail } from "./pages/WorkDetail";
import { CreateWork } from "./pages/CreateWork";
import { EditWork } from "./pages/EditWork";
import { CreateUser } from "./pages/CreateUser";
import { UsersList } from "./pages/UsersList";
import { EditUser } from "./pages/EditUser";
import { UserDataManager } from "./pages/UserDataManager";
import { PoolMaintenancePage } from "./pages/PoolMaintenance";
import { MaintenanceList } from "./pages/MaintenanceList";
import { CreateMaintenance } from "./pages/CreateMaintenance";
import { MaintenanceDetail } from "./pages/MaintenanceDetail";
import { CreateIntervention } from "./pages/CreateIntervention";
import { NewMaintenanceSelector } from "./pages/NewMaintenanceSelector";
import { MobileDeploy } from "./pages/MobileDeploy";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="works" element={<WorksList />} />
              <Route path="works/:id" element={<WorkDetail />} />
              <Route path="create-work" element={<CreateWork />} />
              <Route path="edit-work/:id" element={<EditWork />} />
              <Route path="users" element={<UsersList />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="edit-user/:id" element={<EditUser />} />
              <Route path="user-data" element={<UserDataManager />} />
              <Route path="pool-maintenance" element={<MaintenanceList />} />
              <Route
                path="create-maintenance"
                element={<CreateMaintenance />}
              />
              <Route path="maintenance/:id" element={<MaintenanceDetail />} />
              <Route
                path="maintenance/:maintenanceId/new-intervention"
                element={<CreateIntervention />}
              />
              <Route
                path="maintenance/new-general"
                element={<NewMaintenanceSelector />}
              />
              <Route path="mobile-deploy" element={<MobileDeploy />} />
              <Route
                path="old-pool-maintenance"
                element={<PoolMaintenancePage />}
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Initialize app with error handling
try {
  console.log("🚀 Initializing Leirisonda app...");

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found in DOM");
  }

  if (!(rootElement as any)._reactRoot) {
    console.log("📦 Creating React root...");
    const root = ReactDOM.createRoot(rootElement);
    (rootElement as any)._reactRoot = root;

    console.log("🎨 Rendering app...");
    root.render(<App />);

    console.log("✅ App initialized successfully");
  } else {
    console.log("ℹ️ React root already exists");
  }
} catch (error) {
  console.error("🚨 Fatal error during app initialization:", error);

  // Show fallback error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; padding: 1rem;">
        <div style="max-width: 28rem; width: 100%; background: white; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 2rem; text-align: center;">
          <div style="width: 4rem; height: 4rem; background-color: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg style="width: 2rem; height: 2rem; color: #dc2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h1 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">
            Erro de Inicialização
          </h1>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">
            Não foi possível carregar a aplicação. Por favor, recarregue a página.
          </p>
          <button
            onclick="window.location.reload()"
            style="display: inline-flex; align-items: center; padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: background-color 0.2s;"
            onmouseover="this.style.backgroundColor='#1d4ed8'"
            onmouseout="this.style.backgroundColor='#2563eb'"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    `;
  }
}
