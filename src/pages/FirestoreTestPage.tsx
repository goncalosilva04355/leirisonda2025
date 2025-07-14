import React from "react";
import { FirestoreWriteTest } from "../components/FirestoreWriteTest";

export function FirestoreTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🔥 Página de Teste Firestore - Leirisonda
        </h1>

        <div className="mb-8">
          <FirestoreWriteTest />
        </div>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            📚 Como interpretar os resultados:
          </h2>

          <div className="space-y-4 text-gray-700">
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <h3 className="font-semibold text-green-800">
                ✅ Se todos os testes passarem:
              </h3>
              <p>
                O Firestore está funcionando perfeitamente e os dados estão
                sendo salvos.
              </p>
            </div>

            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <h3 className="font-semibold text-red-800">
                ❌ Se algum teste falhar:
              </h3>
              <p>
                Há um problema na configuração ou nas permissões do Firestore.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <h3 className="font-semibold text-yellow-800">
                ⚠️ Problemas comuns:
              </h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong>permission-denied:</strong> Regras do Firestore muito
                  restritivas
                </li>
                <li>
                  <strong>unavailable:</strong> Firestore não habilitado no
                  projeto
                </li>
                <li>
                  <strong>network-request-failed:</strong> Problema de
                  conectividade
                </li>
                <li>
                  <strong>invalid-api-key:</strong> Chave de API inválida
                </li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-semibold text-blue-800">🔍 Para debug:</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Abra o console do navegador (F12)</li>
                <li>Execute os testes e observe os logs</li>
                <li>Verifique se há erros na aba Console</li>
                <li>Verifique a aba Network para falhas de requisição</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800">
            🔧 Ações de correção:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700">
                Se Firestore não inicializa:
              </h4>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                <li>Verificar variáveis VITE_FIREBASE_*</li>
                <li>Confirmar projeto Firebase ativo</li>
                <li>Verificar se Firestore está habilitado</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">
                Se há erros de permissão:
              </h4>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                <li>Revisar firestore.rules</li>
                <li>Verificar autenticação</li>
                <li>Confirmar coleções permitidas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
