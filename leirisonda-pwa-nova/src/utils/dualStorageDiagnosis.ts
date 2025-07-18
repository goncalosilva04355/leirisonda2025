/**
 * Diagnóstico de uso duplo: localStorage + Firebase
 * Identifica conflitos e inconsistências
 */

export class DualStorageDiagnosis {
  static async analyzeStorageUsage() {
    console.log("\n📊 ANÁLISE DE ARMAZENAMENTO DUPLO");
    console.log("=====================================");

    const analysis = {
      localStorage: {
        users: [] as any[],
        data: {} as any,
        keys: [] as string[],
      },
      firebase: {
        available: false,
        users: [] as any[],
        data: {} as any,
      },
      conflicts: [] as string[],
      redundancy: [] as string[],
    };

    try {
      // 1. Analisar localStorage
      console.log("\n1️⃣ Analisando localStorage...");
      analysis.localStorage.keys = Object.keys(localStorage);

      const userKeys = ["app-users", "mock-users", "users", "saved-users"];
      const dataKeys = ["pools", "works", "maintenance", "clients"];

      // Verificar dados de utilizadores
      userKeys.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              analysis.localStorage.users.push(
                ...parsed.map((u) => ({ ...u, source: key })),
              );
              console.log(`📋 ${key}: ${parsed.length} utilizadores`);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao ler ${key}:`, error);
        }
      });

      // Verificar dados de aplicação
      dataKeys.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            analysis.localStorage.data[key] = Array.isArray(parsed)
              ? parsed
              : [];
            console.log(
              `📋 ${key}: ${analysis.localStorage.data[key].length} itens`,
            );
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao ler ${key}:`, error);
        }
      });

      // 2. Tentar analisar Firebase
      console.log("\n2️⃣ Analisando Firebase...");
      try {
        const { getFirebaseDB } = await import("../firebase/simpleConfig");
        const db = await getFirebaseDB();

        if (db) {
          analysis.firebase.available = true;
          console.log("✅ Firebase disponível");

          // Tentar verificar coleções do Firebase
          const { collection, getDocs } = await import("firebase/firestore");

          for (const collectionName of [
            "users",
            "pools",
            "works",
            "maintenance",
            "clients",
          ]) {
            try {
              const colRef = collection(db, collectionName);
              const snapshot = await getDocs(colRef);
              analysis.firebase.data[collectionName] = snapshot.docs.map(
                (doc) => doc.data(),
              );
              console.log(
                `🔥 Firebase ${collectionName}: ${snapshot.size} itens`,
              );
            } catch (error) {
              console.warn(
                `⚠️ Não foi possível acessar ${collectionName} no Firebase:`,
                error,
              );
            }
          }
        } else {
          console.log("❌ Firebase não disponível");
        }
      } catch (error) {
        console.warn("⚠️ Erro ao acessar Firebase:", error);
      }

      // 3. Identificar conflitos
      console.log("\n3️⃣ Identificando conflitos...");

      // Verificar duplicação de utilizadores
      const userSources = analysis.localStorage.users.reduce((acc, user) => {
        const key = `${user.email || user.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(user.source);
        return acc;
      }, {} as any);

      Object.entries(userSources).forEach(([userKey, sources]) => {
        if ((sources as string[]).length > 1) {
          analysis.conflicts.push(
            `Utilizador ${userKey} existe em: ${(sources as string[]).join(", ")}`,
          );
        }
      });

      // Verificar redundância de dados
      Object.keys(analysis.localStorage.data).forEach((key) => {
        const localData = analysis.localStorage.data[key];
        const firebaseData = analysis.firebase.data[key];

        if (localData && firebaseData) {
          if (localData.length !== firebaseData.length) {
            analysis.conflicts.push(
              `${key}: localStorage tem ${localData.length} vs Firebase tem ${firebaseData.length}`,
            );
          }
          analysis.redundancy.push(`${key} existe em ambos os sistemas`);
        }
      });

      // 4. Relatório final
      console.log("\n📋 RELATÓRIO FINAL:");
      console.log("==================");

      console.log(`\n📱 LocalStorage:`);
      console.log(`- Chaves totais: ${analysis.localStorage.keys.length}`);
      console.log(`- Utilizadores: ${analysis.localStorage.users.length}`);
      console.log(
        `- Coleções de dados: ${Object.keys(analysis.localStorage.data).length}`,
      );

      console.log(`\n🔥 Firebase:`);
      console.log(`- Disponível: ${analysis.firebase.available ? "✅" : "❌"}`);
      console.log(`- Coleções: ${Object.keys(analysis.firebase.data).length}`);

      console.log(`\n⚠️ Conflitos encontrados: ${analysis.conflicts.length}`);
      analysis.conflicts.forEach((conflict) => console.log(`  - ${conflict}`));

      console.log(`\n🔄 Redundâncias: ${analysis.redundancy.length}`);
      analysis.redundancy.forEach((redundancy) =>
        console.log(`  - ${redundancy}`),
      );

      // 5. Recomendações
      console.log("\n💡 RECOMENDAÇÕES:");

      if (analysis.conflicts.length > 0) {
        console.log("🚨 AÇÃO NECESSÁRIA: Conflitos detectados!");
        console.log(
          "  1. Escolher UMA fonte principal (Firebase OU localStorage)",
        );
        console.log("  2. Migrar todos os dados para a fonte escolhida");
        console.log("  3. Eliminar duplicações");
      }

      if (analysis.redundancy.length > 0) {
        console.log("⚠️ Sistema híbrido detectado:");
        console.log("  - Considerar usar Firebase como principal");
        console.log("  - localStorage apenas para cache/offline");
        console.log("  - Implementar sincronização unidirecional");
      }

      if (!analysis.firebase.available) {
        console.log("📱 Firebase inativo - sistema depende de localStorage");
        console.log("  - Ativar Firebase para sincronização");
        console.log("  - Migrar dados do localStorage para Firebase");
      }

      return analysis;
    } catch (error) {
      console.error("❌ Erro na análise:", error);
      return analysis;
    }
  }
}

// Executar análise automaticamente
if (typeof window !== "undefined") {
  setTimeout(() => {
    DualStorageDiagnosis.analyzeStorageUsage();
  }, 6000);
}
