import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  isPrivateBrowsing,
  storageUtils,
  safeLocalStorage,
} from "../utils/storageUtils";

export const PrivateBrowsingTest: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [storageTest, setStorageTest] = useState<{
    localStorage: boolean;
    sessionStorage: boolean;
    memory: boolean;
  }>({ localStorage: false, sessionStorage: false, memory: false });

  useEffect(() => {
    // Test private browsing detection
    setIsPrivate(isPrivateBrowsing());

    // Test storage functionality
    const testKey = "__test_storage__";
    const testValue = "test_value_" + Date.now();

    // Test localStorage
    const localStorageSuccess = safeLocalStorage.setItem(testKey, testValue);
    const localStorageRead = safeLocalStorage.getItem(testKey) === testValue;

    // Test JSON storage
    const jsonTestSuccess = storageUtils.setJson(testKey + "_json", {
      test: true,
    });
    const jsonData = storageUtils.getJson(testKey + "_json") as any;
    const jsonTestRead =
      jsonData && typeof jsonData === "object" && jsonData.test === true;

    setStorageTest({
      localStorage: localStorageSuccess && localStorageRead,
      sessionStorage: jsonTestSuccess && jsonTestRead,
      memory: safeLocalStorage.isUsingMemoryFallback(),
    });

    // Cleanup
    safeLocalStorage.removeItem(testKey);
    safeLocalStorage.removeItem(testKey + "_json");
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Teste de Modo Privado
          <Badge variant={isPrivate ? "destructive" : "default"}>
            {isPrivate ? "Privado" : "Normal"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            {isPrivate
              ? "🔒 Modo de navegação privada detectado. A aplicação está a funcionar com storage em memória."
              : "✅ Modo de navegação normal. A aplicação está a funcionar com localStorage completo."}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-semibold">Estado do Storage:</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>localStorage:</span>
              <Badge
                variant={storageTest.localStorage ? "default" : "destructive"}
              >
                {storageTest.localStorage ? "✅ OK" : "❌ Falhou"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Storage JSON:</span>
              <Badge
                variant={storageTest.sessionStorage ? "default" : "destructive"}
              >
                {storageTest.sessionStorage ? "✅ OK" : "❌ Falhou"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Fallback ativo:</span>
              <Badge variant={storageTest.memory ? "secondary" : "default"}>
                {storageTest.memory ? "✅ Sim" : "❌ Não"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {isPrivate
            ? "A aplicação está a funcionar normalmente em modo privado usando storage em memória como fallback."
            : "A aplicação está a usar localStorage nativo para persistência de dados."}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivateBrowsingTest;
