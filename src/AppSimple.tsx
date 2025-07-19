import React, { useState } from "react";

const AppSimple: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"login" | "dashboard">(
    "login",
  );
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  console.log("🚀 AppSimple carregado");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔑 Tentativa de login:", loginForm.email);

    // Login simples para teste
    if (loginForm.email && loginForm.password) {
      setCurrentPage("dashboard");
    }
  };

  if (currentPage === "dashboard") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f6",
          padding: "1rem",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <header
            style={{
              background: "white",
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                color: "#1f2937",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              🏊 Leirisonda - Dashboard Simplificado
            </h1>
            <button
              onClick={() => setCurrentPage("login")}
              style={{
                background: "#ef4444",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
            >
              Sair
            </button>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                ✅ Sistema Funcionando
              </h2>
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                Esta é uma versão simplificada da aplicação Leirisonda, sem
                Firebase ou outras dependências complexas.
              </p>
              <p style={{ color: "#059669", fontSize: "0.875rem" }}>
                ✅ Se esta página aparece, o problema da página branca não é com
                React ou Vite.
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                🔍 Diagnóstico
              </h2>
              <ul style={{ color: "#6b7280", paddingLeft: "1.5rem" }}>
                <li>✅ React funcionando</li>
                <li>✅ Roteamento básico funcionando</li>
                <li>✅ Estado funcionando</li>
                <li>✅ Eventos funcionando</li>
                <li>✅ CSS aplicado</li>
              </ul>
            </div>

            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                🛠 Próximos Passos
              </h2>
              <ol style={{ color: "#6b7280", paddingLeft: "1.5rem" }}>
                <li>Verificar erro específico no Firebase</li>
                <li>Revisar importações problemáticas</li>
                <li>Simplificar App.tsx principal</li>
                <li>Teste gradual de componentes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              color: "#1f2937",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            🏊 Leirisonda
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Versão Simplificada - Teste de Produção
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#374151",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.25rem",
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
              placeholder="exemplo@email.com"
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#374151",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.25rem",
              }}
            >
              Palavra-passe
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Digite sua senha"
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#3b82f6",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.25rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.75rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Versão de teste - {new Date().toLocaleString("pt-PT")}
        </p>
      </div>
    </div>
  );
};

export default AppSimple;
