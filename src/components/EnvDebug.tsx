import React from "react";

export const EnvDebug: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">
        🔍 Debug - Variáveis de Ambiente
      </h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>VITE_FORCE_FIREBASE:</strong>{" "}
          {import.meta.env.VITE_FORCE_FIREBASE || "undefined"}
        </div>
        <div>
          <strong>DEV mode:</strong> {import.meta.env.DEV ? "true" : "false"}
        </div>
        <div>
          <strong>NETLIFY:</strong> {import.meta.env.NETLIFY || "undefined"}
        </div>
        <div>
          <strong>VITE_IS_NETLIFY:</strong>{" "}
          {import.meta.env.VITE_IS_NETLIFY || "undefined"}
        </div>
        <div>
          <strong>Mode:</strong> {import.meta.env.MODE}
        </div>
        <div>
          <strong>BASE_URL:</strong> {import.meta.env.BASE_URL}
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-100 rounded">
        <p className="text-yellow-800 text-sm">
          <strong>Estado esperado:</strong> VITE_FORCE_FIREBASE deve ser "true"
          para ativar Firebase em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default EnvDebug;
