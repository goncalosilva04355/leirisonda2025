import React from "react";

interface FirestoreInstructionsProps {
  projectId: string;
}

export const FirestoreInstructions: React.FC<FirestoreInstructionsProps> = ({
  projectId,
}) => {
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore`;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-blue-800 mb-4">
        🔧 Como Habilitar o Firestore
      </h3>

      <div className="space-y-4 text-blue-700">
        <p className="font-medium">
          O Firestore não está habilitado no projeto{" "}
          <code className="bg-blue-100 px-2 py-1 rounded">{projectId}</code>
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold">Passos para habilitar:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Aceda ao Firebase Console do projeto</li>
            <li>No menu lateral, clique em "Firestore Database"</li>
            <li>Clique em "Criar base de dados"</li>
            <li>Escolha "Começar em modo de teste" (para desenvolvimento)</li>
            <li>Selecione uma localização (recomendado: europe-west1)</li>
            <li>Aguarde a criação da base de dados</li>
          </ol>
        </div>

        <div className="mt-4">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🚀 Abrir Firebase Console
          </a>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm">
            <strong>Nota:</strong> Após habilitar o Firestore, recarregue esta
            página e execute o teste novamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirestoreInstructions;
