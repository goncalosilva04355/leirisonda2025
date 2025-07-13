import React from "react";

const AppTest: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <h1>🔧 Teste de Renderização</h1>
      <p>Se vê esta mensagem, a aplicação React está a funcionar.</p>
      <button
        onClick={() => alert("Botão funciona!")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Testar Clique
      </button>
    </div>
  );
};

export default AppTest;
