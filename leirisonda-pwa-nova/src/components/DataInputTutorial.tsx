import React, { useState } from "react";
import {
  HelpCircle,
  X,
  CheckCircle,
  User,
  Plus,
  Wrench,
  Waves,
} from "lucide-react";

export const DataInputTutorial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Passo 1: Fazer Login",
      content: (
        <div className="space-y-3">
          <p>Para inserir dados, primeiro precisa fazer login:</p>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="font-semibold text-blue-800">Credenciais de teste:</p>
            <p>
              📧 Email:{" "}
              <code className="bg-white px-2 py-1 rounded">
                teste@teste.com
              </code>
            </p>
            <p>
              🔐 Password:{" "}
              <code className="bg-white px-2 py-1 rounded">123</code>
            </p>
          </div>
          <p className="text-sm text-gray-600">
            💡 O sistema aceita qualquer email válido com password "123"
          </p>
        </div>
      ),
      icon: <User className="w-6 h-6" />,
    },
    {
      title: "Passo 2: Navegar para Criar Dados",
      content: (
        <div className="space-y-3">
          <p>Após login, use o menu para criar novos dados:</p>
          <div className="space-y-2">
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <Plus className="w-4 h-4 mr-2 text-green-600" />
              <span>Nova Obra</span>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <Plus className="w-4 h-4 mr-2 text-blue-600" />
              <span>Nova Piscina</span>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <Plus className="w-4 h-4 mr-2 text-orange-600" />
              <span>Nova Manutenção</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            💡 Clique no menu "☰" no canto superior esquerdo
          </p>
        </div>
      ),
      icon: <Plus className="w-6 h-6" />,
    },
    {
      title: "Passo 3: Preencher Formulários",
      content: (
        <div className="space-y-3">
          <p>Preencha os campos obrigatórios dos formulários:</p>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold">📝 Campos Típicos:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>Nome/Título</li>
                <li>Cliente</li>
                <li>Data</li>
                <li>Descrição</li>
                <li>Estado</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ⚠️ Campos com asterisco (*) são obrigatórios
          </p>
        </div>
      ),
      icon: <Wrench className="w-6 h-6" />,
    },
    {
      title: "Passo 4: Guardar Dados",
      content: (
        <div className="space-y-3">
          <p>Clique em "Guardar" para salvar os dados:</p>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">
                Dados Guardados!
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            💾 Os dados são guardados automaticamente no localStorage e
            sincronizados com o Firebase quando possível
          </p>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Dicas:</strong>
            </p>
            <ul className="list-disc list-inside text-sm mt-1 space-y-1 text-blue-700">
              <li>Dados são guardados mesmo sem internet</li>
              <li>Sincronização automática quando online</li>
              <li>Use F5 se encontrar problemas</li>
            </ul>
          </div>
        </div>
      ),
      icon: <CheckCircle className="w-6 h-6" />,
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-40"
        title="Tutorial: Como inserir dados"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Como Inserir Dados
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div
            className="bg-blue-500 h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
              {steps[currentStep].icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {steps[currentStep].title}
            </h3>
          </div>

          <div className="text-gray-600">{steps[currentStep].content}</div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {currentStep + 1} de {steps.length}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Concluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputTutorial;
