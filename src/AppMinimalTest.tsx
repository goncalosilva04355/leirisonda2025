import React from "react";

export default function AppMinimalTest() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
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
          borderRadius: "0.5rem",
          textAlign: "center",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ color: "#3b82f6", marginBottom: "1rem" }}>
          Leirisonda - Teste Básico
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Se conseguir ver esta mensagem, o React está a funcionar.
        </p>
        <div
          style={{
            background: "#dcfdf7",
            border: "1px solid #34d399",
            borderRadius: "0.375rem",
            padding: "1rem",
            color: "#065f46",
          }}
        >
          ✅ Aplicação carregou com sucesso
        </div>
        <button
          onClick={() => console.log("Botão clicado!")}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Teste de Interação
        </button>
      </div>
    </div>
  );
}
