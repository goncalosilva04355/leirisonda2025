import React, { useState } from "react";
import { Cloud, AlertCircle, CheckCircle, X } from "lucide-react";

interface FirebaseConfigProps {
  isOpen: boolean;
  onClose: () => void;
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

export const FirebaseConfig: React.FC<FirebaseConfigProps> = ({
  isOpen,
  onClose,
}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Default Firebase configuration (read-only)
  const config: FirebaseSettings = {
    apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
    authDomain: "leirisonda-16f8b.firebaseapp.com",
    projectId: "leirisonda-16f8b",
    storageBucket: "leirisonda-16f8b.firebasestorage.app",
    messagingSenderId: "540456875574",
    appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
    measurementId: "G-R9W43EHH2C",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Cloud className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Configuração Firebase
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Success message */}
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-md mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Firebase está ativo e configurado corretamente
            </span>
          </div>

          {/* Read-only configuration display */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="text"
                value={config.apiKey}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auth Domain
              </label>
              <input
                type="text"
                value={config.authDomain}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID
              </label>
              <input
                type="text"
                value={config.projectId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Bucket
              </label>
              <input
                type="text"
                value={config.storageBucket}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={config.messagingSenderId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App ID
              </label>
              <input
                type="text"
                value={config.appId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurement ID
              </label>
              <input
                type="text"
                value={config.measurementId || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">
              Modo Firebase-Only
            </h3>
            <p className="text-sm text-blue-700">
              A aplicação está configurada para usar exclusivamente Firebase. A
              configuração é fixa e não pode ser alterada para garantir
              estabilidade e segurança.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
