/**
 * Teste específico para verificar se o Firestore está configurado
 */

import { getFirebaseDB } from "../firebase/simpleConfig";

export class FirebaseStorageTest {
  static async runStorageTest(): Promise<{
    firestoreExists: boolean;
    canRead: boolean;
    canWrite: boolean;
    rulesStatus: string;
    error?: string;
  }> {
    console.log("\n🔍 TESTE DE CONFIGURAÇÃO DO FIRESTORE");
    console.log("=====================================");

    const result = {
      firestoreExists: false,
      canRead: false,
      canWrite: false,
      rulesStatus: "unknown",
      error: undefined as string | undefined,
    };

    try {
      // 1. Verificar se conseguimos obter instância do Firestore
      console.log("1️⃣ Verificando se Firestore existe...");
      const db = await getFirebaseDB();

      if (!db) {
        result.error = "Não foi possível obter instância do Firestore";
        console.log("❌ Firestore não está disponível");
        return result;
      }

      result.firestoreExists = true;
      console.log("✅ Firestore instância obtida");

      // 2. Testar leitura básica
      console.log("2️⃣ Testando leitura...");
      try {
        const { collection, getDocs } = await import("firebase/firestore");

        // Tentar ler de uma coleção de teste
        const testCollection = collection(db, "test");
        const snapshot = await getDocs(testCollection);

        result.canRead = true;
        console.log(
          `✅ Leitura funcionou: ${snapshot.size} documentos encontrados`,
        );

        if (snapshot.size === 0) {
          console.log("📝 Coleção 'test' está vazia (normal)");
        }
      } catch (readError: any) {
        console.log("❌ Erro na leitura:", readError.message);

        // Analisar tipos de erro específicos
        if (readError.code === "permission-denied") {
          result.rulesStatus = "regras muito restritivas";
          result.error = "Regras de segurança impedem leitura";
        } else if (readError.code === "unavailable") {
          result.rulesStatus = "firestore não ativado";
          result.error = "Firestore pode não estar ativado no projeto";
        } else {
          result.error = `Erro de leitura: ${readError.message}`;
        }
      }

      // 3. Testar escrita básica
      console.log("3️⃣ Testando escrita...");
      try {
        const { collection, addDoc } = await import("firebase/firestore");

        const testCollection = collection(db, "test");
        const docRef = await addDoc(testCollection, {
          timestamp: new Date(),
          message: "Teste de configuração",
          device: "iPhone",
        });

        result.canWrite = true;
        console.log(`✅ Escrita funcionou: documento ${docRef.id} criado`);
      } catch (writeError: any) {
        console.log("❌ Erro na escrita:", writeError.message);

        if (writeError.code === "permission-denied") {
          result.rulesStatus = "regras impedem escrita";
          result.error = "Regras de segurança impedem escrita";
        } else {
          result.error = `Erro de escrita: ${writeError.message}`;
        }
      }

      // 4. Análise final
      console.log("\n📊 ANÁLISE FINAL:");
      console.log("==================");

      if (result.canRead && result.canWrite) {
        result.rulesStatus = "configurado corretamente";
        console.log("🎉 FIRESTORE TOTALMENTE FUNCIONAL!");
      } else if (result.canRead && !result.canWrite) {
        result.rulesStatus = "apenas leitura permitida";
        console.log("⚠️ Firestore permite leitura mas não escrita");
      } else if (!result.canRead && !result.canWrite) {
        result.rulesStatus = "acesso negado";
        console.log("❌ Firestore não permite acesso");
      }

      return result;
    } catch (error: any) {
      console.error("❌ Erro crítico no teste:", error);
      result.error = `Erro crítico: ${error.message}`;
      return result;
    }
  }

