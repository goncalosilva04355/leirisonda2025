import React from "react";
import ReactDOM from "react-dom/client";

const SimpleApp = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Leirisonda - Sistema de Gestão de Piscinas</h1>
      <p>Aplicação a carregar...</p>
      <p>Se vê esta mensagem, o JavaScript está a funcionar.</p>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<SimpleApp />);
} else {
  console.error("Root element not found");
}
