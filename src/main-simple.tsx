import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import AppSimple from "./AppSimple";

console.log("🚀 Inicializando versão simplificada...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🔄 Renderizando AppSimple...");

  ReactDOM.createRoot(rootElement).render(<AppSimple />);

  console.log("✅ AppSimple renderizado com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar AppSimple:", error);

  // Fallback muito básico
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #dc2626; color: white; display: flex; align-items: center; justify-content: center; text-align: center; padding: 1rem; font-family: system-ui;">
      <div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">❌ ERRO CRÍTICO</h1>
        <p>Nem a versão mais simples funcionou.</p>
        <p style="font-size: 0.875rem; margin-top: 1rem;">Erro: ${error.message}</p>
        <button onclick="location.reload()" style="background: white; color: #dc2626; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; margin-top: 1rem; cursor: pointer;">Recarregar</button>
      </div>
    </div>
  `;
}
