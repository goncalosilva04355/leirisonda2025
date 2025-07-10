import React, { useState } from "react";
import { AlertTriangle, ExternalLink, Copy, CheckCircle } from "lucide-react";

export const FirebaseRulesGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (TEMPORÁRIO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">
          Publicar Regras do Firebase
        </h2>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <p className="text-orange-800">
          <strong>Problema detectado:</strong> As regras do Firestore não estão
          publicadas. Isto impede a aplicação de conectar à base de dados.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Passo 1: Abrir Firebase Console
          </h3>
          <a
            href="https://console.firebase.google.com/project/leiria-1cfc9/firestore/rules"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Regras do Firestore
          </a>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Passo 2: Copiar e Colar as Regras
          </h3>
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(firestoreRules)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
              title="Copiar regras"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{firestoreRules}</code>
            </pre>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ⚠️ <strong>Nota:</strong> Estas regras permitem acesso total (apenas
            para desenvolvimento). Em produção, deve configurar regras mais
            seguras.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Passo 3: Publicar as Regras
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Cole as regras no editor do Firebase Console</li>
              <li>
                Clique no botão <strong>"Publicar"</strong> (Publish)
              </li>
              <li>Confirme a publicação das regras</li>
              <li>Aguarde alguns segundos para as regras ficarem ativas</li>
            </ol>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Passo 4: Configurar Storage (Opcional)
          </h3>
          <p className="text-gray-600 mb-3">
            Se também precisar do Firebase Storage, configure as suas regras:
          </p>
          <a
            href="https://console.firebase.google.com/project/leiria-1cfc9/storage/rules"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mb-3"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Regras do Storage
          </a>

          <div className="bg-gray-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(storageRules)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
              title="Copiar regras do storage"
            >
              <Copy className="h-4 w-4" />
            </button>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{storageRules}</code>
            </pre>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Após publicar as regras:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-green-700">
            <li>A aplicação deve conectar automaticamente</li>
            <li>O login deve funcionar sem erros</li>
            <li>Os dados serão sincronizados com o Firestore</li>
            <li>Recarregue a página se necessário</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
