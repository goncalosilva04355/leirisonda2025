import React, { useState } from "react";
import {
  CheckCircle,
  ExternalLink,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export const FirestoreActivationSteps: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  const markStepComplete = (stepIndex: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[stepIndex] = !newCompleted[stepIndex];
    setCompletedSteps(newCompleted);
  };

  const steps = [
    {
      title: "Abrir Firebase Console",
      description: "Clique no link para abrir o Firebase Console",
      action: (
        <a
          href="https://console.firebase.google.com/project/leirisonda-16f8b/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir Console Firebase
        </a>
      ),
    },
    {
      title: "Encontrar Firestore Database",
      description: "No menu lateral esquerdo, procure por 'Firestore Database'",
      action: (
        <div className="text-sm text-gray-600">
          📍 Menu lateral → <strong>Firestore Database</strong> (não confundir
          com Realtime Database)
        </div>
      ),
    },
    {
      title: "Criar Base de Dados",
      description: "Clique no botão 'Create database' ou 'Criar base de dados'",
      action: (
        <div className="text-sm text-gray-600">
          💡 Procure um botão azul com texto <strong>"Create database"</strong>
        </div>
      ),
    },
    {
      title: "Escolher Modo de Teste",
      description: "Selecione 'Start in test mode' para começar rapidamente",
      action: (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          ⚠️ <strong>Importante:</strong> Escolha{" "}
          <strong>"Start in test mode"</strong> (não "production mode") para
          facilitar o setup inicial
        </div>
      ),
    },
    {
      title: "Escolher Localização",
      description:
        "Selecione uma região próxima (ex: europe-west1, europe-west3)",
      action: (
        <div className="text-sm text-gray-600">
          🌍 Recomendado para Portugal: <strong>europe-west1</strong> ou{" "}
          <strong>europe-west3</strong>
        </div>
      ),
    },
  ];

  const allStepsCompleted = completedSteps.every((step) => step);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">
          Como Ativar o Firestore Database
        </h3>
      </div>

      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
        <strong>🚨 Problema:</strong> O Firestore Database não está ativado no
        projeto Firebase.
        <br />
        <strong>💡 Solução:</strong> Siga estes passos para ativar:
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              completedSteps[index]
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => markStepComplete(index)}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  completedSteps[index]
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                {completedSteps[index] && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </button>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">
                  Passo {index + 1}: {step.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                {step.action}
              </div>

              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400 mt-6" />
              )}
            </div>
          </div>
        ))}
      </div>

      {allStepsCompleted && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <h4 className="font-medium text-green-800">
              ✅ Todos os passos concluídos!
            </h4>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Agora clique em <strong>"Re-testar"</strong> na verificação do
            Firestore para confirmar que está a funcionar.
          </p>
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <strong>💡 Dica:</strong> Após ativar o Firestore, o sistema irá
        automaticamente:
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li>Detectar que Firestore está disponível</li>
          <li>Migrar utilizadores do armazenamento local para Firestore</li>
          <li>Permitir login em qualquer dispositivo</li>
        </ul>
      </div>
    </div>
  );
};

export default FirestoreActivationSteps;
