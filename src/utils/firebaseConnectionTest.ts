// Teste de conexão Firebase em produção
import { getFirebaseApp } from "../firebase/basicConfig";
import { getFirebaseFirestore } from "../firebase/firestoreConfig";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function testFirebaseConnection(): Promise<{
  success: boolean;
  results: string[];
  errors: string[];
}> {
  const results: string[] = [];
  const errors: string[] = [];

  try {
    results.push("🔄 Iniciando teste de conexão Firebase...");

    // 1. Verificar se Firebase App está inicializada
    let app;
    try {
      app = getFirebaseApp();
    } catch (appError: any) {
      errors.push(`❌ Erro ao obter Firebase App: ${appError.message}`);
      return { success: false, results, errors };
    }

    if (app) {
      try {
        results.push("✅ Firebase App inicializada com sucesso");
        results.push(`📱 App Name: ${app.name}`);
        results.push(`🔧 Project ID: ${app.options.projectId}`);
      } catch (appDetailsError: any) {
        errors.push(
          `⚠️ App existe mas com detalhes inacessíveis: ${appDetailsError.message}`,
        );
      }
    } else {
      errors.push("❌ Firebase App não foi inicializada");
      return { success: false, results, errors };
    }

    // 2. Verificar se Firestore está disponível
    const db = getFirebaseFirestore();
    if (db) {
      results.push("✅ Firestore conectado com sucesso");
    } else {
      errors.push("❌ Firestore não está disponível");
      return { success: false, results, errors };
    }

    // 3. Testar leitura de dados
    try {
      const testCollection = collection(db, "connection-test");
      const snapshot = await getDocs(testCollection);
      results.push(`✅ Leitura Firestore OK (${snapshot.size} documentos)`);
    } catch (readError: any) {
      errors.push(`⚠️ Erro na leitura: ${readError.message}`);
    }

    // 4. Testar escrita de dados
    try {
      const testCollection = collection(db, "connection-test");
      const docRef = await addDoc(testCollection, {
        test: "Firebase connection test",
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        origin: window.location.origin,
      });
      results.push(`✅ Escrita Firestore OK (ID: ${docRef.id})`);
    } catch (writeError: any) {
      errors.push(`⚠️ Erro na escrita: ${writeError.message}`);
      // Verificar se é erro de permissões
      if (writeError.code === "permission-denied") {
        errors.push("🔒 Verifique as regras de segurança do Firestore");
      }
    }

    // 5. Verificar variáveis de ambiente
    const envVars = {
      API_KEY: import.meta.env.VITE_FIREBASE_API_KEY
        ? "✅ Definida"
        : "❌ Não definida",
      AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
        ? "✅ Definida"
        : "❌ Não definida",
      PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID
        ? "✅ Definida"
        : "❌ Não definida",
      STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
        ? "✅ Definida"
        : "❌ Não definida",
    };

    results.push("📋 Variáveis de ambiente:");
    Object.entries(envVars).forEach(([key, status]) => {
      results.push(`  ${key}: ${status}`);
    });

    const success = errors.length === 0;
    results.push(
      success
        ? "🎉 Teste completo - Firebase totalmente funcional!"
        : "⚠️ Teste completo com alguns avisos",
    );

    return { success, results, errors };
  } catch (error: any) {
    errors.push(`❌ Erro crítico no teste: ${error.message}`);
    return { success: false, results, errors };
  }
}

// Executar teste automaticamente em desenvolvimento
if (import.meta.env.DEV) {
  setTimeout(async () => {
    console.log("🔍 Executando diagnóstico Firebase automático...");
    const result = await testFirebaseConnection();

    console.group("📊 Resultado do Teste Firebase");
    result.results.forEach((msg) => console.log(msg));
    if (result.errors.length > 0) {
      console.group("🚨 Erros encontrados:");
      result.errors.forEach((err) => console.error(err));
      console.groupEnd();
    }
    console.groupEnd();
  }, 3000);
}
