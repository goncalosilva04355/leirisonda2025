import React from "react";
import {
  Bell,
  BellOff,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/use-notifications";
import { Capacitor } from "@capacitor/core";

export function NotificationSettings() {
  const {
    status,
    isLoading,
    requestPermission,
    disableNotifications,
    showNotification,
    checkStatus,
  } = useNotifications();

  const handleEnableNotifications = async () => {
    const success = await requestPermission();
    if (success) {
      // Mostrar notificação de teste
      await showNotification(
        "🎉 Notificações Ativadas!",
        "Agora receberá notificações quando obras lhe forem atribuídas.",
        { type: "welcome" },
      );
    }
  };

  const handleTestNotification = async () => {
    await showNotification(
      "🧪 Notificação de Teste",
      "Esta é uma notificação de teste da Leirisonda.",
      { type: "test" },
    );
  };

  const getStatusIcon = () => {
    if (isLoading) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    if (status.isEnabled && status.isInitialized)
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status.permission === "denied")
      return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return "A verificar...";
    if (status.isEnabled && status.isInitialized) return "Ativadas";
    if (status.permission === "denied") return "Bloqueadas";
    if (status.permission === "default") return "Não configuradas";
    return "Desativadas";
  };

  const getStatusColor = () => {
    if (isLoading) return "warning";
    if (status.isEnabled && status.isInitialized) return "success";
    if (status.permission === "denied") return "destructive";
    return "secondary";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-500" />
            <div>
              <CardTitle>Notificações Push</CardTitle>
              <CardDescription>
                Receba notificações quando obras lhe forem atribuídas
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor() as any}>{getStatusText()}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status das notificações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Suporte do Dispositivo
            </Label>
            <div className="flex items-center gap-2">
              {status.isSupported ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">
                {status.isSupported ? "Suportadas" : "Não suportadas"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Dispositivo</Label>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span className="text-sm">
                {Capacitor.isNativePlatform() ? "App Nativo" : "Navegador Web"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Permissão</Label>
            <div className="flex items-center gap-2">
              {status.permission === "granted" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : status.permission === "denied" ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-sm capitalize">
                {status.permission === "granted"
                  ? "Concedida"
                  : status.permission === "denied"
                    ? "Negada"
                    : "Não pedida"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Token</Label>
            <div className="flex items-center gap-2">
              {status.hasToken ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">
                {status.hasToken ? "Registado" : "Não registado"}
              </span>
            </div>
          </div>
        </div>

        {/* Alertas informativos */}
        {!status.isSupported && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Este dispositivo ou navegador não suporta notificações push.
            </AlertDescription>
          </Alert>
        )}

        {status.permission === "denied" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              As notificações foram bloqueadas. Para ativar, vá às configurações
              do seu navegador ou dispositivo e permita notificações para este
              site.
            </AlertDescription>
          </Alert>
        )}

        {status.isSupported && status.permission === "default" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ative as notificações para receber alertas quando obras lhe forem
              atribuídas.
            </AlertDescription>
          </Alert>
        )}

        {status.isEnabled && status.isInitialized && (
          <Alert variant="default" className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              As notificações estão ativas! Receberá alertas quando obras lhe
              forem atribuídas.
            </AlertDescription>
          </Alert>
        )}

        {/* Controlos */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!status.isEnabled &&
            status.isSupported &&
            status.permission !== "denied" && (
              <Button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Ativar Notificações
              </Button>
            )}

          {status.isEnabled && status.isInitialized && (
            <>
              <Button
                onClick={handleTestNotification}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Testar Notificação
              </Button>

              <Button
                onClick={disableNotifications}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <BellOff className="w-4 h-4" />
                Desativar
              </Button>
            </>
          )}

          <Button
            onClick={checkStatus}
            variant="ghost"
            size="sm"
            disabled={isLoading}
          >
            🔄 Verificar Status
          </Button>
        </div>

        {/* Informações adicionais */}
        <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
          <p>
            • As notificações funcionam mesmo quando a aplicação está fechada
          </p>
          <p>
            • Em dispositivos móveis, certifique-se que as notificações estão
            ativadas nas configurações
          </p>
          <p>• Pode desativar as notificações a qualquer momento</p>
        </div>
      </CardContent>
    </Card>
  );
}
