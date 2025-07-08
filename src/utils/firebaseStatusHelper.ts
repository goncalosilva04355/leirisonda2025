import { getFirebaseStatus } from "../firebase/config";

export interface FirebaseStatusInfo {
  isOnline: boolean;
  isFirebaseReady: boolean;
  isQuotaExceeded: boolean;
  statusMessage: string;
  statusType: "success" | "warning" | "error" | "info";
  actionRequired: boolean;
  userFriendlyMessage: string;
}

export function getDetailedFirebaseStatus(): FirebaseStatusInfo {
  const firebaseStatus = getFirebaseStatus();
  const isOnline = navigator.onLine;

  // Firebase is working perfectly
  if (firebaseStatus.ready && isOnline) {
    return {
      isOnline: true,
      isFirebaseReady: true,
      isQuotaExceeded: false,
      statusMessage: "Firebase connected",
      statusType: "success",
      actionRequired: false,
      userFriendlyMessage: "Todos os dados estão sincronizados",
    };
  }

  // Quota exceeded
  if (firebaseStatus.quotaExceeded) {
    return {
      isOnline: isOnline,
      isFirebaseReady: false,
      isQuotaExceeded: true,
      statusMessage: "Firebase quota exceeded",
      statusType: "warning",
      actionRequired: false,
      userFriendlyMessage:
        "Sincronização temporariamente pausada - funcionando em modo local",
    };
  }

  // No internet connection
  if (!isOnline) {
    return {
      isOnline: false,
      isFirebaseReady: false,
      isQuotaExceeded: false,
      statusMessage: "No internet connection",
      statusType: "warning",
      actionRequired: false,
      userFriendlyMessage: "Sem internet - dados salvos localmente",
    };
  }

  // Internet available but Firebase not ready
  if (isOnline && !firebaseStatus.ready) {
    return {
      isOnline: true,
      isFirebaseReady: false,
      isQuotaExceeded: false,
      statusMessage: "Firebase connecting",
      statusType: "info",
      actionRequired: true,
      userFriendlyMessage:
        "Conectando ao servidor - alguns recursos podem estar limitados",
    };
  }

  // Unknown state
  return {
    isOnline: isOnline,
    isFirebaseReady: firebaseStatus.ready,
    isQuotaExceeded: firebaseStatus.quotaExceeded,
    statusMessage: "Unknown status",
    statusType: "error",
    actionRequired: true,
    userFriendlyMessage: "Estado da conexão desconhecido",
  };
}

export function shouldShowFirebaseError(): boolean {
  const status = getDetailedFirebaseStatus();
  // Only show error if we're online but Firebase is not ready and it's not quota exceeded
  return status.isOnline && !status.isFirebaseReady && !status.isQuotaExceeded;
}

export function getFirebaseErrorMessage(): string {
  const status = getDetailedFirebaseStatus();

  if (!status.isOnline) {
    return "📱 Modo offline ativo - dados guardados localmente";
  }

  if (status.isQuotaExceeded) {
    return "⏸️ Sincronização pausada - modo local ativo";
  }

  if (status.isOnline && !status.isFirebaseReady) {
    return "🔄 A conectar ao servidor...";
  }

  return status.userFriendlyMessage;
}

// Helper function to replace the old error messages
export function handleFirebaseUnavailable(
  operationName: string = "operação",
): void {
  const status = getDetailedFirebaseStatus();

  if (!status.isOnline) {
    console.log(`📱 ${operationName} - modo offline (dados salvos localmente)`);
  } else if (status.isQuotaExceeded) {
    console.log(`⏸️ ${operationName} - quota Firebase excedida (modo local)`);
  } else if (!status.isFirebaseReady) {
    console.log(
      `🔄 ${operationName} - Firebase a conectar (aguarde ou use modo local)`,
    );
  } else {
    console.log(`✅ ${operationName} - Firebase disponível`);
  }
}
