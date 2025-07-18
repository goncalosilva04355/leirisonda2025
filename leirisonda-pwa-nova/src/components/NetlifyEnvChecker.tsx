import React from "react";

export const NetlifyEnvChecker: React.FC = () => {
  // Só mostrar em produção (Netlify)
  if (import.meta.env.DEV) {
    return null;
  }

  // Verificar variáveis de ambiente do Netlify
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env
      .VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const getVarStatus = (value: string | undefined) => {
    if (!value) return { status: "❌ Não definida", color: "text-red-600" };
    if (value.includes("your_") || value.includes("_here"))
      return { status: "⚠️ Placeholder", color: "text-yellow-600" };
    return { status: "✅ Configurada", color: "text-green-600" };
  };

  const allConfigured = Object.values(envVars).every((value) => {
    const { status } = getVarStatus(value);
    return status === "✅ Configurada";
  });

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">
        🌐 Status Variáveis Netlify
      </h3>

      <div className="space-y-1 text-xs">
        {Object.entries(envVars).map(([key, value]) => {
          const { status, color } = getVarStatus(value);
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="font-mono text-gray-600 truncate mr-2">
                {key.replace("VITE_FIREBASE_", "")}:
              </span>
              <span className={color}>{status}</span>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-3 p-2 rounded text-xs font-medium text-center ${
          allConfigured
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {allConfigured
          ? "🎉 Todas as variáveis configuradas!"
          : "⚠️ Algumas variáveis em falta"}
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Ambiente: {import.meta.env.MODE}
      </div>
    </div>
  );
};

export default NetlifyEnvChecker;
