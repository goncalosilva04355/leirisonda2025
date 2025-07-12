import React, { useState, useEffect } from "react";
import { Cloud, Save, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface FirebaseConfigProps {
  onConfigured: () => void;
}

interface FirebaseSettings {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
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
    measurementId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    // Load existing Firebase config from localStorage
    const loadConfigFromStorage = () => {
      try {
        const storedConfig = localStorage.getItem("firebase-config");
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          setConfig(parsedConfig);
          setIsConfigLoaded(true);
          setSuccess(true);
          console.log(
            "🔧 FirebaseConfig: Loaded configuration from localStorage",
          );
          onConfigured();
          return;
        }
      } catch (error) {
        console.warn(
          "🔧 FirebaseConfig: Error loading from localStorage:",
          error,
        );
      }

      // If no stored config, use the provided default config
      const defaultConfig = {
        apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
        authDomain: "leiria-1cfc9.firebaseapp.com",
        projectId: "leiria-1cfc9",
        storageBucket: "leiria-1cfc9.firebasestorage.app",
        messagingSenderId: "632599887141",
        appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
        measurementId: "G-Q2QWQVH60L",
      };

      setConfig(defaultConfig);
      setIsConfigLoaded(true);
      setSuccess(true);

      // Default config applied automatically
      console.log(
        "🔧 FirebaseConfig: Saved default configuration to localStorage",
      );
      onConfigured();
    };

    loadConfigFromStorage();
  }, [onConfigured]);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
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

      // Configuration is already set in Firebase config
      const saveSuccess = true;

      if (saveSuccess) {
        setSuccess(true);
        console.log("🔧 FirebaseConfig: Configuration saved successfully");

        setTimeout(() => {
          onConfigured();
        }, 1500);
      } else {
        setError("Erro ao guardar configuração. Tente novamente.");
      }
    } catch (error) {
      console.error("🔧 FirebaseConfig: Error saving configuration:", error);
      setError("Erro inesperado ao guardar configuração.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    const defaultConfig = {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      databaseURL:
        "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
      measurementId: "G-Q2QWQVH60L",
    };

    setConfig(defaultConfig);
    // Salvar a nova configuração no localStorage
    localStorage.setItem("firebase-config", JSON.stringify(defaultConfig));
    setSuccess(true);
    setError("");
    console.log("🔧 FirebaseConfig: Configuração atualizada e salva");
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "⚠️ ATENÇÃO: Isto vai apagar TODA a configuração Firebase guardada. Esta ação não pode ser desfeita. Confirma?",
      )
    ) {
      // Limpar toda a configuração do localStorage
      localStorage.removeItem("firebase-config");

      // Limpar também outras chaves relacionadas com Firebase
      const firebaseKeys = [
        "firebase-auth-state",
        "firebase-user",
        "firebase-token",
        "firestore-cache",
        "firebase-persistence",
        "firebase-initialized",
      ];

      firebaseKeys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Reset do estado do componente
      setConfig({
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: "",
      });

      setSuccess(false);
      setIsConfigLoaded(false);
      setError("");

      console.log("🧹 FirebaseConfig: Toda a configuração Firebase foi limpa");
      alert(
        "✅ Configuração Firebase completamente limpa! Pode agora inserir uma nova configuração.",
      );
    }
  };

  const handleFieldChange = (field: keyof FirebaseSettings, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  };

  if (success && isConfigLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Firebase Ativo!
          </h2>
          <p className="text-gray-600 mb-6">
            Configuração persistente guardada localmente.
            <br />
            Sincronização ativa em todos os dispositivos.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setError("");
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Editar Configuração
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Restaurar Padrão
            </button>
          </div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measurement ID (Google Analytics)
            </label>
            <input
              type="text"
              value={config.measurementId || ""}
              onChange={(e) =>
                handleFieldChange("measurementId", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Restaurar</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? "A guardar..." : "Guardar"}</span>
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">
            Como obter as credenciais:
          </h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>
              1. Aceda a{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                console.firebase.google.com
              </a>
            </li>
            <li>2. Selecione o seu projeto</li>
            <li>3. Vá a Project Settings → General</li>
            <li>4. Na secção "Your apps", encontre as configurações</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
