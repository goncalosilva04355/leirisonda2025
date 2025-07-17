import React, { useState } from "react";

console.log("🚀 AppSimple carregando...");

// Dados de utilizador padrão
const defaultUser = {
  id: 1,
  name: "Gonçalo Fonseca",
  email: "gongonsilva@gmail.com",
  password: "19867gsf",
  role: "super_admin",
  permissions: {
    obras: { view: true, create: true, edit: true, delete: true },
    manutencoes: { view: true, create: true, edit: true, delete: true },
    piscinas: { view: true, create: true, edit: true, delete: true },
    utilizadores: { view: true, create: true, edit: true, delete: true },
    relatorios: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
  },
  active: true,
  createdAt: "2024-01-01",
};

export default function AppSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  console.log("🔄 AppSimple renderizando...", { isAuthenticated });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Verificar credenciais simples
    if (
      loginForm.email === "gongonsilva@gmail.com" &&
      loginForm.password === "19867gsf"
    ) {
      console.log("✅ Login bem-sucedido");
      setCurrentUser(defaultUser);
      setIsAuthenticated(true);
    } else {
      setLoginError("Email ou palavra-passe incorretos");
    }
  };

  // Se não estiver autenticado, mostrar login simples
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1
              style={{
                color: "#0891b2",
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0 0 0.5rem 0",
              }}
            >
              🔧 Leirisonda
            </h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Sistema de Gestão de Piscinas
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Palavra-passe
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
                placeholder="Palavra-passe"
                required
              />
            </div>

            {loginError && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.375rem",
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#0891b2",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Entrar
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              color: "#9ca3af",
            }}
          >
            Versão Produção - {new Date().toLocaleDateString("pt-PT")}
          </div>
        </div>
      </div>
    );
  }

  // Se estiver autenticado, mostrar dashboard simples
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0891b2",
        color: "white",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>🔧 Leirisonda - Dashboard</h1>
      <p>Bem-vindo, {currentUser?.name || "Utilizador"}!</p>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
            setLoginForm({ email: "", password: "" });
            setLoginError("");
          }}
          style={{
            padding: "0.5rem 1rem",
            background: "white",
            color: "#0891b2",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          Sair
        </button>

        <button
          onClick={() => alert("Dashboard completo em desenvolvimento")}
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Funcionalidades
        </button>
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.9rem", opacity: 0.8 }}>
        <p>Aplicação em produção - {new Date().toLocaleString("pt-PT")}</p>
        <p>Versão simplificada para garantir estabilidade</p>
        <p>Para aceder ao sistema completo, contacte o administrador</p>
      </div>

      <div
        style={{
          marginTop: "3rem",
          padding: "1rem",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "0.375rem",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0" }}>Status do Sistema:</h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
          <li>✅ Aplicação carregada com sucesso</li>
          <li>✅ Login funcional</li>
          <li>✅ Interface responsiva</li>
          <li>⚠️ Funcionalidades completas em desenvolvimento</li>
        </ul>
      </div>
    </div>
  );
}
