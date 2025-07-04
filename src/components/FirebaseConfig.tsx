import React, { useState, useEffect } from "react";
import { Cloud, Save, AlertCircle, CheckCircle } from "lucide-react";

interface FirebaseConfigProps {
  onConfigured: () => void;
}

interface FirebaseSettings {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const FirebaseConfig: React.FC<FirebaseConfigProps> = ({
  onConfigured,
}) => {
  const [config, setConfig] = useState<FirebaseSettings>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Firebase is always configured with fixed settings
    const fixedConfig = {
      apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
      authDomain: "leirisonda-16f8b.firebaseapp.com",
      projectId: "leirisonda-16f8b",
      storageBucket: "leirisonda-16f8b.firebasestorage.app",
      messagingSenderId: "540456875574",
      appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
    };
    setConfig(fixedConfig);
    setSuccess(true);
    onConfigured();
  }, [onConfigured]);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    // Basic validation
    const requiredFields = ["apiKey", "authDomain", "projectId"];
    const missingFields = requiredFields.filter(
      (field) => !config[field as keyof FirebaseSettings],
    );

    if (missingFields.length > 0) {
      setError(`Campos obrigatórios em falta: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    // Configuration is already fixed and active
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      onConfigured();
    }, 1500);
  };

  const handleFieldChange = (field: keyof FirebaseSettings, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Configura��ão Guardada!
          </h2>
          <p className="text-gray-600">
            Firebase configurado com sucesso. A sincronização será ativada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <Cloud className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configuração Firebase
          </h1>
          <p className="text-gray-600">
            Configure as credenciais Firebase para ativar a sincronização em
            tempo real
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key *
            </label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => handleFieldChange("apiKey", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AIzaSy..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auth Domain *
            </label>
            <input
              type="text"
              value={config.authDomain}
              onChange={(e) => handleFieldChange("authDomain", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="projeto.firebaseapp.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project ID *
            </label>
            <input
              type="text"
              value={config.projectId}
              onChange={(e) => handleFieldChange("projectId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="leirisonda-projeto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Bucket
            </label>
            <input
              type="text"
              value={config.storageBucket}
              onChange={(e) =>
                handleFieldChange("storageBucket", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="projeto.appspot.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Messaging Sender ID
            </label>
            <input
              type="text"
              value={config.messagingSenderId}
              onChange={(e) =>
                handleFieldChange("messagingSenderId", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App ID
            </label>
            <input
              type="text"
              value={config.appId}
              onChange={(e) => handleFieldChange("appId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1:123:web:abc123"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? "A guardar..." : "Guardar Configuração"}</span>
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">
            Como obter as credenciais:
          </h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Aceda a console.firebase.google.com</li>
            <li>2. Selecione o seu projeto</li>
            <li>3. Vá a Project Settings → General</li>
            <li>4. Na secção "Your apps", encontre as configurações</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
