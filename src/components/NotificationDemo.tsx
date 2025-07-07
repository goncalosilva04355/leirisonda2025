import React, { useState } from "react";
import { Bell, Briefcase, Users, CheckCircle } from "lucide-react";
import { useNotificationEvents } from "../hooks/useNotificationEvents";

export const NotificationDemo: React.FC = () => {
  const {
    notifyWorkCreated,
    notifyWorkUpdated,
    notifyUserCreated,
    notifyCustom,
    notifySyncSuccess,
  } = useNotificationEvents();

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateWork = async () => {
    setIsLoading(true);

    // Simular criação de trabalho
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Disparar evento simples para notificação
    window.dispatchEvent(
      new CustomEvent("worksUpdated", {
        detail: {
          type: "assignment",
          workId: `work-${Date.now()}`,
          workTitle: "Limpeza de Piscina Villa Marina",
          client: "Villa Marina Resort",
          location: "Cascais",
          startDate: "2024-01-15",
        },
      }),
    );

    setIsLoading(false);
  };

  const handleUpdateWork = () => {
    window.dispatchEvent(
      new CustomEvent("worksUpdated", {
        detail: {
          type: "assignment",
          workId: "work-123",
          workTitle: "Manutenção de Equipamentos Atualizada",
          client: "Hotel Paradise",
          location: "Estoril",
          startDate: "2024-01-20",
        },
      }),
    );
  };

  const handleCreateUser = () => {
    notifyUserCreated("Ana Rodrigues", "ana@leirisonda.com", "Gonçalo Fonseca");
  };

  const handleCustomNotification = () => {
    notifyCustom(
      "Sistema Atualizado",
      "Nova versão da aplicação disponível!",
      "success",
    );
  };

  const handleSyncNotification = () => {
    notifySyncSuccess("works", 25);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Demo do Sistema de Notificações
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        Teste as notificações em tempo real do sistema. Estas demonstrações
        mostram como as notificações aparecem quando trabalhos são atribuídos,
        utilizadores criados, ou outros eventos importantes acontecem.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleCreateWork}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <Briefcase className="w-4 h-4" />
          {isLoading ? "Criando..." : "Criar Trabalho com Atribuição"}
        </button>

        <button
          onClick={handleUpdateWork}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          Atualizar Trabalho
        </button>

        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors"
        >
          <Users className="w-4 h-4" />
          Criar Utilizador
        </button>

        <button
          onClick={handleCustomNotification}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          Notificação Customizada
        </button>

        <button
          onClick={handleSyncNotification}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Sincronização Completa
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Trabalhos:</strong> Notificações aparecem quando trabalhos
            são atribuídos ou atualizados
          </li>
          <li>
            • <strong>Utilizadores:</strong> Alertas quando novos utilizadores
            são criados
          </li>
          <li>
            • <strong>Sincronização:</strong> Status de sincronização em tempo
            real
          </li>
          <li>
            • <strong>Notificações:</strong> Sistema de notificações push
            instantâneas
          </li>
        </ul>
      </div>
    </div>
  );
};
