import React from "react";

export default function AppTest() {
  console.log("🧪 AppTest renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0891b2",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <h1>🔧 Leirisonda - Teste</h1>
        <p>Esta é uma versão de teste simplificada</p>
        <p>Se está a ver esta mensagem, o problema não é do React</p>
        <p>Data: {new Date().toLocaleString("pt-PT")}</p>
        <button
          onClick={() => {
            console.log("Botão clicado");
            alert("Botão funcionando!");
          }}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "white",
            color: "#0891b2",
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
