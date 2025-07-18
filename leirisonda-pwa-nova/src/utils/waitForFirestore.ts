import { directFirebaseInit, getDirectFirestore } from "./directFirebaseFix";

/**
 * Aguarda até que o Firestore esteja completamente pronto
 */
export const waitForFirestore = async (
  maxAttempts = 10,
  delay = 1000,
): Promise<any> => {
  console.log("⏳ Aguardando Firestore estar pronto...");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `🔍 Tentativa ${attempt}/${maxAttempts} - verificando Firestore...`,
      );

      // 1. Verificar se já temos instância direta
      const directDB = getDirectFirestore();
      if (directDB) {
        console.log(`✅ Firestore direto encontrado na tentativa ${attempt}`);
        return directDB;
      }

      // 2. Tentar inicializar
      const initResult = await directFirebaseInit();
      if (initResult.ready && initResult.db) {
        console.log(`✅ Firestore inicializado na tentativa ${attempt}`);
        return initResult.db;
      }

      // 3. Aguardar antes da próxima tentativa
      if (attempt < maxAttempts) {
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error: any) {
      console.error(`❌ Erro na tentativa ${attempt}:`, error.message);

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`❌ Firestore não ficou pronto após ${maxAttempts} tentativas`);
  return null;
};

export default waitForFirestore;
