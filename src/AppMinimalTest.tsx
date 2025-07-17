import React, { useState, useEffect } from "react";

// Minimal App test to check if the issue is in the main App.tsx
console.log("🧪 AppMinimalTest: Starting...");

export default function AppMinimalTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("🧪 AppMinimalTest: useEffect iniciado");

    // Simulate loading time
    const timeout = setTimeout(() => {
      console.log("🧪 AppMinimalTest: Loading concluído");
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  console.log("🧪 AppMinimalTest renderizado:", { isLoading, isAuthenticated });

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
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            🧪 App Teste
          </h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
            A carregar versão simplificada...
          </p>
          <div
            style={{
              width: "200px",
              height: "4px",
              background: "rgba(255,255,255,0.3)",
              borderRadius: "2px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "60%",
                height: "100%",
                background: "white",
                borderRadius: "2px",
                animation: "progress 2s ease-in-out infinite",
              }}
            ></div>
          </div>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 30%; }
            50% { width: 80%; }
            100% { width: 30%; }
          }
        `}</style>
      </div>
    );
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
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
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            color: "#333",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ color: "#0891b2", marginBottom: "0.5rem" }}>
              🔧 Leirisonda
            </h1>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Sistema de Gestão de Piscinas
            </p>
          </div>

          <div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Palavra-passe
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <button
              onClick={() => {
                console.log("🧪 Login simulado");
                setIsAuthenticated(true);
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#0891b2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
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
      <div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          ✅ App Funcionando
        </h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          Versão simplificada carregada com sucesso!
        </p>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={{
            background: "white",
            color: "#0891b2",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
