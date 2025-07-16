import React from "react";

export default function AppDirect() {
  console.log("🚀 AppDirect: Aplicação carregando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "system-ui",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ color: "#3b82f6", marginBottom: "1rem" }}>
          ✅ Leirisonda - Aplicação a Funcionar!
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Se conseguir ver esta mensagem, a aplicação está a carregar
          correctamente.
        </p>
        <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
          Agora posso identificar onde está o problema na aplicação principal.
        </p>
      </div>
    </div>
  );
}
