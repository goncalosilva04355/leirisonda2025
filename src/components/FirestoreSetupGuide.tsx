/**
 * Guia para configurar Firestore no Firebase Console
 */

import React, { useState, useEffect } from "react";

export function FirestoreSetupGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [hasStorageIssues, setHasStorageIssues] = useState(false);

  useEffect(() => {
    const handleStorageTest = (event: any) => {
      const { storageTest } = event.detail;
      const hasIssues = !storageTest.canRead || !storageTest.canWrite;
      setHasStorageIssues(hasIssues);

      // Mostrar guia automaticamente se houver problemas
      if (hasIssues) {
        setTimeout(() => setShowGuide(true), 2000);
      }
    };

    window.addEventListener("firebaseStorageTest", handleStorageTest);

    return () => {
      window.removeEventListener("firebaseStorageTest", handleStorageTest);
    };
  }, []);

  if (!hasStorageIssues || !showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🔧</div>
          <h3 className="text-lg font-semibold">Configurar Firestore</h3>
          <p className="text-sm text-gray-600 mt-2">
            O Firestore precisa ser ativado no Firebase Console
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <div className="font-medium text-blue-600 mb-2">
              📋 Passos para ativar:
            </div>

            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="font-medium">1. Abrir Firebase Console</div>
                <div className="text-gray-600">
                  Ir para{" "}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    console.firebase.google.com
                  </a>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-3">
                <div className="font-medium">2. Selecionar Projeto</div>
                <div className="text-gray-600">
                  Escolher o projeto "leirisonda-16f8b"
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-3">
                <div className="font-medium">3. Ativar Firestore</div>
                <div className="text-gray-600">
                  • Ir para "Firestore Database"
                  <br />
                  • Clicar "Create database"
                  <br />
                  • Escolher "Start in test mode"
                  <br />• Selecionar localização (europe-west)
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-3">
                <div className="font-medium">4. Configurar Regras</div>
                <div className="text-gray-600">
                  • Ir para "Rules"
                  <br />
                  • Usar regras abertas para desenvolvimento:
                  <br />
                  <code className="text-xs bg-gray-100 p-1 rounded block mt-1">
                    allow read, write: if true;
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="font-medium text-yellow-800">⚠️ Importante:</div>
            <div className="text-yellow-700 text-xs mt-1">
              As regras abertas são apenas para desenvolvimento. Em produção,
              usar regras de segurança adequadas.
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="font-medium text-blue-800">
              💡 Depois da configuração:
            </div>
            <div className="text-blue-700 text-xs mt-1">
              Recarregar esta página para testar a conexão.
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={() =>
              window.open("https://console.firebase.google.com", "_blank")
            }
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🚀 Abrir Console
          </button>
          <button
            onClick={() => setShowGuide(false)}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Fechar
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-500 underline"
          >
            🔄 Recarregar página para testar
          </button>
        </div>
      </div>
    </div>
  );
}
