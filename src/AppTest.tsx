import React from "react";

// Test minimal imports to identify the problematic module
console.log("🧪 AppTest: Starting import test...");

export default function AppTest() {
  console.log("🧪 AppTest renderizado com sucesso!");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          🧪 App Test
        </h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          Import test funcionando corretamente
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "white",
            color: "#0891b2",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}