  // Verificar regras de segurança comuns
  static async checkSecurityRules(): Promise<string[]> {
    console.log("\n🔒 VERIFICANDO REGRAS DE SEGURANÇA");
    console.log("==================================");

    const suggestions = [];

    try {
      const db = await getFirebaseDB();
      if (!db) {
        suggestions.push("❌ Firestore não está disponível");
        return suggestions;
      }

      // Teste específico para regras
      const { collection, addDoc, getDocs } = await import(
        "firebase/firestore"
      );

      // Tentar operações em diferentes coleções
      const testCollections = [
        "users",
        "pools",
        "works",
        "maintenance",
        "clients",
      ];

      for (const collectionName of testCollections) {
        try {
          const colRef = collection(db, collectionName);
          const snapshot = await getDocs(colRef);
          console.log(
            `✅ ${collectionName}: leitura OK (${snapshot.size} docs)`,
          );
        } catch (error: any) {
          console.log(`❌ ${collectionName}: ${error.message}`);

          if (error.code === "permission-denied") {
            suggestions.push(
              `🔒 Coleção '${collectionName}' precisa de regras de leitura`,
            );
          }
        }
      }

      // Sugestões de regras
      console.log("\n💡 SUGESTÕES DE REGRAS:");
      console.log("========================");

      suggestions.push(
        "Para desenvolvimento, use estas regras no Firebase Console:",
      );
      suggestions.push("");
      suggestions.push("rules_version = '2';");
      suggestions.push("service cloud.firestore {");
      suggestions.push("  match /databases/{database}/documents {");
      suggestions.push("    match /{document=**} {");
      suggestions.push("      allow read, write: if true;");
      suggestions.push("    }");
      suggestions.push("  }");
      suggestions.push("}");
      suggestions.push("");
      suggestions.push(
        "⚠️ Esta regra permite acesso total (apenas para desenvolvimento!)",
      );
    } catch (error) {
      suggestions.push(`❌ Erro ao verificar regras: ${error}`);
    }

    return suggestions;
  }

  // Verificar se projeto Firebase existe
  static async checkFirebaseProject(): Promise<{
    projectExists: boolean;
    projectId: string;
    authDomain: string;
    status: string;
  }> {
    console.log("\n🏗️ VERIFICANDO PROJETO FIREBASE");
    console.log("===============================");

    const config = {
      projectId: "leirisonda-16f8b",
      authDomain: "leirisonda-16f8b.firebaseapp.com",
    };

    const result = {
      projectExists: false,
      projectId: config.projectId,
      authDomain: config.authDomain,
      status: "verificando...",
    };

    try {
      // Tentar acessar o projeto
      const { getApps } = await import("firebase/app");
      const apps = getApps();

      if (apps.length > 0) {
        const app = apps[0];
        console.log("✅ App Firebase encontrado:", app.name);
        console.log("📋 Projeto:", app.options.projectId);
        console.log("📋 Auth Domain:", app.options.authDomain);

        result.projectExists = true;
        result.status = "projeto conectado";
      } else {
        console.log("❌ Nenhum app Firebase inicializado");
        result.status = "projeto não conectado";
      }
    } catch (error) {
      console.error("❌ Erro ao verificar projeto:", error);
      result.status = `erro: ${error}`;
    }

    return result;
  }
}

// Executar teste automaticamente
if (typeof window !== "undefined") {
  setTimeout(async () => {
    console.log("🔍 Iniciando teste de storage Firebase...");

    const projectCheck = await FirebaseStorageTest.checkFirebaseProject();
    console.log("Projeto:", projectCheck);

    const storageTest = await FirebaseStorageTest.runStorageTest();
    console.log("Storage:", storageTest);

    if (!storageTest.canRead || !storageTest.canWrite) {
      const rules = await FirebaseStorageTest.checkSecurityRules();
      console.log("Regras:", rules);
    }

    // Enviar evento com resultados
    window.dispatchEvent(
      new CustomEvent("firebaseStorageTest", {
        detail: { projectCheck, storageTest },
      }),
    );
  }, 10000); // Aguardar 10 segundos para tudo inicializar
}
