import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationSettings } from "@/components/NotificationSettings";

export function NotificationSettingsPage() {
  return (
    <div className="leirisonda-main">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <Link to="/dashboard" className="lg:hidden">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Settings className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="page-title">Configurações de Notificações</h1>
              <p className="page-subtitle">
                Gerir como e quando recebe notificações
              </p>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="space-y-6">
          <NotificationSettings />

          {/* Informações adicionais */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Como funcionam as notificações?
            </h3>
            <div className="space-y-2 text-blue-700">
              <p>
                📱 <strong>Obras Atribuídas:</strong> Recebe uma notificação
                quando uma obra lhe é atribuída
              </p>
              <p>
                🔄 <strong>Mudanças de Status:</strong> Notificações quando o
                status das suas obras muda
              </p>
              <p>
                ⚡ <strong>Instantâneo:</strong> As notificações chegam em tempo
                real
              </p>
              <p>
                🔒 <strong>Privacidade:</strong> Apenas recebe notificações das
                obras que lhe foram atribuídas
              </p>
            </div>
          </div>

          {/* Resolução de problemas */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              Resolução de Problemas
            </h3>
            <div className="space-y-3 text-yellow-700 text-sm">
              <div>
                <p>
                  <strong>Não recebo notificações:</strong>
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Verifique se as permissões estão ativadas</li>
                  <li>Confirme que o token está registado</li>
                  <li>Teste com o botão "Testar Notificação"</li>
                  <li>
                    Verifique as configurações do seu navegador/dispositivo
                  </li>
                </ul>
              </div>

              <div>
                <p>
                  <strong>Navegadores suportados:</strong>
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Chrome/Chromium (recomendado)</li>
                  <li>Firefox</li>
                  <li>Safari (iOS 16.4+)</li>
                  <li>Edge</li>
                </ul>
              </div>

              <div>
                <p>
                  <strong>Dispositivos móveis:</strong>
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Android: Funciona em todos os navegadores</li>
                  <li>iOS: Requer Safari ou app nativo</li>
                  <li>App nativo: Suporte completo em iOS e Android</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
