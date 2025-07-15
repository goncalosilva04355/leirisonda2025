import React from "react";

console.log("🚀 App-super-simple carregando...");

function AppSuperSimple() {
  console.log("🔍 AppSuperSimple renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#2563eb", marginBottom: "1rem" }}>
          🔧 Diagnóstico Leirisonda
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Se consegues ver esta mensagem, o React está a funcionar!
        </p>
        <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
          Timestamp: {new Date().toLocaleString()}
        </p>
        <button
          onClick={() => alert("Botão funcionando!")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Testar Interação
        </button>
      </div>
    </div>
  );
}

console.log("✅ App-super-simple definido");

export default AppSuperSimple;
