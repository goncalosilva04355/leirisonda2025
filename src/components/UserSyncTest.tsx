import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { forceSyncToAppUsers } from "../config/authorizedUsers";
import { storageUtils } from "../utils/storageUtils";

export const UserSyncTest: React.FC = () => {
  const [authorizedUsers, setAuthorizedUsers] = useState<any[]>([]);
  const [appUsers, setAppUsers] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<string>("");

  const loadUserData = () => {
    try {
      const authUsers = storageUtils.getJson("authorizedUsers", []);
      const appUsersData = storageUtils.getJson("app-users", []);

      setAuthorizedUsers(authUsers);
      setAppUsers(appUsersData);

      console.log("📊 Authorized Users:", authUsers.length);
      console.log("📊 App Users:", appUsersData.length);
    } catch (error) {
      console.error("❌ Erro ao carregar dados de utilizadores:", error);
    }
  };

  const forceSyncUsers = async () => {
    try {
      setSyncStatus("🔄 Sincronizando...");
      await forceSyncToAppUsers();
      loadUserData();
      setSyncStatus("✅ Sincronização completa!");
      setTimeout(() => setSyncStatus(""), 3000);
    } catch (error) {
      console.error("❌ Erro na sincronização:", error);
      setSyncStatus("❌ Erro na sincronização");
      setTimeout(() => setSyncStatus(""), 3000);
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for user changes
    const handleUserChanges = () => {
      console.log("🔄 Utilizadores alterados, recarregando dados...");
      loadUserData();
    };

    window.addEventListener("authorizedUsersChanged", handleUserChanges);
    window.addEventListener("usersUpdated", handleUserChanges);

    return () => {
      window.removeEventListener("authorizedUsersChanged", handleUserChanges);
      window.removeEventListener("usersUpdated", handleUserChanges);
    };
  }, []);

  const isInSync =
    authorizedUsers.length > 0 && appUsers.length >= authorizedUsers.length;

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔄 Estado da Sincronização
          <Badge variant={isInSync ? "default" : "destructive"}>
            {isInSync ? "Em Sync" : "Dessincronizado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {syncStatus && (
          <Alert>
            <AlertDescription>{syncStatus}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Utilizadores Autorizados:</span>
            <Badge variant="outline">{authorizedUsers.length}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span>App Users:</span>
            <Badge variant="outline">{appUsers.length}</Badge>
          </div>

          <Button
            onClick={forceSyncUsers}
            className="w-full"
            variant={isInSync ? "outline" : "default"}
          >
            {isInSync ? "Ressincronizar" : "Forçar Sincronização"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            Authorized Users: {authorizedUsers.map((u) => u.name).join(", ")}
          </div>
          <div>App Users: {appUsers.map((u) => u.name).join(", ")}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSyncTest;
