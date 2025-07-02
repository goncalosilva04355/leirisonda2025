// ========================================
// LEIRISONDA DATA CLEANUP SCRIPT
// ========================================
// Copy and paste this entire script into browser console (F12)
// Make sure you're logged into the app first!

console.log("🧹 Iniciando limpeza de dados Leirisonda...");

async function cleanupLeirisondaData() {
  try {
    // Check if Firebase is available
    if (!window.firebase) {
      console.error(
        "❌ Firebase não encontrado. Certifica-te que estás logado na aplicação.",
      );
      return;
    }

    const db = window.firebase.firestore();
    const auth = window.firebase.auth();

    // Check if user is logged in
    if (!auth.currentUser) {
      console.error("❌ Utilizador não está logado. Faz login primeiro!");
      return;
    }

    console.log("✅ Firebase encontrado. Utilizador:", auth.currentUser.email);
    console.log("🗑️ Apagando todos os dados...");

    // Collections to clean
    const collections = [
      "obras",
      "piscinas",
      "manutencoes",
      "maintenances",
      "pools",
      "works",
    ];

    let totalDeleted = 0;

    for (const collectionName of collections) {
      try {
        console.log(`📂 Verificando collection: ${collectionName}`);

        const snapshot = await db.collection(collectionName).get();

        if (snapshot.empty) {
          console.log(`   ℹ️ Collection ${collectionName} está vazia`);
          continue;
        }

        console.log(
          `   🔍 Encontrados ${snapshot.size} documentos em ${collectionName}`,
        );

        // Delete in batches
        const batch = db.batch();
        let batchCount = 0;

        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
          batchCount++;
          totalDeleted++;
        });

        if (batchCount > 0) {
          await batch.commit();
          console.log(
            `   ✅ Apagados ${batchCount} documentos de ${collectionName}`,
          );
        }
      } catch (error) {
        console.log(`   ⚠️ Erro ao limpar ${collectionName}:`, error.message);
      }
    }

    // Also try to clean user-specific subcollections
    try {
      console.log("📂 Verificando dados específicos do utilizador...");
      const userId = auth.currentUser.uid;

      const userCollections = [
        `users/${userId}/obras`,
        `users/${userId}/piscinas`,
        `users/${userId}/manutencoes`,
      ];

      for (const path of userCollections) {
        try {
          const ref = db.collection(path);
          const snapshot = await ref.get();

          if (!snapshot.empty) {
            const batch = db.batch();
            snapshot.docs.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
            console.log(
              `   ✅ Apagados ${snapshot.size} documentos de ${path}`,
            );
            totalDeleted += snapshot.size;
          }
        } catch (error) {
          console.log(`   ℹ️ ${path} não existe ou está vazio`);
        }
      }
    } catch (error) {
      console.log("   ⚠️ Erro ao limpar dados do utilizador:", error.message);
    }

    console.log("========================================");
    console.log(`🎉 LIMPEZA COMPLETA!`);
    console.log(`📊 Total de documentos apagados: ${totalDeleted}`);
    console.log("✨ Base de dados está agora limpa!");
    console.log("========================================");

    // Show success message on page
    if (document.body) {
      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: #10b981; 
          color: white; 
          padding: 15px 20px; 
          border-radius: 8px; 
          font-family: system-ui; 
          font-weight: 500;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          🎉 ${totalDeleted} registos apagados com sucesso!
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
  } catch (error) {
    console.error("❌ Erro durante a limpeza:", error);
    console.log("🔧 Tenta fazer refresh da página e executar novamente");
  }
}

// Execute the cleanup
cleanupLeirisondaData();
