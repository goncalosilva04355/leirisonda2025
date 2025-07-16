// App de teste simples para diagnosticar problema de tela branca
import React from "react";

export default function AppTest() {
  console.log("🧪 AppTest renderizado com sucesso!");

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
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#059669",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          ✅ Leirisonda Ativo
        </h1>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          A aplicação está a funcionar corretamente!
        </p>
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3
            style={{
              color: "#0ea5e9",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Status do Sistema:
          </h3>
          <ul
            style={{
              textAlign: "left",
              margin: 0,
              paddingLeft: "1rem",
              color: "#374151",
            }}
          >
            <li>✅ React carregado</li>
            <li>✅ Componente renderizado</li>
            <li>✅ CSS funcionando</li>
            <li>✅ JavaScript ativo</li>
          </ul>
        </div>
        <button
          onClick={() => {
            console.log("🔄 Recarregando para app principal...");
            window.location.reload();
          }}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Recarregar App Principal
        </button>
      </div>
    </div>
  );
}
