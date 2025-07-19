import React from "react";

const AppDiagnostic: React.FC = () => {
  console.log("🧪 AppDiagnostic carregado");

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
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#2563eb",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          🔍 Leirisonda - Diagnóstico
        </h1>

        <p
          style={{
            marginBottom: "1rem",
            color: "#6b7280",
            fontSize: "1.1rem",
          }}
        >
          ✅ A aplicação está funcionando!
        </p>

        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "0.375rem",
            padding: "1rem",
            marginBottom: "1rem",
            textAlign: "left",
          }}
        >
          <h3
            style={{
              color: "#0369a1",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Status do Sistema:
          </h3>
          <ul
            style={{
              color: "#0369a1",
              fontSize: "0.875rem",
              margin: 0,
              paddingLeft: "1.5rem",
            }}
          >
            <li>✅ React carregado</li>
            <li>✅ Vite build funcionando</li>
            <li>✅ CSS aplicado</li>
            <li>✅ JavaScript executando</li>
          </ul>
        </div>

        <div
          style={{
            background: "#fefce8",
            border: "1px solid #fde047",
            borderRadius: "0.375rem",
            padding: "1rem",
            marginBottom: "1rem",
            textAlign: "left",
          }}
        >
          <h3
            style={{
              color: "#a16207",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Informações Técnicas:
          </h3>
          <div
            style={{
              color: "#a16207",
              fontSize: "0.75rem",
              fontFamily: "monospace",
            }}
          >
            <p>Timestamp: {new Date().toLocaleString("pt-PT")}</p>
            <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
            <p>URL: {window.location.href}</p>
            <p>
              Ambiente: {import.meta.env.PROD ? "Produção" : "Desenvolvimento"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            console.log("🔄 Recarregando aplicação principal...");
            // Trocar para a aplicação principal
            window.location.href = window.location.origin;
          }}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          🚀 Carregar Aplicação Principal
        </button>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.75rem",
            marginTop: "1rem",
          }}
        >
          Se esta página aparece, o problema não é com o build ou hosting.
          <br />O problema está na aplicação principal (App.tsx).
        </p>
      </div>
    </div>
  );
};

export default AppDiagnostic;
