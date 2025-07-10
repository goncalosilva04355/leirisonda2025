// Teste completo de saúde do Firebase
export class FirebaseHealthCheck {
  static async runCompleteCheck(): Promise<{
    app: boolean;
    auth: boolean;
    firestore: boolean;
    storage: boolean;
    errors: string[];
    details: any;
  }> {
    const result = {
      app: false,
      auth: false,
      firestore: false,
      storage: false,
      errors: [] as string[],
      details: {} as any,
    };

    console.log("🔍 Iniciando verificação completa do Firebase...");

    // Test 1: Firebase App
    try {
      const { getApps, getApp } = await import("firebase/app");
      const apps = getApps();

      if (apps.length > 0) {
        result.app = true;
        const app = apps[0];
        result.details.app = {
          name: app.name,
          options: {
            projectId: app.options.projectId,
            authDomain: app.options.authDomain,
            storageBucket: app.options.storageBucket,
          },
        };
        console.log("✅ Firebase App OK:", result.details.app);
      } else {
        result.errors.push("Firebase App não inicializado");
        console.error("❌ Firebase App não encontrado");
      }
    } catch (error: any) {
      result.errors.push(`Firebase App error: ${error.message}`);
      console.error("❌ Erro no Firebase App:", error);
    }

    // Test 2: Firebase Auth
    if (result.app) {
      try {
        const { getAuth } = await import("firebase/auth");
        const { getApps } = await import("firebase/app");
        const app = getApps()[0];

        const auth = getAuth(app);
        if (auth) {
          result.auth = true;
          result.details.auth = {
            currentUser: auth.currentUser
              ? {
                  uid: auth.currentUser.uid,
                  email: auth.currentUser.email,
                }
              : null,
            config: {
              apiKey: auth.config.apiKey?.substring(0, 10) + "...",
              authDomain: auth.config.authDomain,
            },
          };
          console.log("✅ Firebase Auth OK:", result.details.auth);
        }
      } catch (error: any) {
        result.errors.push(`Firebase Auth error: ${error.message}`);
        console.error("❌ Erro no Firebase Auth:", error);
      }
    }

    // Test 3: Firestore
    if (result.app) {
      try {
        const { getFirestore, connectFirestoreEmulator, enableNetwork } =
          await import("firebase/firestore");
        const { getApps } = await import("firebase/app");
        const app = getApps()[0];

        const db = getFirestore(app);
        if (db) {
          // Test basic connection
          await enableNetwork(db);
          result.firestore = true;
          result.details.firestore = {
            app: db.app.name,
            type: db.type || "firestore",
          };
          console.log("✅ Firestore OK:", result.details.firestore);

          // Test read operation
          try {
            const { collection, getDocs, limit, query } = await import(
              "firebase/firestore"
            );
            const testQuery = query(collection(db, "__test__"), limit(1));
            await getDocs(testQuery);
            console.log("✅ Firestore read test passed");
          } catch (readError: any) {
            if (readError.code === "permission-denied") {
              console.log("⚠️ Firestore conectado mas sem permissões (normal)");
            } else {
              console.warn("⚠️ Firestore read test failed:", readError.message);
            }
          }
        }
      } catch (error: any) {
        result.errors.push(`Firestore error: ${error.message}`);
        console.error("❌ Erro no Firestore:", error);
      }
    }

    // Test 4: Storage
    if (result.app) {
      try {
        const { getStorage } = await import("firebase/storage");
        const { getApps } = await import("firebase/app");
        const app = getApps()[0];

        const storage = getStorage(app);
        if (storage) {
          result.storage = true;
          result.details.storage = {
            bucket: storage.bucket,
            host: storage.host,
          };
          console.log("✅ Firebase Storage OK:", result.details.storage);
        }
      } catch (error: any) {
        result.errors.push(`Storage error: ${error.message}`);
        console.error("❌ Erro no Firebase Storage:", error);
      }
    }

    // Summary
    const totalServices = 4;
    const workingServices = [
      result.app,
      result.auth,
      result.firestore,
      result.storage,
    ].filter(Boolean).length;

    console.log(
      `📊 Firebase Health Check Completo: ${workingServices}/${totalServices} serviços funcionando`,
    );

    if (result.errors.length > 0) {
      console.log("❌ Erros encontrados:", result.errors);
    }

    return result;
  }

