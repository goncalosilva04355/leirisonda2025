import React, { useEffect, useState } from "react";
import { useDataCleanup, useAppCleanupStatus } from "../hooks/useDataCleanup";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2, Trash2, CheckCircle, AlertTriangle } from "lucide-react";

interface AppInitializerProps {
  children: React.ReactNode;
  autoCleanOnStartup?: boolean;
}

export function AppInitializer({
  children,
  autoCleanOnStartup = false,
}: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCleanupPrompt, setShowCleanupPrompt] = useState(false);

  const { isLoading, initializeCleanApp, ensureUserSync, cleanupStats } =
    useDataCleanup();

  const { needsCleanup, hasData } = useAppCleanupStatus();

  useEffect(() => {
    const initializeApp = async () => {
      console.log("Initializing application...");

      // Check if we need to clean data
      if (autoCleanOnStartup && needsCleanup) {
        console.log("Auto-cleaning application data on startup...");
        await initializeCleanApp();
      } else if (needsCleanup && hasData) {
        // Show cleanup prompt if there's data but no auto-clean
        setShowCleanupPrompt(true);
        return; // Don't set initialized yet
      }

      // Ensure user synchronization is set up
      await ensureUserSync();

      setIsInitialized(true);
      console.log("Application initialization complete");
    };

    initializeApp();
  }, [
    autoCleanOnStartup,
    needsCleanup,
    hasData,
    initializeCleanApp,
    ensureUserSync,
  ]);

  const handleCleanAndContinue = async () => {
    setShowCleanupPrompt(false);
    await initializeCleanApp();
    await ensureUserSync();
    setIsInitialized(true);
  };

  const handleContinueWithData = async () => {
    setShowCleanupPrompt(false);
    await ensureUserSync();
    setIsInitialized(true);
  };

  // Show loading while initializing
  if (isLoading || (!isInitialized && !showCleanupPrompt)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  Inicializando Leirisonda
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  A configurar a aplicação e sincronização...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show cleanup prompt if needed
  if (showCleanupPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Dados Existentes Encontrados
            </CardTitle>
            <CardDescription>
              A aplicação contém dados de obras, manutenções e piscinas. Como
              pretende proceder?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Foi solicitado que a aplicação comece limpa de dados. Pode optar
                por limpar todos os dados existentes ou continuar com eles.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={handleCleanAndContinue}
                variant="destructive"
                className="w-full flex items-center gap-2"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Limpar Todos os Dados e Continuar
              </Button>

              <Button
                onClick={handleContinueWithData}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Manter Dados Existentes
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Última limpeza:{" "}
              {cleanupStats.lastCleanup
                ? new Date(cleanupStats.lastCleanup).toLocaleString("pt-PT")
                : "Nunca"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // App is initialized, show success message briefly then render children
  if (isInitialized) {
    return (
      <div>
        {/* Success message */}
        <div className="fixed top-4 right-4 z-50">
          <Alert className="border-green-200 bg-green-50 w-80">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Aplicação inicializada com sucesso!
            </AlertDescription>
          </Alert>
        </div>

        {/* Main application */}
        {children}
      </div>
    );
  }

  return null;
}

export default AppInitializer;
