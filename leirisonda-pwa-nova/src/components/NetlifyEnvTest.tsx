import React from "react";

export const NetlifyEnvTest: React.FC = () => {
  // Verificar todas as variáveis de ambiente relacionadas ao Firebase
  const envVars = {
    // Principais (que devem estar no Netlify)
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env
      .VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,

    // Leirisonda (fallback)
    VITE_LEIRISONDA_FIREBASE_API_KEY: import.meta.env
      .VITE_LEIRISONDA_FIREBASE_API_KEY,
    VITE_LEIRISONDA_FIREBASE_PROJECT_ID: import.meta.env
      .VITE_LEIRISONDA_FIREBASE_PROJECT_ID,

    // Outros
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
  };

  const getStatus = (value: string | undefined) => {
    if (!value) return { status: "❌ Ausente", color: "text-red-600" };
    if (value.includes("your_") || value.includes("here"))
      return { status: "⚠️ Placeholder", color: "text-yellow-600" };
    return { status: "✅ Presente", color: "text-green-600" };
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        🔍 Teste de Variáveis de Ambiente (Netlify)
      </h3>

      <div className="space-y-2">
        <h4 className="font-medium text-blue-600">
          Variáveis Principais do Firebase:
        </h4>
        {Object.entries(envVars).map(([key, value]) => {
          const { status, color } = getStatus(value);
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="font-mono text-sm">{key}:</span>
              <span className={color}>{status}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded">
        <h4 className="font-medium text-blue-800">📝 Instruções:</h4>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>1. Se vir "❌ Ausente" - adicione a variável no Netlify</li>
          <li>2. Se vir "⚠️ Placeholder" - substitua pelo valor real</li>
          <li>3. Se vir "✅ Presente" - está configurado corretamente</li>
          <li>4. Depois de alterar no Netlify, faça redeploy</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-yellow-100 rounded">
        <h4 className="font-medium text-yellow-800">🚀 Netlify Deploy:</h4>
        <p className="text-sm text-yellow-700">
          Este teste só funciona completamente em produção (Netlify).
          Localmente, use o arquivo .env para testar.
        </p>
      </div>
    </div>
  );
};

export default NetlifyEnvTest;
