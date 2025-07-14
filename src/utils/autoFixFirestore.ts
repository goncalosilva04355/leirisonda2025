import {
  getFirebaseFirestoreAsync,
  forceFirestoreReinit,
} from "../firebase/firestoreConfigFixed";

let autoFixAttempted = false;

export async function autoFixFirestoreOnError() {
  if (autoFixAttempted) {
    console.log("⚠️ Auto-correção já foi tentada");
    return;
  }

  autoFixAttempted = true;
  console.log("🔧 Auto-correção do Firestore iniciada...");

  try {
    // Tentar inicialização padrão
    let db = await getFirebaseFirestoreAsync();

    if (db) {
      console.log("✅ Auto-correção: Firestore funcionando!");
      return db;
    }

    // Se falhou, tentar reinicialização forçada
    console.log("🔄 Tentando reinicialização forçada...");
    db = await forceFirestoreReinit();

    if (db) {
      console.log(
        "✅ Auto-correção: Firestore funcionando após reinicialização!",
      );
      return db;
    }

    console.error("❌ Auto-correção falhou");
    return null;
  } catch (error) {
    console.error("❌ Erro na auto-correção:", error);
    return null;
  }
}

// Executar auto-correção quando o módulo é carregado
if (typeof window !== "undefined") {
  // Aguardar um pouco para a app estar pronta
  setTimeout(async () => {
    console.log("🚀 Executando auto-correção do Firestore...");
    await autoFixFirestoreOnError();
  }, 2000);
}

export default autoFixFirestoreOnError;
