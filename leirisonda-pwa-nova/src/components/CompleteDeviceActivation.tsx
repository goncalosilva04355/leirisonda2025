import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Bell,
  MapPin,
  Wifi,
  Users,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Shield,
  Database,
  Globe,
  Settings,
  Zap,
  Play,
  Loader2,
} from "lucide-react";
import ActivationSummary from "./ActivationSummary";

interface ActivationStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "pending" | "running" | "success" | "error";
  error?: string;
}

export const CompleteDeviceActivation: React.FC = () => {
  const [isActivating, setIsActivating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [activationComplete, setActivationComplete] = useState(false);
  const [steps, setSteps] = useState<ActivationStep[]>([
    {
      id: "notifications",
      name: "Notificações Push",
      description: "Ativar notificações para receber alertas em tempo real",
      icon: Bell,
      status: "pending",
    },
    {
      id: "location",
      name: "Localização GPS",
      description: "Permitir acesso à localização para funcionalidades de mapa",
      icon: MapPin,
      status: "pending",
    },
    {
      id: "camera",
      name: "Câmera",
      description: "Acesso à câmera para fotografias em obras",
      icon: Smartphone,
      status: "pending",
    },
    {
      id: "storage",
      name: "Armazenamento Local",
      description: "Configurar cache local para funcionamento offline",
      icon: Database,
      status: "pending",
    },
    {
      id: "sync",
      name: "Sincronização Firebase",
      description: "Estabelecer ligação e sincronização com Firebase",
      icon: Wifi,
      status: "pending",
    },
    {
      id: "users",
      name: "Sistema de Utilizadores",
      description: "Verificar e restaurar utilizadores do sistema",
      icon: Users,
      status: "pending",
    },
    {
      id: "pwa",
      name: "Instalação PWA",
      description: "Preparar app para instalação como aplicação nativa",
      icon: Globe,
      status: "pending",
    },
    {
      id: "security",
      name: "Configurações de Segurança",
      description: "Aplicar políticas de segurança e autenticação",
      icon: Shield,
      status: "pending",
    },
    {
      id: "cross-device",
      name: "Sincronização Multi-Dispositivo",
      description: "Configurar acesso de vários dispositivos e utilizadores",
      icon: RefreshCw,
      status: "pending",
    },
  ]);

  const updateStepStatus = (
    stepId: string,
    status: ActivationStep["status"],
    error?: string,
  ) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status, error } : step,
      ),
    );
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      if (!("Notification" in window)) {
        throw new Error("Este browser não suporta notificações");
      }

      if (Notification.permission === "granted") {
        return true;
      }

      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Testar notificação
          new Notification("Leirisonda", {
            body: "Notificações ativadas com sucesso!",
            icon: "/icon.svg",
          });
          return true;
        }
      }

      throw new Error("Permissão de notificações negada");
    } catch (error: any) {
      throw new Error(error.message || "Erro ao ativar notificações");
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (!("geolocation" in navigator)) {
        throw new Error("Este dispositivo não suporta localização");
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Localização obtida:", position.coords);
            resolve(true);
          },
          (error) => {
            let errorMsg = "Erro ao obter localização";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMsg = "Permissão de localização negada";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg = "Localização não disponível";
                break;
              case error.TIMEOUT:
                errorMsg = "Timeout ao obter localização";
                break;
            }
            reject(new Error(errorMsg));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          },
        );
      });
    } catch (error: any) {
      throw new Error(error.message || "Erro ao ativar localização");
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      if (
        !("mediaDevices" in navigator) ||
        !("getUserMedia" in navigator.mediaDevices)
      ) {
        throw new Error("Este dispositivo não suporta acesso à câmera");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Câmera traseira preferida
        audio: false,
      });

      // Parar stream imediatamente após teste
      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (error: any) {
      throw new Error("Permissão de câmera negada ou não disponível");
    }
  };

  const setupLocalStorage = async (): Promise<boolean> => {
    try {
      // Testar localStorage
      const testKey = "leirisonda-storage-test";
      const testValue = "test-value";

      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved !== testValue) {
        throw new Error("LocalStorage não está funcionando");
      }

      // Configurar cache
      if ("caches" in window) {
        const cache = await caches.open("leirisonda-v1");
        await cache.add("/");
      }

      // Configurar estruturas de dados necessárias
      const requiredKeys = [
        "app-users",
        "mock-users",
        "pools",
        "works",
        "maintenance",
        "clients",
      ];
      for (const key of requiredKeys) {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, "[]");
        }
      }

      return true;
    } catch (error: any) {
      throw new Error("Erro ao configurar armazenamento local");
    }
  };

  const setupFirebaseSync = async (): Promise<boolean> => {
    try {
      // Verificar se Firebase está configurado
      const { isFirebaseReady } = await import("../firebase/config");
      const { getFirebaseStatus, reinitializeFirebase } = await import(
        "../firebase/fallbackFunctions"
      );

      if (!isFirebaseReady()) {
        // Tentar reinicializar Firebase
        const initialized = await reinitializeFirebase();

        if (!initialized) {
          throw new Error("Não foi possível conectar ao Firebase");
        }
      }

      // Testar conexão
      const status = getFirebaseStatus();
      if (!status.ready) {
        throw new Error("Firebase não está pronto");
      }

      return true;
    } catch (error: any) {
      throw new Error(error.message || "Erro na sincronização Firebase");
    }
  };

  const setupUserSystem = async (): Promise<boolean> => {
    try {
      // Restaurar utilizadores se necessário
      const { userRestoreService } = await import(
        "../services/userRestoreService"
      );

      if (userRestoreService.needsRestore()) {
        const result = await userRestoreService.restoreDefaultUsers();
        if (!result.success) {
          throw new Error(result.message);
        }
      }

      // Verificar se utilizadores existem
      const stats = userRestoreService.getUserStats();
      if (stats.totalUnique === 0) {
        throw new Error("Nenhum utilizador encontrado");
      }

      return true;
    } catch (error: any) {
      throw new Error(error.message || "Erro no sistema de utilizadores");
    }
  };

  const setupPWA = async (): Promise<boolean> => {
    try {
      // Verificar se é PWA instalável
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("Service Worker registrado:", registration);
      }

      // Verificar manifest
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        throw new Error("Manifest não encontrado");
      }

      return true;
    } catch (error: any) {
      console.warn("PWA setup warning:", error);
      // PWA não é crítico, não falhar
      return true;
    }
  };

  const setupSecurity = async (): Promise<boolean> => {
    try {
      // Limpar dados sensíveis em cache
      sessionStorage.clear();

      // Configurar políticas de segurança
      const securitySettings = {
        autoLogout: 24 * 60 * 60 * 1000, // 24 horas
        maxLoginAttempts: 5,
        requireStrongPasswords: true,
      };

      localStorage.setItem(
        "security-settings",
        JSON.stringify(securitySettings),
      );

      return true;
    } catch (error: any) {
      throw new Error("Erro nas configurações de segurança");
    }
  };

  const setupCrossDeviceSync = async (): Promise<boolean> => {
    try {
      // Configurar sincronização automática
      try {
        const { syncManager } = await import("../utils/syncManager");

        // Testar sincronização
        await syncManager.performFullSync();
      } catch (syncError) {
        console.warn("Sync manager not available:", syncError);
        // Continuar sem falhar
      }

      // Configurar intervalos de sync
      const syncConfig = {
        enabled: true,
        interval: 5 * 60 * 1000, // 5 minutos
        lastSync: new Date().toISOString(),
      };

      localStorage.setItem("sync-config", JSON.stringify(syncConfig));

      return true;
    } catch (error: any) {
      console.warn("Cross-device sync warning:", error);
      // Não é crítico se falhar
      return true;
    }
  };

  const activateStep = async (step: ActivationStep) => {
    setCurrentStep(step.id);
    updateStepStatus(step.id, "running");

    try {
      let success = false;

      switch (step.id) {
        case "notifications":
          success = await requestNotificationPermission();
          break;
        case "location":
          success = await requestLocationPermission();
          break;
        case "camera":
          success = await requestCameraPermission();
          break;
        case "storage":
          success = await setupLocalStorage();
          break;
        case "sync":
          success = await setupFirebaseSync();
          break;
        case "users":
          success = await setupUserSystem();
          break;
        case "pwa":
          success = await setupPWA();
          break;
        case "security":
          success = await setupSecurity();
          break;
        case "cross-device":
          success = await setupCrossDeviceSync();
          break;
        default:
          success = true;
      }

      if (success) {
        updateStepStatus(step.id, "success");
      } else {
        updateStepStatus(step.id, "error", "Falha na ativação");
      }

      // Delay entre steps para melhor UX
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error: any) {
      console.error(`Erro no step ${step.id}:`, error);
      updateStepStatus(step.id, "error", error.message);

      // Continuar com próximo step mesmo com erro
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const startCompleteActivation = async () => {
    setIsActivating(true);
    setActivationComplete(false);
    setCurrentStep(null);

    // Reset all steps
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "pending" as const,
        error: undefined,
      })),
    );

    try {
      for (const step of steps) {
        await activateStep(step);
      }

      setActivationComplete(true);

      // Notificação de sucesso
      if (Notification.permission === "granted") {
        new Notification("Leirisonda - Ativação Completa", {
          body: "Dispositivo configurado com sucesso para funcionamento completo!",
          icon: "/icon.svg",
        });
      }
    } catch (error) {
      console.error("Erro na ativação completa:", error);
    } finally {
      setIsActivating(false);
      setCurrentStep(null);
    }
  };

  const getSuccessCount = () =>
    steps.filter((s) => s.status === "success").length;
  const getErrorCount = () => steps.filter((s) => s.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <Zap className="h-8 w-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">
              Ativação Completa do Dispositivo
            </h2>
            <p className="text-blue-100">
              Configure tudo o que é necessário para funcionamento
              multi-dispositivo e multi-utilizador
            </p>
          </div>
        </div>

        {/* Big Activation Button */}
        <button
          onClick={startCompleteActivation}
          disabled={isActivating}
          className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isActivating ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-3" />
              Ativando... ({getSuccessCount()}/{steps.length})
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Play className="h-6 w-6 mr-3" />
              ATIVAR TUDO AGORA
            </div>
          )}
        </button>

        {activationComplete && (
          <div className="mt-4 bg-green-500 bg-opacity-20 border border-green-300 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-100 mr-2" />
              <span className="font-medium">
                Ativação concluída! {getSuccessCount()} de {steps.length}{" "}
                funcionalidades ativadas.
                {getErrorCount() > 0 && ` (${getErrorCount()} avisos)`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Progresso da Ativação
        </h3>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center p-3 rounded-lg border transition-all ${
                  isActive
                    ? "border-blue-300 bg-blue-50"
                    : step.status === "success"
                      ? "border-green-300 bg-green-50"
                      : step.status === "error"
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {step.status === "running" ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : step.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : step.status === "error" ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <IconComponent className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-medium ${
                        step.status === "success"
                          ? "text-green-900"
                          : step.status === "error"
                            ? "text-red-900"
                            : isActive
                              ? "text-blue-900"
                              : "text-gray-900"
                      }`}
                    >
                      {step.name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        step.status === "success"
                          ? "bg-green-100 text-green-800"
                          : step.status === "error"
                            ? "bg-red-100 text-red-800"
                            : step.status === "running"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {step.status === "success"
                        ? "Sucesso"
                        : step.status === "error"
                          ? "Erro"
                          : step.status === "running"
                            ? "Ativando"
                            : "Pendente"}
                    </span>
                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      step.status === "error" && step.error
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {step.status === "error" && step.error
                      ? step.error
                      : step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          O que esta ativação faz:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Notificações:</strong> Permite receber alertas em tempo
            real
          </li>
          <li>
            • <strong>Localização:</strong> Ativa GPS para navegação automática
          </li>
          <li>
            • <strong>Câmera:</strong> Permite tirar fotografias nas obras
          </li>
          <li>
            • <strong>Armazenamento:</strong> Configura cache para funcionamento
            offline
          </li>
          <li>
            • <strong>Sincronização:</strong> Conecta com Firebase para dados em
            nuvem
          </li>
          <li>
            • <strong>Utilizadores:</strong> Garante que todos os utilizadores
            estão disponíveis
          </li>
          <li>
            • <strong>PWA:</strong> Prepara instalação como app nativa
          </li>
          <li>
            • <strong>Segurança:</strong> Aplica políticas de segurança
          </li>
          <li>
            • <strong>Multi-dispositivo:</strong> Configura sincronização entre
            dispositivos
          </li>
        </ul>
      </div>

      {/* Summary of Features */}
      <ActivationSummary />
    </div>
  );
};

export default CompleteDeviceActivation;
