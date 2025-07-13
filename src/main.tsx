import React from "react";
import ReactDOM from "react-dom/client";

// Renderização mínima para teste
const TestComponent = () => (
  <div
    style={{
      padding: "20px",
      backgroundColor: "#f0f8ff",
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <h1 style={{ color: "#333", marginBottom: "20px" }}>🚀 App Leirisonda</h1>
    <p style={{ color: "#666", fontSize: "18px", marginBottom: "20px" }}>
      Aplicação a funcionar correctamente!
    </p>
    <button
      onClick={() => {
        alert("✅ JavaScript e React funcionam!");
        console.log("Botão clicado com sucesso!");
      }}
      style={{
        padding: "12px 24px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      Testar Funcionalidade
    </button>
    <div style={{ marginTop: "20px", fontSize: "14px", color: "#888" }}>
      Data: {new Date().toLocaleString("pt-PT")}
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(<TestComponent />);
