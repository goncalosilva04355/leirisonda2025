import React, { useEffect, useState } from "react";
import { runCleanupNow } from "../utils/manualCleanup";

const CleanupExecutor: React.FC = () => {
  const [cleanupResult, setCleanupResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCleanup = () => {
    setIsExecuting(true);
    console.log("🚀 Iniciando limpeza manual...");

    try {
      const result = runCleanupNow();
      setCleanupResult(result);
      console.log("✅ Resultado da limpeza:", result);
    } catch (error) {
      console.error("❌ Erro na limpeza:", error);
      setCleanupResult({
        success: false,
        message: `Erro: ${error}`,
        details: { foundUsers: [], removedUsers: [], keysChecked: [] },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const checkCurrentUsers = () => {
    console.log("🔍 Verificando utilizadores atuais...");

    const appUsers = localStorage.getItem("app-users");
    const mockUsers = localStorage.getItem("mock-users");
    const currentUser = localStorage.getItem("currentUser");

    console.log("App Users:", appUsers ? JSON.parse(appUsers) : "Nenhum");
    console.log("Mock Users:", mockUsers ? JSON.parse(mockUsers) : "Nenhum");
    console.log(
      "Current User:",
      currentUser ? JSON.parse(currentUser) : "Nenhum",
    );
  };

  useEffect(() => {
    // Executar limpeza automaticamente ao carregar
    executeCleanup();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "white",
        border: "2px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 9999,
        maxWidth: "400px",
      }}
    >
      <h3>🧹 Limpeza de Utilizadores</h3>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={executeCleanup}
          disabled={isExecuting}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {isExecuting ? "Executando..." : "Executar Limpeza"}
        </button>

        <button
          onClick={checkCurrentUsers}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Verificar Utilizadores
        </button>
      </div>

      {cleanupResult && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: cleanupResult.success ? "#d1fae5" : "#fee2e2",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <p>
            <strong>Status:</strong>{" "}
            {cleanupResult.success ? "✅ Sucesso" : "❌ Erro"}
          </p>
          <p>
            <strong>Mensagem:</strong> {cleanupResult.message}
          </p>

          {cleanupResult.details && (
            <div>
              <p>
                <strong>Utilizadores encontrados:</strong>{" "}
                {cleanupResult.details.foundUsers.length}
              </p>
              <p>
                <strong>Utilizadores removidos:</strong>{" "}
                {cleanupResult.details.removedUsers.length}
              </p>
              <p>
                <strong>Chaves verificadas:</strong>{" "}
                {cleanupResult.details.keysChecked.length}
              </p>

              {cleanupResult.details.removedUsers.length > 0 && (
                <div>
                  <p>
                    <strong>Emails removidos:</strong>
                  </p>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {cleanupResult.details.removedUsers.map(
                      (email: string, index: number) => (
                        <li key={index} style={{ fontSize: "12px" }}>
                          {email}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CleanupExecutor;
