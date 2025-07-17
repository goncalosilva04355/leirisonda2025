import React from "react";

function AppMinimalTest() {
  console.log("🚀 AppMinimalTest renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#333",
            marginBottom: "20px",
            fontSize: "2rem",
          }}
        >
          🏊‍♂️ Leirisonda
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
            fontSize: "1.1rem",
          }}
        >
          Sistema de Gestão de Piscinas
        </p>

        <div
          style={{
            background: "#f0f9ff",
            border: "2px solid #0891b2",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#0891b2", margin: "0 0 10px 0" }}>
            ✅ Aplicação Funcionando
          </h3>
          <p style={{ margin: 0, color: "#333" }}>
            Esta versão minimalista está carregando corretamente.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🔄 Recarregar
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🧹 Limpar Cache
          </button>
        </div>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.875rem",
            marginTop: "20px",
          }}
        >
          Timestamp: {new Date().toLocaleString("pt-PT")}
        </p>
      </div>
    </div>
  );
}

export default AppMinimalTest;
