import React from "react";

export default function AppMinimal() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        fontFamily: "system-ui",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            color: "#1f2937",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Leirisonda
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          Sistema de Gestão de Piscinas
        </p>
        <div
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          Aplicação está a funcionar!
        </div>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.75rem",
            marginTop: "1rem",
          }}
        >
          Versão de teste - {new Date().toLocaleString("pt-PT")}
        </p>
      </div>
    </div>
  );
}
