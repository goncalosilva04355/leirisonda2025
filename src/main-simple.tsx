import React from "react";
import ReactDOM from "react-dom/client";

console.log("🚀 Main-simple iniciando...");

const SimpleApp: React.FC = () => {
  console.log("📱 SimpleApp renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0891b2",
        fontFamily: "Arial, sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "#0891b2",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h1>🏊‍♂️ Leirisonda Funciona!</h1>
        <p>Se está a ver isto, o React está OK!</p>
        <p>Hora: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🔄 Tentando renderizar SimpleApp...");
  ReactDOM.createRoot(rootElement).render(<SimpleApp />);
  console.log("✅ SimpleApp renderizado com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar SimpleApp:", error);

  // Fallback HTML direto
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #0891b2; font-family: Arial, sans-serif; color: white;">
      <div style="background-color: white; color: #0891b2; padding: 40px; border-radius: 10px; text-align: center;">
        <h1>🏊‍♂️ Leirisonda - Modo Emergência</h1>
        <p>Erro no React, mas HTML funciona!</p>
        <p>Erro: ${error.message}</p>
        <button onclick="location.reload()" style="background: #0891b2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Recarregar
        </button>
      </div>
    </div>
  `;
}
