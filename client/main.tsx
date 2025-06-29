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

const rootElement = document.getElementById("root");
if (rootElement && !rootElement._reactRoot) {
  const root = ReactDOM.createRoot(rootElement);
  (rootElement as any)._reactRoot = root;
  root.render(<App />);
}
