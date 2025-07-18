import React from "react";

function AppMinimal() {
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
          🚀 Leirisonda
        </h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          Sistema de Gestão de Piscinas
        </p>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          Versão mínima para teste do Netlify
        </p>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <p style={{ fontSize: "0.9rem", margin: 0 }}>
            URL: {window.location.href}
          </p>
          <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => {
            console.log("Botão clickado");
            alert("Aplicação funcional!");
          }}
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
          Testar Funcionalidade
        </button>
      </div>
    </div>
  );
}

export default AppMinimal;
