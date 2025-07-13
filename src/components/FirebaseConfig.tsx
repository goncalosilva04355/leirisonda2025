import React, { useState, useEffect } from "react";
import {
  Cloud,
  Save,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Edit3,
  Trash2,
  Copy,
  Download,
  Upload,
  Settings,
  Database,
  Plus,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

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
  measurementId?: string;
}

interface SavedConfig extends FirebaseSettings {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
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
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [currentView, setCurrentView] = useState<"list" | "edit" | "create">(
    "list",
  );
  const [editingConfig, setEditingConfig] = useState<SavedConfig | null>(null);
  const [configName, setConfigName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  // Load saved configurations
  useEffect(() => {
    loadSavedConfigs();
  }, []);

  const loadSavedConfigs = () => {
    try {
      const stored = localStorage.getItem("firebase-configs");
      if (stored) {
        const configs = JSON.parse(stored);
        setSavedConfigs(configs);

        // Find active config
        const activeConfig = configs.find((cfg: SavedConfig) => cfg.isActive);
        if (activeConfig) {
          setConfig(activeConfig);
          setIsConfigLoaded(true);
          setSuccess(true);
        }
      } else {
        // Create default config if none exists
        createDefaultConfig();
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      createDefaultConfig();
    }
  };

  const createDefaultConfig = () => {
    const defaultConfig: SavedConfig = {
      id: "default",
      name: "Configuração Padrão Leirisonda",
      apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
      authDomain: "leirisonda-16f8b.firebaseapp.com",
      projectId: "leirisonda-16f8b",
      storageBucket: "leirisonda-16f8b.firebasestorage.app",
      messagingSenderId: "540456875574",
      appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
      measurementId: "G-R9W43EHH2C",
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const configs = [defaultConfig];
    localStorage.setItem("firebase-configs", JSON.stringify(configs));
    localStorage.setItem("firebase-config", JSON.stringify(defaultConfig));
    setSavedConfigs(configs);
    setConfig(defaultConfig);
    setIsConfigLoaded(true);
    setSuccess(true);
  };

  const saveConfiguration = async () => {
    setLoading(true);
    setError("");

    try {
      // Validation
      const requiredFields = ["apiKey", "authDomain", "projectId"];
      const missingFields = requiredFields.filter(
        (field) => !config[field as keyof FirebaseSettings],
      );

      if (missingFields.length > 0) {
        setError(`Campos obrigatórios em falta: ${missingFields.join(", ")}`);
        setLoading(false);
        return;
      }

      if (!configName.trim()) {
        setError("Nome da configuração é obrigatório");
        setLoading(false);
        return;
      }

      const newConfig: SavedConfig = {
        ...config,
        id: editingConfig?.id || Date.now().toString(),
        name: configName,
        createdAt: editingConfig?.createdAt || new Date().toISOString(),
        isActive: false,
      };

      let updatedConfigs = [...savedConfigs];

      if (editingConfig) {
        // Update existing
        updatedConfigs = updatedConfigs.map((cfg) =>
          cfg.id === editingConfig.id ? newConfig : cfg,
        );
      } else {
        // Add new
        updatedConfigs.push(newConfig);
      }

      localStorage.setItem("firebase-configs", JSON.stringify(updatedConfigs));
      setSavedConfigs(updatedConfigs);
      setSuccess(true);
      setCurrentView("list");
      setEditingConfig(null);
      setConfigName("");

      console.log("🔧 Configuração Firebase salva:", newConfig.name);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      setError("Erro inesperado ao guardar configuração.");
    }

    setLoading(false);
  };

  const activateConfig = (configToActivate: SavedConfig) => {
    try {
      // Deactivate all configs
      const updatedConfigs = savedConfigs.map((cfg) => ({
        ...cfg,
        isActive: cfg.id === configToActivate.id,
      }));

      localStorage.setItem("firebase-configs", JSON.stringify(updatedConfigs));
      localStorage.setItem("firebase-config", JSON.stringify(configToActivate));

      setSavedConfigs(updatedConfigs);
      setConfig(configToActivate);
      setIsConfigLoaded(true);
      setSuccess(true);

      console.log("🔧 Configuração ativada:", configToActivate.name);
      onConfigured();
    } catch (error) {
      console.error("Erro ao ativar configuração:", error);
      setError("Erro ao ativar configuração");
    }
  };

  const deleteConfig = (configId: string) => {
    if (window.confirm("Tem certeza que deseja apagar esta configuração?")) {
      try {
        const updatedConfigs = savedConfigs.filter(
          (cfg) => cfg.id !== configId,
        );
        localStorage.setItem(
          "firebase-configs",
          JSON.stringify(updatedConfigs),
        );
        setSavedConfigs(updatedConfigs);

        // If deleted config was active, set first available as active
        const deletedConfig = savedConfigs.find((cfg) => cfg.id === configId);
        if (deletedConfig?.isActive && updatedConfigs.length > 0) {
          activateConfig(updatedConfigs[0]);
        }

        console.log("🗑️ Configuração apagada:", configId);
      } catch (error) {
        console.error("Erro ao apagar configuração:", error);
        setError("Erro ao apagar configuração");
      }
    }
  };

  const editConfig = (configToEdit: SavedConfig) => {
    setEditingConfig(configToEdit);
    setConfig(configToEdit);
    setConfigName(configToEdit.name);
    setCurrentView("edit");
  };

  const createNewConfig = () => {
    setEditingConfig(null);
    setConfig({
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: "",
    });
    setConfigName("");
    setCurrentView("create");
  };

  const exportConfigs = () => {
    try {
      const dataStr = JSON.stringify(savedConfigs, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `firebase-configs-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar configurações:", error);
      setError("Erro ao exportar configurações");
    }
  };

  const handleFieldChange = (field: keyof FirebaseSettings, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  };

  const renderListView = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Configurações Firebase
                </h1>
                <p className="text-gray-600">
                  Gerir configurações de Firebase para diferentes ambientes
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportConfigs}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={createNewConfig}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Configuração</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Configurations List */}
        <div className="space-y-4">
          {savedConfigs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma configuração encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Crie a sua primeira configuração Firebase
              </p>
              <button
                onClick={createNewConfig}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Configuração</span>
              </button>
            </div>
          ) : (
            savedConfigs.map((savedConfig) => (
              <div
                key={savedConfig.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  savedConfig.isActive
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            savedConfig.isActive
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {savedConfig.name}
                        </h3>
                        {savedConfig.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Ativa
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Projeto:</span>{" "}
                          {savedConfig.projectId}
                        </div>
                        <div>
                          <span className="font-medium">Criada:</span>{" "}
                          {new Date(savedConfig.createdAt).toLocaleDateString(
                            "pt-PT",
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!savedConfig.isActive && (
                        <button
                          onClick={() => activateConfig(savedConfig)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                        >
                          Ativar
                        </button>
                      )}
                      <button
                        onClick={() => editConfig(savedConfig)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {savedConfig.id !== "default" && (
                        <button
                          onClick={() => deleteConfig(savedConfig.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Apagar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderEditView = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentView("list")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingConfig ? "Editar Configuração" : "Nova Configuração"}
              </h1>
              <p className="text-gray-600">
                {editingConfig
                  ? "Modificar configuração existente"
                  : "Criar nova configuração Firebase"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Configuration Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Configuração *
              </label>
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Produção, Desenvolvimento, Teste..."
              />
            </div>

            {/* Firebase Fields */}
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
                onChange={(e) =>
                  handleFieldChange("authDomain", e.target.value)
                }
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

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setCurrentView("list")}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={saveConfiguration}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "A guardar..." : "Guardar"}</span>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>Como obter as credenciais:</span>
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
    </div>
  );

  // Show list view by default
  if (currentView === "list") {
    return renderListView();
  }

  // Show edit/create view
  if (currentView === "edit" || currentView === "create") {
    return renderEditView();
  }

  return renderListView();
};
