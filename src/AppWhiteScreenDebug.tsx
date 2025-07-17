import React, { useState, useEffect } from "react";

const AppWhiteScreenDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const logs: any[] = [];

    // Teste básico de renderização
    logs.push({
      test: "React rendering",
      status: "OK",
      time: new Date().toLocaleString(),
    });

    // Verificar CSS
    const stylesheets = document.querySelectorAll(
      'link[rel="stylesheet"], style',
    );
    logs.push({
      test: "CSS loaded",
      status: stylesheets.length > 0 ? "OK" : "FAIL",
      count: stylesheets.length,
    });

    // Verificar se Tailwind está funcionando
    const tempDiv = document.createElement("div");
    tempDiv.className = "bg-red-500";
    document.body.appendChild(tempDiv);
    const computedStyle = window.getComputedStyle(tempDiv);
    const bgColor = computedStyle.backgroundColor;
    document.body.removeChild(tempDiv);
    logs.push({
      test: "Tailwind CSS",
      status: bgColor === "rgb(239, 68, 68)" ? "OK" : "FAIL",
      value: bgColor,
    });

    // Verificar localStorage
    try {
      localStorage.setItem("test", "ok");
      localStorage.removeItem("test");
      logs.push({ test: "localStorage", status: "OK" });
    } catch (e) {
      logs.push({ test: "localStorage", status: "FAIL", error: e.message });
    }

    // Verificar erros JavaScript
    const errors = (window as any).__errorCount || 0;
    logs.push({
      test: "JavaScript errors",
      status: errors === 0 ? "OK" : "WARNING",
      count: errors,
    });

    // Verificar se é mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    logs.push({
      test: "Device type",
      status: "INFO",
      value: isMobile ? "Mobile" : "Desktop",
    });

    // Verificar viewport
    logs.push({
      test: "Viewport",
      status: "INFO",
      value: `${window.innerWidth}x${window.innerHeight}`,
    });

    setDebugInfo(logs);

    // Atualizar hora a cada segundo
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearAllData = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Clear indexedDB
    if ("indexedDB" in window) {
      indexedDB
        .databases()
        .then((databases) => {
          databases.forEach((db) => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        })
        .catch(console.error);
    }

    alert("Todos os dados foram limpos. A página será recarregada.");
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2, #06b6d4)",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1
            style={{
              color: "#0891b2",
              fontSize: "28px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
            }}
          >
            🏊‍♂️ Leirisonda - Diagnóstico
          </h1>
          <p style={{ color: "#666", margin: "0", fontSize: "16px" }}>
            Diagnóstico de Tela Branca - {currentTime}
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "16px" }}>
            📊 Resultados dos Testes
          </h2>

          <div style={{ display: "grid", gap: "12px" }}>
            {debugInfo.map((info, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background:
                    info.status === "OK"
                      ? "#f0f9ff"
                      : info.status === "FAIL"
                        ? "#fef2f2"
                        : "#fefce8",
                  border: `1px solid ${
                    info.status === "OK"
                      ? "#0891b2"
                      : info.status === "FAIL"
                        ? "#ef4444"
                        : "#f59e0b"
                  }`,
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#333" }}>
                  {info.test}
                </span>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      background:
                        info.status === "OK"
                          ? "#0891b2"
                          : info.status === "FAIL"
                            ? "#ef4444"
                            : "#f59e0b",
                      color: "white",
                    }}
                  >
                    {info.status}
                  </span>
                  {(info.count !== undefined ||
                    info.value !== undefined ||
                    info.error) && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      {info.count !== undefined && `Count: ${info.count}`}
                      {info.value !== undefined && `Value: ${info.value}`}
                      {info.error && `Error: ${info.error}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#0891b2",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            🔄 Recarregar Página
          </button>

          <button
            onClick={clearAllData}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            🗑️ Limpar Tudo e Recarregar
          </button>

          <button
            onClick={() => window.open(window.location.href, "_blank")}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            🔗 Abrir Nova Aba
          </button>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "500" }}>
            ℹ️ Informações Adicionais:
          </p>
          <p style={{ margin: "0 0 4px 0" }}>
            User Agent: {navigator.userAgent}
          </p>
          <p style={{ margin: "0 0 4px 0" }}>URL: {window.location.href}</p>
          <p style={{ margin: "0 0 4px 0" }}>
            Protocolo: {window.location.protocol}
          </p>
          <p style={{ margin: "0" }}>Host: {window.location.host}</p>
        </div>
      </div>
    </div>
  );
};

export default AppWhiteScreenDebug;
