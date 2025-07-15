/**
 * Componente simplificado para mostrar status das coleções Firestore
 */

import React, { useState } from "react";

export function SimpleFirestoreStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const checkFirestore = async () => {
    setLoading(true);
    try {
      const db = (window as any).simpleFirebaseDb;

      if (!db) {
        setStatus("❌ Firebase não inicializado");
        return;
      }

      // Usar o checker simples
      const checker = (window as any).simpleFirestoreChecker;
      if (checker) {
        const results = await checker.checkAllCollections();
        const existing = results.filter((r: any) => r.exists).length;
        const total = results.length;

        setStatus(`✅ Firebase ativo: ${existing}/${total} coleções com dados`);
        checker.generateReport(results);
      } else {
        setStatus("⚠️ Checker não disponível");
      }
    } catch (error) {
      setStatus("❌ Erro: " + (error as Error).message);
      console.error("Erro ao verificar Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão para abrir */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
          title="Status Firebase Simples"
        >
          🗄️
        </button>
      )}

      {/* Modal de status */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4 max-w-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">🔥 Firebase Status</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Status */}
          {status && (
            <div className="bg-gray-50 p-3 rounded mb-3 text-sm">{status}</div>
          )}

          {/* Botão de verificação */}
          <button
            onClick={checkFirestore}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "🔍 Verificar Firebase"}
          </button>

          {/* Info */}
          <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
            💡 Versão simplificada para debug. Vê o console para mais detalhes.
          </div>
        </div>
      )}
    </>
  );
}
