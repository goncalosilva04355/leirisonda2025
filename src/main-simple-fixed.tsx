import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Simple loading component
function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fa",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid #0891b2",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h2 style={{ color: "#0891b2", margin: "0 0 10px" }}>Leirisonda</h2>
        <p style={{ color: "#666", margin: 0 }}>A carregar aplicação...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Simple error component
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fa",
        color: "#333",
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#dc3545", marginBottom: "20px" }}>
        ⚠️ Erro na Aplicação
      </h1>
      <p style={{ marginBottom: "10px" }}>
        Ocorreu um erro ao carregar a aplicação:
      </p>
      <code
        style={{
          background: "#fff",
          padding: "10px",
          borderRadius: "5px",
          display: "block",
          marginBottom: "20px",
          color: "#d63384",
        }}
      >
        {error.message}
      </code>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "10px 20px",
          background: "#0891b2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Recarregar Aplicação
      </button>
    </div>
  );
}

console.log("🚀 Inicializando Leirisonda (versão simplificada)...");

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Elemento root não encontrado no HTML");
  }

  // First, show loading screen
  ReactDOM.createRoot(root).render(<LoadingScreen />);

  // Then load the main app with error handling
  import("./App")
    .then((AppModule) => {
      const App = AppModule.default;

      // Import error boundary
      return import("./components/ImprovedErrorBoundary").then(
        (ErrorBoundaryModule) => {
          const ImprovedErrorBoundary = ErrorBoundaryModule.default;

          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <ImprovedErrorBoundary>
                <App />
              </ImprovedErrorBoundary>
            </React.StrictMode>,
          );

          console.log("✅ Leirisonda carregada com sucesso");
        },
      );
    })
    .catch((error) => {
      console.error("❌ Erro ao carregar aplicação:", error);

      // Show error screen
      ReactDOM.createRoot(root).render(<ErrorDisplay error={error} />);
    });
} catch (error) {
  console.error("❌ Erro crítico ao inicializar:", error);

  // Fallback manual sem React
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; color: #333; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="color: #dc3545; margin-bottom: 20px;">❌ Erro Crítico</h1>
        <p style="margin-bottom: 10px;">Não foi possível inicializar a aplicação Leirisonda.</p>
        <code style="background: #fff; padding: 10px; border-radius: 5px; display: block; margin-bottom: 20px; color: #d63384;">
          ${error instanceof Error ? error.message : String(error)}
        </code>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #0891b2; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
          Tentar Novamente
        </button>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          Se o problema persistir, contacte o suporte técnico.
        </p>
      </div>
    `;
  }
}
