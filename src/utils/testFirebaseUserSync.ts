/**
 * Teste rápido para verificar sincronização Firebase de utilizadores
 */

export async function testFirebaseUserSync(): Promise<void> {
  console.log("🧪 === TESTE FIREBASE USER SYNC ===");

  try {
    // 1. Verificar localStorage
    const localUsers = localStorage.getItem("app-users");
    const parsedLocalUsers = localUsers ? JSON.parse(localUsers) : [];
    console.log("📱 localStorage app-users:", parsedLocalUsers.length);

    // 2. Testar Firestore service
    const { firestoreService } = await import("../services/firestoreService");
    console.log("🔥 FirestoreService importado com sucesso");

    // 3. Tentar sincronização
    const firestoreUsers = await firestoreService.getCollection("users");
    console.log("☁️ Firestore utilizadores:", firestoreUsers.length);

    // 4. Comparar
    if (firestoreUsers.length > 0) {
      console.log("✅ SUCESSO: Utilizadores encontrados no Firestore");
      console.log(
        "📊 Utilizadores:",
        firestoreUsers.map((u) => u.email),
      );
    } else {
      console.log("⚠�� ATENÇÃO: Nenhum utilizador no Firestore");
      if (parsedLocalUsers.length > 0) {
        console.log("🔄 Tentando forçar sincronização...");
        // A função getUtilizadores() deve sincronizar automaticamente
      }
    }
  } catch (error) {
    console.error("❌ Erro no teste Firebase:", error);
  }

  console.log("🧪 === FIM TESTE ===");
}

// Auto-executar teste em desenvolvimento
if (process.env.NODE_ENV === "development") {
  setTimeout(() => {
    testFirebaseUserSync();
  }, 5000); // Aguardar 5 segundos após página carregar
}
