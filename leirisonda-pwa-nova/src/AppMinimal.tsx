import React from "react";

// App minimal para teste de Load Failed
export default function AppMinimal() {
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
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          🚀 Leirisonda
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
          Sistema de Gestão de Piscinas
        </p>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <p>✅ App carregada com sucesso</p>
          <p>🔍 Teste de Load Failed - Versão Minimal</p>
          <p>{new Date().toLocaleString()}</p>
        </div>
        <button
          onClick={() => {
            console.log("Testando botão...");
            alert("App minimal funcionando!");
          }}
          style={{
            background: "white",
            color: "#0891b2",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Testar Funcionalidade
        </button>
      </div>
    </div>
  );
}
