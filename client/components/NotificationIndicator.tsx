import React from "react";
import { Bell, BellOff, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationIndicator() {
  const { status, isLoading } = useNotifications();

  const getIcon = () => {
    if (isLoading) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    if (status.isEnabled && status.isInitialized)
      return <Bell className="w-4 h-4 text-green-500" />;
    return <BellOff className="w-4 h-4 text-gray-400" />;
  };

  const getStatus = () => {
    if (isLoading) return "A verificar...";
    if (status.isEnabled && status.isInitialized) return "Ativadas";
    if (status.permission === "denied") return "Bloqueadas";
    return "Desativadas";
  };

  const getColor = () => {
    if (isLoading) return "yellow";
    if (status.isEnabled && status.isInitialized) return "green";
    if (status.permission === "denied") return "red";
    return "gray";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {getIcon()}
            <Badge
              variant="outline"
              className={`text-xs ${
                getColor() === "green"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : getColor() === "red"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : getColor() === "yellow"
                      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              {getStatus()}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              <strong>Notificações:</strong> {getStatus()}
            </p>
            {status.isSupported ? (
              <p className="text-green-600">✓ Suportadas no dispositivo</p>
            ) : (
              <p className="text-red-600">✗ Não suportadas</p>
            )}
            {status.hasToken && (
              <p className="text-blue-600">✓ Token registado</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
