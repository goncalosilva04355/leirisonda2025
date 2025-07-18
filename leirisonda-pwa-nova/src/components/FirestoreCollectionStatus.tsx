/**
 * Componente para mostrar o status das coleções Firestore
 */

import React, { useState, useEffect } from "react";
import { SimpleFirestoreChecker } from "../utils/simpleFirestoreChecker";

interface CollectionStatus {
  name: string;
  exists: boolean;
  documentCount: number;
  sampleData?: any;
  error?: string;
}

export function FirestoreCollectionStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>("");

  const checkCollections = async () => {
    setLoading(true);
    try {
      const checker = new SimpleFirestoreChecker();
      const results = await checker.checkAllCollections();
      setCollections(results);
      setLastCheck(new Date().toLocaleTimeString());

      // Gerar relatório no console
      checker.generateReport(results);
    } catch (error) {
      console.error("❌ Erro ao verificar coleções:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setLoading(true);
    try {
      const checker = new SimpleFirestoreChecker();
      await checker.createSampleData();

      // Verificar novamente após criar dados
      setTimeout(() => {
        checkCollections();
      }, 2000);

      alert("✅ Dados de exemplo criados! Verificando coleções...");
    } catch (error) {
      console.error("❌ Erro ao criar dados de exemplo:", error);
      alert("❌ Erro ao criar dados de exemplo. Ver console para detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (collection: CollectionStatus) => {
    if (collection.error) return "❌";
    if (collection.exists) return "✅";
    return "⚪";
  };

  const getStatusText = (collection: CollectionStatus) => {
    if (collection.error) return `Erro: ${collection.error}`;
    if (collection.exists) return `${collection.documentCount} documentos`;
    return "Vazia";
  };

  const existingCount = collections.filter((c) => c.exists).length;
  const totalCount = collections.length;

  return (
    <>
      {/* Botão para abrir */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (collections.length === 0) checkCollections();
          }}
          className="fixed bottom-20 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
          title="Status Coleções Firestore"
        >
          🗄️
        </button>
      )}

      {/* Modal de status */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4 max-w-lg max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">🗄️ Coleções Firestore</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Resumo */}
          {collections.length > 0 && (
            <div className="bg-blue-50 p-3 rounded mb-3">
              <div className="text-sm font-medium text-blue-900">
                Status: {existingCount}/{totalCount} coleções com dados
              </div>
              {lastCheck && (
                <div className="text-xs text-blue-700">
                  Última verificação: {lastCheck}
                </div>
              )}
            </div>
          )}

          {/* Lista de coleções */}
          {collections.length > 0 && (
            <div className="space-y-2 mb-3">
              {collections.map((collection, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <span>{getStatusIcon(collection)}</span>
                    <span className="font-medium text-sm">
                      {collection.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {getStatusText(collection)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-2">
            <button
              onClick={checkCollections}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "🔍 Verificar Coleções"}
            </button>

            {existingCount < totalCount && (
              <button
                onClick={createSampleData}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Criando..." : "📝 Criar Dados de Exemplo"}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
            💡 As coleções são criadas automaticamente quando o primeiro
            documento é adicionado.
          </div>
        </div>
      )}
    </>
  );
}
