import React from "react";

function AppSimpleTest() {
  console.log("🧪 AppSimpleTest rendering...");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
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
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          🏊‍♂️ Leirisonda - Teste
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Aplicação está a funcionar corretamente!
        </p>

        <p
          style={{
            color: "#10b981",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          ✅ Sistema Operacional
        </p>

        <div
          style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#9ca3af" }}
        >
          Timestamp: {new Date().toLocaleString("pt-PT")}
        </div>
      </div>
    </div>
  );
}

export default AppSimpleTest;
