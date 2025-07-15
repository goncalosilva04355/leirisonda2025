import React from "react";

export const DebugBlankPage: React.FC = () => {
  console.log("🔍 DebugBlankPage renderizado");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#dc2626", marginBottom: "16px" }}>
          Debug: Página Branca
        </h1>
        <p style={{ color: "#374151", marginBottom: "16px" }}>
          Se consegue ver esta mensagem, o React está a funcionar.
        </p>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          O problema pode estar num componente específico ou nos CSS.
        </p>
      </div>
    </div>
  );
};
