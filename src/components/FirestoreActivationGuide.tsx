import React, { useState } from "react";
import {
  AlertTriangle,
  Database,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export const FirestoreActivationGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            🔥 Firestore Database Não Ativado
          </h3>
          <p className="text-sm text-orange-700 mt-1">
            O serviço Firestore não está disponível no projeto Firebase.
            <strong>
              {" "}
              Os utilizadores funcionam apenas neste dispositivo.
            </strong>
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-orange-800 hover:text-orange-900 underline"
          >
            {isExpanded ? "Ocultar instruções" : "Ver como ativar Firestore →"}
          </button>

          {isExpanded && (
            <div className="mt-4 p-4 bg-white rounded-md border">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Como Ativar Firestore Database:
              </h4>

              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong>Abra o Firebase Console:</strong>
                    <br />
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                    >
                      console.firebase.google.com
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong>Selecione o projeto:</strong> leirisonda-16f8b
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong>No menu lateral, clique em:</strong> "Firestore
                    Database"
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong>Clique em:</strong> "Create database" (se aparecer)
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    5
                  </span>
                  <div>
                    <strong>Escolha:</strong> "Start in test mode" (mais fácil
                    para começar)
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    6
                  </span>
                  <div>
                    <strong>Selecione região:</strong> "europe-west1" ou similar
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong>Clique "Done" e aguarde</strong> a criação da
                    database
                  </div>
                </li>
              </ol>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                  <div className="text-sm text-blue-800">
                    <strong>Após ativar:</strong> Volte à app e os utilizadores
                    funcionarão em qualquer dispositivo automaticamente!
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-600">
                <strong>Nota:</strong> Sem Firestore, os utilizadores funcionam
                apenas no dispositivo onde foram criados.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirestoreActivationGuide;
