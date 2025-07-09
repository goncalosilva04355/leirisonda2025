/**
 * Componente para mostrar status do Firestore storage
 */

import React, { useState, useEffect } from "react";

export function FirebaseStorageStatus() {
  const [storageStatus, setStorageStatus] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleStorageTest = (event: any) => {
      setStorageStatus(event.detail);
    };

    window.addEventListener("firebaseStorageTest", handleStorageTest);

    return () => {
      window.removeEventListener("firebaseStorageTest", handleStorageTest);
    };
  }, []);

  if (!storageStatus) return null;

  const { projectCheck, storageTest } = storageStatus;
  const hasIssues = !storageTest.canRead || !storageTest.canWrite;

  return (
    <div className="fixed top-16 right-4 max-w-sm">
      <div
        className={`
        border rounded-lg p-3 shadow-lg text-sm
        ${
          hasIssues
            ? "bg-red-50 border-red-400 text-red-800"
            : "bg-green-50 border-green-400 text-green-800"
        }
      `}
      >
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {hasIssues ? "❌ Storage Issue" : "✅ Storage OK"}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs underline"
          >
            {showDetails ? "Ocultar" : "Ver"}
          </button>
        </div>

        {showDetails && (
          <div className="mt-2 space-y-2 text-xs">
            <div>
              <div className="font-medium">Projeto Firebase:</div>
              <div>• ID: {projectCheck.projectId}</div>
              <div>• Status: {projectCheck.status}</div>
            </div>

            <div>
              <div className="font-medium">Firestore:</div>
              <div>• Existe: {storageTest.firestoreExists ? "✅" : "❌"}</div>
              <div>• Leitura: {storageTest.canRead ? "✅" : "❌"}</div>
              <div>• Escrita: {storageTest.canWrite ? "✅" : "❌"}</div>
              <div>• Regras: {storageTest.rulesStatus}</div>
            </div>

            {storageTest.error && (
              <div>
                <div className="font-medium text-red-600">Erro:</div>
                <div className="text-red-600">{storageTest.error}</div>
              </div>
            )}

            {hasIssues && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                <div className="font-medium text-yellow-800">💡 Solução:</div>
                <div className="text-yellow-700 text-xs">
                  1. Ir ao Firebase Console
                  <br />
                  2. Ativar Firestore Database
                  <br />
                  3. Configurar regras de segurança
                  <br />
                  4. Permitir leitura/escrita para desenvolvimento
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
