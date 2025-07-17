import React from "react";

function AppTestSimple() {
  console.log("🧪 AppTestSimple renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2, #06b6d4)",
        color: "white",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🔧 Leirisonda - Teste de Funcionalidade
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Se consegues ver esta mensagem, a aplicação está a carregar
        corretamente.
      </p>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "1rem",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
        }}
      >
        <p>
          <strong>Estado da aplicação:</strong> ✅ Funcionando
        </p>
        <p>
          <strong>React:</strong> ✅ A renderizar
        </p>
        <p>
          <strong>CSS:</strong> ✅ A carregar
        </p>
        <p>
          <strong>JavaScript:</strong> ✅ A executar
        </p>
      </div>
      <button
        onClick={() => {
          console.log("Botão clicado!");
          alert("Aplicação está funcional!");
        }}
        style={{
          marginTop: "2rem",
          padding: "1rem 2rem",
          background: "white",
          color: "#0891b2",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Testar Funcionalidade
      </button>
    </div>
  );
}

export default AppTestSimple;
