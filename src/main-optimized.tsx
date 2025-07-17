import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Lazy loading para reduzir o bundle inicial
const App = React.lazy(() => import("./App"));
const ImprovedErrorBoundary = React.lazy(
  () => import("./components/ImprovedErrorBoundary"),
);

// Loading component
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

// Error fallback
function ErrorFallback({ error }: { error: Error }) {
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

console.log("🚀 Inicializando Leirisonda...");

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Elemento root não encontrado no HTML");
  }

  ReactDOM.createRoot(root).render(
    <React.Suspense fallback={<LoadingScreen />}>
      <React.Suspense
        fallback={
          <ErrorFallback
            error={new Error("Erro ao carregar componente de erro")}
          />
        }
      >
        <ImprovedErrorBoundary>
          <App />
        </ImprovedErrorBoundary>
      </React.Suspense>
    </React.Suspense>,
  );

  console.log("✅ Leirisonda inicializada com sucesso");
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
