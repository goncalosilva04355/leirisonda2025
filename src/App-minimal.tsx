import React from "react";

export default function AppMinimal() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
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
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#1f2937",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          🏊‍♂️ Leirisonda
        </h1>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          Sistema de Gestão de Piscinas
        </p>
        <div
          style={{
            background: "#10b981",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            display: "inline-block",
          }}
        >
          ✅ Aplicação a funcionar correctamente!
        </div>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.875rem",
            marginTop: "1rem",
          }}
        >
          Versão mínima carregada com sucesso
        </p>
      </div>
    </div>
  );
}
