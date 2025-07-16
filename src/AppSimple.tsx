import React, { useState, useEffect } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

const AppSimple: React.FC = () => {
  console.log("🚀 AppSimple renderizando...");

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize app safely
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("🔄 Inicializando AppSimple...");

        // Wait a bit to ensure everything is loaded
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check for existing auth
        const savedUser = localStorage.getItem("currentUser");
        const isAuthStored = localStorage.getItem("isAuthenticated");

        if (savedUser && isAuthStored === "true") {
          try {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
            console.log("✅ Utilizador autenticado encontrado:", user.email);
          } catch (e) {
            console.warn("⚠️ Erro ao carregar utilizador salvo:", e);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAuthenticated");
          }
        }

        setIsLoading(false);
        console.log("✅ AppSimple inicializado com sucesso");
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        setError("Erro ao carregar a aplicação");
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏊‍♂️</div>
          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            Leirisonda
          </div>
          <div style={{ opacity: 0.8, marginBottom: "2rem" }}>
            Sistema de Gestão de Piscinas
          </div>
          <div style={{ opacity: 0.6 }}>A carregar aplicação...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "500px", padding: "2rem" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            Erro na Aplicação
          </div>
          <div style={{ opacity: 0.8, marginBottom: "2rem" }}>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            🔄 Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={async (
          email: string,
          password: string,
          rememberMe?: boolean,
        ) => {
          console.log("🔑 Tentativa de login:", email);

          // Hardcoded login for demo
          if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
            const user = {
              id: 1,
              email,
              name: "Gonçalo Fonseca",
              role: "super_admin",
            };

            setCurrentUser(user);
            setIsAuthenticated(true);

            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("isAuthenticated", "true");

            console.log("✅ Login bem-sucedido");
          } else {
            console.log("❌ Credenciais inválidas");
            throw new Error("Credenciais inválidas");
          }
        }}
        loginError={error || ""}
      />
    );
  }

  // Authenticated - show main app
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
            🏊‍♂️ Leirisonda
          </h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "0.875rem" }}>
            Sistema de Gestão de Piscinas
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ opacity: 0.8 }}>
            Olá, {currentUser?.name || "Utilizador"}
          </span>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentUser(null);
              localStorage.removeItem("currentUser");
              localStorage.removeItem("isAuthenticated");
              console.log("👋 Logout realizado");
            }}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            Aplicação Funcionando!
          </h2>
          <p
            style={{ fontSize: "1.125rem", opacity: 0.8, marginBottom: "2rem" }}
          >
            A versão simplificada da aplicação está carregada com sucesso.
          </p>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              maxWidth: "400px",
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <strong>✅ Status:</strong> Aplicação carregada
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <strong>🔑 Utilizador:</strong> {currentUser?.email}
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <strong>⏰ Timestamp:</strong>{" "}
              {new Date().toLocaleString("pt-PT")}
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <strong>🌐 Ambiente:</strong> {import.meta.env.MODE}
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
              A aplicação principal pode ser carregada de volta:
            </p>
            <button
              onClick={() => {
                console.log("🔄 Redirecionando para aplicação principal...");
                window.location.href = "/";
              }}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              🚀 Carregar App Principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSimple;
