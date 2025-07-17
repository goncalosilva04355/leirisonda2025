import React from "react";

const AppUltraSimple: React.FC = () => {
  console.log("🚀 AppUltraSimple renderizado!");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0891b2",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "#0891b2",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
          }}
        >
          🏊‍♂️ Leirisonda
        </h1>

        <p
          style={{
            fontSize: "18px",
            margin: "0 0 30px 0",
            color: "#666",
          }}
        >
          Sistema funcionando!
        </p>

        <div
          style={{
            fontSize: "14px",
            color: "#999",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          <p>✅ React: OK</p>
          <p>✅ Renderização: OK</p>
          <p>✅ Estilos: OK</p>
          <p>📱 {new Date().toLocaleString()}</p>
        </div>

        <button
          onClick={() => {
            console.log("Botão clicado!");
            alert("Sistema Leirisonda funcionando corretamente!");
          }}
          style={{
            backgroundColor: "#0891b2",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          ✨ Testar Funcionalidade
        </button>
      </div>
    </div>
  );
};

export default AppUltraSimple;
