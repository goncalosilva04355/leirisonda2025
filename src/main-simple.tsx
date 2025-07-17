import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("🚀 Inicializando aplicação simplificada para produção...");

// Error handler global simplificado
window.addEventListener("error", (event) => {
  console.error("❌ Global error:", event.error?.message || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Unhandled promise rejection:", event.reason);
});

// Fallback App simplificado para produção
const SimpleProdApp = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carregamento e depois tentar carregar app principal
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0891b2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(255,255,255,0.3)",
            borderTop: "3px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>🔧 Leirisonda</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>A carregar aplicação...</p>
      </div>
    );
  }

  // Tentar carregar app principal
  try {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0891b2",
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
          <h1 style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>
            🔧 Leirisonda
          </h1>
          <p
            style={{ fontSize: "1.125rem", margin: "0 0 2rem 0", opacity: 0.9 }}
          >
            Sistema de Gestão de Piscinas
          </p>
          <button
            onClick={() => {
              // Tentar recarregar app principal
              window.location.href = window.location.origin;
            }}
            style={{
              background: "white",
              color: "#0891b2",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            Entrar na Aplicação
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Limpar Cache
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Erro na app simplificada:", error);
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#dc2626",
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
          <h1>⚠️ Erro de Carregamento</h1>
          <p>A aplicação encontrou um problema.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "white",
              color: "#dc2626",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  ReactDOM.createRoot(rootElement).render(React.createElement(SimpleProdApp));
  console.log("✅ Aplicação simplificada renderizada com sucesso!");
} catch (error) {
  console.error("❌ Erro ao renderizar app simplificada:", error);

  // Fallback HTML direto
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #0891b2; color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui; text-align: center; padding: 2rem;">
      <div>
        <h1 style="font-size: 2.5rem; margin: 0 0 1rem 0;">🔧 Leirisonda</h1>
        <p style="font-size: 1.125rem; margin: 0 0 2rem 0; opacity: 0.9;">Sistema de Gestão de Piscinas</p>
        <button onclick="window.location.reload()" style="background: white; color: #0891b2; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-size: 1rem; font-weight: bold; cursor: pointer; margin-right: 0.5rem;">
          Recarregar Aplicação
        </button>
        <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-size: 1rem; cursor: pointer;">
          Limpar Cache
        </button>
      </div>
    </div>
  `;
}
