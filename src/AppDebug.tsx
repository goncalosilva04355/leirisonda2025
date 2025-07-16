import React from "react";

const AppDebug: React.FC = () => {
  console.log("🚀 AppDebug renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "1rem",
          padding: "2rem",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          🏊‍♂️ Leirisonda
        </h1>

        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            opacity: 0.9,
          }}
        >
          Sistema de Gestão de Piscinas
        </h2>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <p style={{ margin: 0, fontSize: "1rem" }}>
            ✅ Aplicação carregada com sucesso!
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.5rem",
            textAlign: "left",
            fontSize: "0.875rem",
            opacity: 0.8,
          }}
        >
          <div>🔍 Modo: {import.meta.env.MODE}</div>
          <div>🌐 Produção: {import.meta.env.PROD ? "Sim" : "Não"}</div>
          <div>⏰ Timestamp: {new Date().toLocaleString("pt-PT")}</div>
          <div>📱 User Agent: {navigator.userAgent.substring(0, 50)}...</div>
          <div>🔧 React: {React.version}</div>
        </div>

        <button
          onClick={() => {
            console.log("🔄 Recarregando aplicação...");
            window.location.reload();
          }}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "2rem",
          }}
        >
          🔄 Recarregar
        </button>
      </div>
    </div>
  );
};

export default AppDebug;
