import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Leirisonda - Inicializando aplicação...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

// Função para renderizar fallback
function renderFallback(error?: any) {
  root.render(
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
        {error && (
          <p style={{ marginBottom: "2rem", fontSize: "0.9rem" }}>
            Erro: {error?.message || "Erro desconhecido"}
          </p>
        )}
        <button
          onClick={() => window.location.reload()}
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
          Recarregar
        </button>
      </div>
    </div>,
  );
}

// Tentar carregar App dinamicamente
async function loadApp() {
  try {
    // Usar App mínimo primeiro para testar Netlify
    const { default: AppMinimal } = await import("./AppMinimal");
    root.render(<AppMinimal />);
    console.log("✅ App mínimo renderizado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao carregar App mínimo:", error);
    renderFallback(error);
  }
}

// Inicializar app
loadApp();
