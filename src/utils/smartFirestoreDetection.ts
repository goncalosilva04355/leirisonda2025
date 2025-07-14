// Sistema inteligente de detecção de Firestore
// Verifica automaticamente se Firestore está disponível e ajusta o comportamento da app

import { firebaseLogControl } from "./firebaseLogControl";

interface FirestoreStatus {
  available: boolean;
  checked: boolean;
  projectId: string | null;
  lastCheck: number;
  error: string | null;
}

class SmartFirestoreDetection {
  private status: FirestoreStatus = {
    available: false,
    checked: false,
    projectId: null,
    lastCheck: 0,
    error: null,
  };

  private listeners: ((status: FirestoreStatus) => void)[] = [];

  async checkFirestoreAvailability(): Promise<FirestoreStatus> {
    // Se já verificamos recentemente (menos de 5 minutos), retornar cache
    const now = Date.now();
    if (this.status.checked && now - this.status.lastCheck < 5 * 60 * 1000) {
      return this.status;
    }

    console.log("🔍 Verificando disponibilidade do Firestore...");

    try {
      // Tentar obter configuração Firebase
      const { getFirebaseConfig } = await import("../config/firebaseEnv");
      const config = getFirebaseConfig();

      // Tentar inicializar Firebase App
      const { getApps, getApp, initializeApp } = await import("firebase/app");

      let app;
      if (getApps().length === 0) {
        app = initializeApp(config);
      } else {
        app = getApp();
      }

      // Tentar acessar Firestore
      const { getFirestore } = await import("firebase/firestore");
      const db = getFirestore(app);

      // Se chegamos aqui, Firestore está disponível
      this.status = {
        available: true,
        checked: true,
        projectId: app.options.projectId,
        lastCheck: now,
        error: null,
      };

      firebaseLogControl.markFirestoreWorking();
      console.log(
        `✅ Firestore disponível no projeto: ${app.options.projectId}`,
      );
      this.notifyListeners();

      return this.status;
    } catch (error: any) {
      let errorMessage = error.message;
      let isServiceUnavailable = false;

      if (error.message.includes("Service firestore is not available")) {
        errorMessage = "Firestore não está habilitado no projeto";
        isServiceUnavailable = true;
      }

      this.status = {
        available: false,
        checked: true,
        projectId: null,
        lastCheck: now,
        error: errorMessage,
      };

      if (isServiceUnavailable) {
        console.info(
          "📱 Firestore não habilitado - aplicação funcionará com localStorage",
        );
        console.info(
          "💡 Para habilitar Firestore: Firebase Console → Firestore Database → Criar base de dados",
        );
      } else {
        console.warn("⚠️ Erro ao verificar Firestore:", errorMessage);
      }

      this.notifyListeners();
      return this.status;
    }
  }

  getStatus(): FirestoreStatus {
    return { ...this.status };
  }

  isAvailable(): boolean {
    return this.status.available;
  }

  onStatusChange(callback: (status: FirestoreStatus) => void) {
    this.listeners.push(callback);

    // Retornar função para remover o listener
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.status);
      } catch (error) {
        console.error("Erro no listener de status Firestore:", error);
      }
    });
  }

  // Método para forçar nova verificação
  async recheckAvailability(): Promise<FirestoreStatus> {
    this.status.checked = false;
    return this.checkFirestoreAvailability();
  }

  // Método para obter recomendações baseadas no status
  getRecommendations(): string[] {
    if (!this.status.checked) {
      return ["Execute checkFirestoreAvailability() primeiro"];
    }

    if (this.status.available) {
      return [
        "✅ Firestore funcionando perfeitamente",
        "📊 Dados serão sincronizados automaticamente",
        "🔄 Backup local em localStorage mantido",
      ];
    }

    const recommendations = [
      "📱 Aplicação funciona perfeitamente com localStorage",
      "💾 Todos os dados são salvos localmente no navegador",
    ];

    if (this.status.error?.includes("not available")) {
      recommendations.push(
        "🔧 Para habilitar Firestore:",
        "  1. Acesse Firebase Console",
        "  2. Selecione seu projeto",
        "  3. Vá em Firestore Database",
        "  4. Clique em 'Criar base de dados'",
        "  5. Escolha modo de teste",
        "  6. Reinicie a aplicação",
      );
    }

    return recommendations;
  }
}

// Instância singleton
export const smartFirestore = new SmartFirestoreDetection();

// Auto-check em desenvolvimento
if (import.meta.env.VITE_FORCE_FIREBASE) {
  setTimeout(() => {
    smartFirestore.checkFirestoreAvailability();
  }, 2000);
}
