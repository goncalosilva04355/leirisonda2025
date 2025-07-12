/**
 * Firebase Config sem getImmediate errors
 * Solução radical que nunca chama getFirestore/getAuth até ter certeza absoluta
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirebaseConfig } from "../config/firebaseEnv";

const firebaseConfig = getFirebaseConfig();

export class NoGetImmediateFirebase {
  private static app: FirebaseApp | null = null;
  private static db: any = null;
  private static auth: any = null;
  private static isFullyReady = false;
  private static readinessChecked = false;

  // Verificar se Firebase está REALMENTE pronto (não apenas inicializado)
  private static async verifyFirebaseReadiness(): Promise<boolean> {
    if (this.readinessChecked && this.isFullyReady) {
      return true;
    }

    console.log("🔍 Verificando se Firebase está REALMENTE pronto...");

    try {
      // 1. Verificar se existe pelo menos um app
      const apps = getApps();
      if (apps.length === 0) {
        console.log("❌ Nenhum app Firebase encontrado");
        return false;
      }

      const app = apps[0];

      // 2. Verificar se o app tem todas as propriedades necessárias
      if (!app || !app.options || !app.name || !app.options.projectId) {
        console.log("❌ App Firebase incompleto");
        return false;
      }

      // 3. Aguardar tempo suficiente para serviços estabilizarem
      console.log("⏳ Aguardando estabilização dos serviços...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 4. Verificar se o app ainda existe após o delay
      const appsAfterDelay = getApps();
      const appStillExists = appsAfterDelay.find((a) => a.name === app.name);

      if (!appStillExists) {
        console.log("❌ App Firebase desapareceu após delay");
        return false;
      }

      this.app = appStillExists;
      this.readinessChecked = true;
      this.isFullyReady = true;

      console.log("✅ Firebase verificado como REALMENTE pronto");
      return true;
    } catch (error) {
      console.error("❌ Erro na verificação de readiness:", error);
      this.readinessChecked = true;
      this.isFullyReady = false;
      return false;
    }
  }

  // Inicializar serviços APENAS quando temos certeza absoluta
  private static async initializeServicesWhenSafe(): Promise<void> {
    if (!this.isFullyReady || !this.app) {
      throw new Error("Firebase não está pronto para inicializar serviços");
    }

    console.log(
      "🔐 Inicializando serviços com Firebase confirmadamente pronto...",
    );

    // Auth primeiro (mais estável)
    if (!this.auth) {
      try {
        console.log("🔐 Inicializando Auth...");

        // Aguardar extra para ter certeza
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { getAuth } = await import("firebase/auth");
        this.auth = getAuth(this.app);

        console.log("✅ Auth inicializado com segurança");
      } catch (error) {
        console.warn("⚠️ Auth falhou:", error);
        this.auth = null;
      }
    }

    // Firestore com máxima cautela
    if (!this.db) {
      try {
        console.log("🔄 Inicializando Firestore com máxima cautela...");

        // Aguardar ainda mais para Firestore
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Verificar mais uma vez se app ainda é válido
        const currentApps = getApps();
        const ourApp = currentApps.find((a) => a.name === this.app!.name);

        if (!ourApp || !ourApp.options) {
          throw new Error("App ficou inválido antes de inicializar Firestore");
        }

        const { getFirestore } = await import("firebase/firestore");
        this.db = getFirestore(ourApp);

        console.log("✅ Firestore inicializado com máxima segurança");
      } catch (error) {
        console.warn("⚠️ Firestore falhou mesmo com máxima cautela:", error);
        this.db = null;
      }
    }
  }

  // Método público para obter DB de forma segura
  static async getSafeDB(): Promise<any> {
    console.log("🔍 Solicitação de DB segura...");

    // Verificar se já temos DB
    if (this.db) {
      console.log("✅ DB já disponível");
      return this.db;
    }

    // Verificar se Firebase está pronto
    const isReady = await this.verifyFirebaseReadiness();
    if (!isReady) {
      console.log("❌ Firebase não está pronto para DB");
      return null;
    }

    // Tentar inicializar serviços
    try {
      await this.initializeServicesWhenSafe();
      return this.db;
    } catch (error) {
      console.error("❌ Falha na inicialização segura de serviços:", error);
      return null;
    }
  }

  // Método público para obter Auth de forma segura
  static async getSafeAuth(): Promise<any> {
    console.log("🔍 Solicitação de Auth segura...");

    // Verificar se já temos Auth
    if (this.auth) {
      console.log("✅ Auth já disponível");
      return this.auth;
    }

    // Verificar se Firebase está pronto
    const isReady = await this.verifyFirebaseReadiness();
    if (!isReady) {
      console.log("❌ Firebase não está pronto para Auth");
      return null;
    }

    // Tentar inicializar serviços
    try {
      await this.initializeServicesWhenSafe();
      return this.auth;
    } catch (error) {
      console.error("❌ Falha na inicialização segura de serviços:", error);
      return null;
    }
  }

  // Status do sistema
  static getStatus() {
    return {
      ready: this.isFullyReady,
      hasApp: !!this.app,
      hasAuth: !!this.auth,
      hasDB: !!this.db,
      checked: this.readinessChecked,
      mode: "no-getImmediate",
    };
  }

  // Inicialização manual (sem auto-run)
  static async manualInitialize(): Promise<boolean> {
    console.log("🚀 Inicialização manual NoGetImmediate...");

    try {
      // Primeiro, garantir que existe um app Firebase
      let apps = getApps();

      if (apps.length === 0) {
        console.log("🔧 Criando app Firebase...");
        initializeApp(firebaseConfig);

        // Aguardar para app estabilizar
        await new Promise((resolve) => setTimeout(resolve, 2000));

        apps = getApps();
      }

      if (apps.length === 0) {
        throw new Error("Não foi possível criar app Firebase");
      }

      // Agora verificar readiness
      const ready = await this.verifyFirebaseReadiness();
      if (ready) {
        await this.initializeServicesWhenSafe();
      }

      console.log(
        `${ready ? "✅" : "❌"} Inicialização manual ${ready ? "bem-sucedida" : "falhou"}`,
      );
      return ready;
    } catch (error) {
      console.error("❌ Erro na inicialização manual:", error);
      return false;
    }
  }

  // Teste de conectividade sem getImmediate
  static async testConnectivity(): Promise<{
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  }> {
    const result = {
      canRead: false,
      canWrite: false,
      error: undefined as string | undefined,
    };

    try {
      const db = await this.getSafeDB();

      if (!db) {
        result.error = "DB não disponível";
        return result;
      }

      // Teste de leitura
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const testCol = collection(db, "connectivityTest");
        await getDocs(testCol);
        result.canRead = true;
        console.log("✅ Teste de leitura OK");
      } catch (readError) {
        console.log("❌ Teste de leitura falhou:", readError);
      }

      // Teste de escrita
      try {
        const { collection, addDoc } = await import("firebase/firestore");
        const testCol = collection(db, "connectivityTest");
        await addDoc(testCol, {
          timestamp: new Date(),
          test: "connectivity",
        });
        result.canWrite = true;
        console.log("✅ Teste de escrita OK");
      } catch (writeError) {
        console.log("❌ Teste de escrita falhou:", writeError);
      }
    } catch (error) {
      result.error =
        error instanceof Error ? error.message : "Erro desconhecido";
    }

    return result;
  }
}

// NÃO inicializar automaticamente para evitar getImmediate
console.log(
  "🛡️ NoGetImmediateFirebase carregado (inicialização manual apenas)",
);