  static async testFirestoreOperations(): Promise<{
    canRead: boolean;
    canWrite: boolean;
    errors: string[];
  }> {
    const result = {
      canRead: false,
      canWrite: false,
      errors: [] as string[],
    };

    try {
      const { getApps } = await import("firebase/app");
      const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } =
        await import("firebase/firestore");

      const app = getApps()[0];
      if (!app) {
        result.errors.push("Firebase App não disponível");
        return result;
      }

      const db = getFirestore(app);

      // Test Write
      try {
        const testData = {
          test: true,
          timestamp: new Date(),
          message: "Firebase Health Check Test",
        };

        const docRef = await addDoc(collection(db, "health_check"), testData);
        result.canWrite = true;
        console.log("✅ Firestore write test passed:", docRef.id);

        // Cleanup - delete test document
        try {
          await deleteDoc(doc(db, "health_check", docRef.id));
          console.log("✅ Test document cleaned up");
        } catch (cleanupError) {
          console.warn("⚠️ Cleanup failed:", cleanupError);
        }
      } catch (writeError: any) {
        result.errors.push(`Write error: ${writeError.message}`);
        console.error("❌ Firestore write test failed:", writeError);
      }

      // Test Read
      try {
        const querySnapshot = await getDocs(collection(db, "health_check"));
        result.canRead = true;
        console.log(
          `✅ Firestore read test passed: ${querySnapshot.size} documents found`,
        );
      } catch (readError: any) {
        result.errors.push(`Read error: ${readError.message}`);
        console.error("❌ Firestore read test failed:", readError);
      }
    } catch (error: any) {
      result.errors.push(`General error: ${error.message}`);
      console.error("❌ Firestore operations test failed:", error);
    }

    return result;
  }

  static generateHealthReport(healthCheck: any, operations?: any): string {
    const timestamp = new Date().toLocaleString("pt-PT");

    let report = `RELATÓRIO DE SAÚDE DO FIREBASE
========================================
Data: ${timestamp}
Projeto: leiria-1cfc9

SERVIÇOS PRINCIPAIS:
-------------------
Firebase App: ${healthCheck.app ? "✅ FUNCIONANDO" : "❌ FALHA"}
Firebase Auth: ${healthCheck.auth ? "✅ FUNCIONANDO" : "❌ FALHA"}
Firestore: ${healthCheck.firestore ? "✅ FUNCIONANDO" : "❌ FALHA"}
Storage: ${healthCheck.storage ? "✅ FUNCIONANDO" : "❌ FALHA"}

`;

    if (healthCheck.details.app) {
      report += `DETALHES DO APP:
--------------
Projeto ID: ${healthCheck.details.app.options.projectId}
Auth Domain: ${healthCheck.details.app.options.authDomain}
Storage Bucket: ${healthCheck.details.app.options.storageBucket}

`;
    }

    if (healthCheck.details.auth) {
      report += `DETALHES DO AUTH:
---------------
Utilizador Atual: ${
        healthCheck.details.auth.currentUser
          ? `${healthCheck.details.auth.currentUser.email} (${healthCheck.details.auth.currentUser.uid})`
          : "Nenhum"
      }

`;
    }

    if (operations) {
      report += `TESTES DE OPERAÇÕES:
------------------
Leitura Firestore: ${operations.canRead ? "✅ OK" : "❌ FALHA"}
Escrita Firestore: ${operations.canWrite ? "✅ OK" : "❌ FALHA"}

`;
    }

    if (healthCheck.errors.length > 0) {
      report += `ERROS ENCONTRADOS:
-----------------
${healthCheck.errors.map((error: string) => `• ${error}`).join("\n")}

`;
    }

    const workingServices = [
      healthCheck.app,
      healthCheck.auth,
      healthCheck.firestore,
      healthCheck.storage,
    ].filter(Boolean).length;
    const totalServices = 4;
    const healthPercentage = Math.round(
      (workingServices / totalServices) * 100,
    );

    report += `RESUMO:
-------
Saúde Geral: ${healthPercentage}% (${workingServices}/${totalServices} serviços)
Status: ${healthPercentage >= 75 ? "🟢 SAUDÁVEL" : healthPercentage >= 50 ? "🟡 PARCIAL" : "🔴 CRÍTICO"}

RECOMENDAÇÕES:
-------------`;

    if (!healthCheck.app) {
      report += `\n• Verificar configuração do Firebase App`;
    }
    if (!healthCheck.auth) {
      report += `\n• Ativar Firebase Authentication no console`;
    }
    if (!healthCheck.firestore) {
      report += `\n• Ativar Firestore Database no console`;
      report += `\n• Configurar regras de segurança do Firestore`;
    }
    if (!healthCheck.storage) {
      report += `\n• Ativar Firebase Storage no console`;
    }
    if (operations && !operations.canRead) {
      report += `\n• Verificar regras de leitura do Firestore`;
    }
    if (operations && !operations.canWrite) {
      report += `\n• Verificar regras de escrita do Firestore`;
    }

    report += `\n\n========================================`;

    return report;
  }
}

export default FirebaseHealthCheck;
