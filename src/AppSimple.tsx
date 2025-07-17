import React, { useState, useEffect } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

// Simple storage utilities
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

const AppSimple = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 App inicializada");

    // Initialize with clean state
    setIsAuthenticated(false);
    setCurrentUser(null);

    // Clear any invalid auth state
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");

    setIsLoading(false);
  }, []);

  const handleLogin = (user: any) => {
    console.log("✅ Login realizado:", user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    safeLocalStorage.setItem("currentUser", JSON.stringify(user));
    safeLocalStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    console.log("🚪 Logout realizado");
    setCurrentUser(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Leirisonda</h1>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onError={(error) => console.error("❌ Erro no login:", error)}
      />
    );
  }

  // Authenticated - show main app
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "600px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>
        <h1
          style={{
            fontSize: "2.5rem",
            margin: "0 0 1rem 0",
            fontWeight: "bold",
          }}
        >
          Leirisonda
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            margin: "0 0 2rem 0",
            opacity: 0.9,
          }}
        >
          Bem-vindo, {currentUser?.name || "Utilizador"}!
        </p>
        <p style={{ marginBottom: "2rem" }}>
          A aplicação principal está a ser carregada. Por favor, aguarde...
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => {
              console.log("🔄 Tentando carregar app principal...");
              window.location.href = window.location.origin + "?advanced=true";
            }}
            style={{
              background: "white",
              color: "#0891b2",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "1rem",
              display: "block",
              width: "100%",
            }}
          >
            Carregar App Principal
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            Sair
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Limpar Cache
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
          Sistema funcionando em modo simplificado
        </p>
      </div>
    </div>
  );
};

export default AppSimple;
