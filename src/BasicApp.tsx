import React from "react";

function BasicApp() {
  console.log("🔄 BasicApp sendo renderizado...");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#2563eb",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Leirisonda
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          Sistema de Gestão de Piscinas
        </p>

        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.25rem",
            }}
          >
            Email
          </label>
          <input
            type="email"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "1rem",
            }}
            placeholder="exemplo@email.com"
          />
        </div>

        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.25rem",
            }}
          >
            Palavra-passe
          </label>
          <input
            type="password"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "1rem",
            }}
            placeholder="Digite sua senha"
          />
        </div>

        <button
          style={{
            width: "100%",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        >
          Entrar
        </button>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          >
            ✅ Aplicação carregada com sucesso!
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicApp;
