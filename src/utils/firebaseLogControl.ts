// Sistema de controle de logs Firebase
// Reduz verbosidade quando Firestore não está disponível

interface LogControlState {
  firestoreUnavailableMessageShown: boolean;
  lastFirestoreCheck: number;
  suppressFirestoreErrors: boolean;
}

class FirebaseLogControl {
  private state: LogControlState = {
    firestoreUnavailableMessageShown: false,
    lastFirestoreCheck: 0,
    suppressFirestoreErrors: false,
  };

  // Mostrar mensagem única sobre Firestore não disponível
  showFirestoreUnavailableOnce(projectId: string) {
    if (!this.state.firestoreUnavailableMessageShown) {
      console.info("📱 Aplicação funcionando com localStorage");
      console.info(
        `💡 Para habilitar Firestore: https://console.firebase.google.com/project/${projectId}/firestore`,
      );
      this.state.firestoreUnavailableMessageShown = true;
      this.state.suppressFirestoreErrors = true;
    }
  }

  // Verificar se devemos suprimir erros de Firestore
  shouldSuppressFirestoreErrors(): boolean {
    return this.state.suppressFirestoreErrors;
  }

  // Resetar controle (útil para testes)
  reset() {
    this.state = {
      firestoreUnavailableMessageShown: false,
      lastFirestoreCheck: 0,
      suppressFirestoreErrors: false,
    };
  }

  // Log condicional - só mostra se não deve ser suprimido
  conditionalLog(
    type: "info" | "warn" | "error",
    message: string,
    isFirestoreRelated = false,
  ) {
    if (isFirestoreRelated && this.shouldSuppressFirestoreErrors()) {
      return; // Suprimir logs relacionados ao Firestore
    }

    switch (type) {
      case "info":
        console.info(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "error":
        console.error(message);
        break;
    }
  }

  // Marcar que Firestore está funcionando (permite logs normais)
  markFirestoreWorking() {
    this.state.suppressFirestoreErrors = false;
    console.info("✅ Firestore detectado e funcionando");
  }
}

// Instância singleton
export const firebaseLogControl = new FirebaseLogControl();

// Função helper para logs condicionais
export const conditionalFirebaseLog = {
  info: (message: string, isFirestoreRelated = false) =>
    firebaseLogControl.conditionalLog("info", message, isFirestoreRelated),
  warn: (message: string, isFirestoreRelated = false) =>
    firebaseLogControl.conditionalLog("warn", message, isFirestoreRelated),
  error: (message: string, isFirestoreRelated = false) =>
    firebaseLogControl.conditionalLog("error", message, isFirestoreRelated),
};
