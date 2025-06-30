import React from "react";
import { Badge } from "@/components/ui/badge";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { RefreshCw, Wifi, WifiOff, Cloud } from "lucide-react";

export function SyncNotification() {
  const { isOnline, isSyncing, isFirebaseAvailable } = useFirebaseSync();

  // Apenas mostrar status badges discretos, sem notificações popup
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2">
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {isOnline ? "Online" : "Offline"}
        </Badge>
        {isFirebaseAvailable && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            Firebase
          </Badge>
        )}
        {isSyncing && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Sincronizando
          </Badge>
        )}
      </div>
    </div>
  );
}
