import React from "react";

interface FirestoreSetupGuideProps {
  projectId: string;
  onClose: () => void;
}

export const FirestoreSetupGuide: React.FC<FirestoreSetupGuideProps> = ({
  projectId,
  onClose,
}) => {
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-700">
            🚨 Firestore Não Está Habilitado
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-800 mb-2">
              Problema Identificado:
            </h3>
            <p className="text-red-700">
              O serviço Firestore não existe no projeto{" "}
              <code className="bg-red-100 px-2 py-1 rounded">{projectId}</code>.
              Por isso, a aplicação não consegue guardar dados.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-4">
              Solução (5 passos simples):
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Abra o Firebase Console</p>
                  <a
                    href={consoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🚀 Abrir Firebase Console
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Clique em "Create database"</p>
                  <p className="text-sm text-gray-600">
                    Vai aparecer um botão azul com este texto
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Escolha "Start in test mode"</p>
                  <p className="text-sm text-gray-600">
                    Para permitir leitura/escrita durante desenvolvimento
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Selecione localização</p>
                  <p className="text-sm text-gray-600">
                    Recomendado:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      europe-west3 (Frankfurt)
                    </code>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="font-medium">Aguarde criação</p>
                  <p className="text-sm text-gray-600">
                    Pode demorar 1-2 minutos. Depois volte aqui e teste
                    novamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">
              💡 Depois de criar o Firestore:
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• A aplicação irá funcionar automaticamente</li>
              <li>• Todos os dados serão guardados na nuvem</li>
              <li>• O sincronismo entre dispositivos vai funcionar</li>
              <li>• Os dados ficarão seguros e com backup automático</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fechar Instruções
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreSetupGuide;
