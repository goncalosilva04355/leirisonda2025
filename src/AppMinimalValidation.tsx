import React, { useState } from "react";

const AppMinimalValidation: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#1e40af", marginBottom: "1rem" }}>
            🏊‍♂️ Leirisonda
          </h1>
          <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
            Sistema de Gestão de Piscinas
          </p>
          <button
            onClick={() => handleLogin("demo-user")}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Aceder como Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "system-ui",
      }}
    >
      <header
        style={{
          background: "#1e40af",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>🏊‍♂️ Leirisonda</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "0.875rem" }}>
            Sistema de Gestão de Piscinas
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Olá, {user}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: "2rem" }}>
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            Dashboard Principal
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Bem-vindo ao sistema de gestão de piscinas Leirisonda.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "#eff6ff",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #dbeafe",
              }}
            >
              <h3 style={{ color: "#1e40af", margin: "0 0 0.5rem 0" }}>
                Obras Ativas
              </h3>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Gerir projetos em curso
              </p>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #dcfce7",
              }}
            >
              <h3 style={{ color: "#15803d", margin: "0 0 0.5rem 0" }}>
                Manutenções
              </h3>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Agendar e acompanhar
              </p>
            </div>

            <div
              style={{
                background: "#fefce8",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #fef3c7",
              }}
            >
              <h3 style={{ color: "#ca8a04", margin: "0 0 0.5rem 0" }}>
                Relatórios
              </h3>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Análises e estatísticas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppMinimalValidation;
