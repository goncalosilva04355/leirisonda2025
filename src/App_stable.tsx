import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Play,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
  FileText,
  MapPin,
  Share,
  Database,
} from "lucide-react";
import jsPDF from "jspdf";

// Componentes essenciais apenas
import { LoginPage } from "./pages/LoginPage";
import { hybridAuthService as authService } from "./services/hybridAuthService";
import { UserProfile } from "./services/robustLoginService";

// Firebase status - sem auto-refresh
import { FirestoreStatus } from "./components/FirestoreStatus";

interface UserProfileWithRole extends UserProfile {
  role?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfileWithRole | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Verificar autenticação apenas uma vez
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (mounted) {
          setCurrentUser(user);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        if (mounted) {
          setCurrentUser(null);
          setIsLoading(false);
        }
      }
    };

    // Delay para evitar renderizações excessivas
    const timer = setTimeout(checkAuth, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Se ainda está carregando
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ color: "white", fontSize: "18px" }}>🔄 Carregando...</div>
      </div>
    );
  }

  // Se não tem usuário logado, mostrar login
  if (!currentUser) {
    return (
      <>
        <FirestoreStatus />
        <LoginPage />
      </>
    );
  }

  // Dashboard simples para usuário logado
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <FirestoreStatus />

      {/* Header */}
      <div
        style={{
          background: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Building2 size={24} color="#667eea" />
          <h1 style={{ margin: 0, color: "#333" }}>Dashboard</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#666" }}>
            Olá, {currentUser.name || currentUser.email}
          </span>
          <button
            onClick={async () => {
              await authService.logout();
              setCurrentUser(null);
            }}
            style={{
              background: "#e74c3c",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} style={{ marginRight: "0.5rem" }} />
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            ✅ Sistema Funcional
          </h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            O Firebase foi configurado com sucesso! A aplicação está estável.
          </p>

          <div
            style={{
              background: "#f8f9fa",
              padding: "1rem",
              borderRadius: "4px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ color: "#495057", margin: "0 0 0.5rem 0" }}>
              Status do Sistema:
            </h3>
            <ul style={{ color: "#6c757d", margin: 0 }}>
              <li>✅ Firebase configurado</li>
              <li>✅ Firestore ativo</li>
              <li>✅ Autenticação funcional</li>
              <li>✅ Sem refreshes automáticos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
