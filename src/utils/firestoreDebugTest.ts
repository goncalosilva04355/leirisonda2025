import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { firestoreService } from "../services/firestoreService";

export async function debugFirestoreWriteIssue() {
  console.log("🔍 DIAGNÓSTICO DETALHADO: Problemas de escrita no Firestore");

  const results = {
    environment: {},
    firestoreConnection: {},
    writeTests: {},
    readTests: {},
    issues: [] as string[],
    recommendations: [] as string[],
  };

  // 1. Verificar ambiente
  console.log("📊 1. Verificando ambiente...");
  results.environment = {
    isDev: import.meta.env.DEV,
    isNetlify:
      import.meta.env.NETLIFY === "true" ||
      import.meta.env.VITE_IS_NETLIFY === "true",
    forceFirebase: import.meta.env.VITE_FORCE_FIREBASE === "true",
    url: window.location.href,
  };

  console.log("Environment check:", results.environment);

  if (!results.environment.isNetlify && !results.environment.forceFirebase) {
    results.issues.push(
      "Firestore não será inicializado - nem no Netlify nem forçado",
    );
    results.recommendations.push(
      "Definir VITE_FORCE_FIREBASE=true ou fazer deploy no Netlify",
    );
  }

  // 2. Testar conexão Firestore
  console.log("🔥 2. Testando conexão Firestore...");
  try {
    const db = await getFirebaseFirestoreAsync();

    if (!db) {
      results.firestoreConnection = {
        status: "failed",
        error: "getFirebaseFirestoreAsync retornou null",
      };
      results.issues.push("Firestore não conseguiu ser inicializado");
      results.recommendations.push(
        "Verificar configuração Firebase e variáveis de ambiente",
      );
    } else {
      results.firestoreConnection = { status: "success", ready: true };
      console.log("✅ Firestore connection established");
    }
  } catch (error: any) {
    results.firestoreConnection = { status: "error", error: error.message };
    results.issues.push(`Erro na conexão Firestore: ${error.message}`);
  }

  // 3. Testes de escrita se conexão OK
  if (results.firestoreConnection.status === "success") {
    console.log("📝 3. Testando operações de escrita...");

    try {
      const db = await getFirebaseFirestoreAsync();

      // Teste 1: addDoc direto
      console.log("🧪 Teste 1: addDoc direto...");
      const testData1 = {
        message: "Teste debug escrita",
        timestamp: serverTimestamp(),
        testType: "addDoc_direct",
        debugId: `debug_${Date.now()}`,
      };

      const docRef1 = await addDoc(collection(db!, "debug_tests"), testData1);
      results.writeTests.addDoc = { status: "success", id: docRef1.id };
      console.log("✅ addDoc direto: sucesso -", docRef1.id);
    } catch (error: any) {
      results.writeTests.addDoc = {
        status: "failed",
        error: error.message,
        code: error.code,
      };
      results.issues.push(`Falha no addDoc: ${error.message} (${error.code})`);

      if (error.code === "permission-denied") {
        results.recommendations.push(
          "Verificar regras de segurança do Firestore",
        );
      } else if (error.code === "unavailable") {
        results.recommendations.push(
          "Firestore pode não estar habilitado no projeto",
        );
      }
    }

    // Teste 2: setDoc direto
    try {
      console.log("🧪 Teste 2: setDoc direto...");
      const db = await getFirebaseFirestoreAsync();
      const testId = `debug_set_${Date.now()}`;
      const testData2 = {
        message: "Teste debug setDoc",
        timestamp: serverTimestamp(),
        testType: "setDoc_direct",
        customId: testId,
      };

      await setDoc(doc(db!, "debug_tests", testId), testData2);
      results.writeTests.setDoc = { status: "success", id: testId };
      console.log("✅ setDoc direto: sucesso -", testId);
    } catch (error: any) {
      results.writeTests.setDoc = {
        status: "failed",
        error: error.message,
        code: error.code,
      };
      results.issues.push(`Falha no setDoc: ${error.message} (${error.code})`);
    }

    // Teste 3: firestoreService
    try {
      console.log("🧪 Teste 3: firestoreService...");
      const testData3 = {
        message: "Teste debug via service",
        testType: "service_test",
        debugId: `service_${Date.now()}`,
      };

      const serviceResult = await firestoreService.addDocument(
        "debug_tests",
        testData3,
      );
      if (serviceResult) {
        results.writeTests.service = { status: "success", id: serviceResult };
        console.log("✅ firestoreService: sucesso -", serviceResult);
      } else {
        results.writeTests.service = {
          status: "failed",
          error: "Retornou null",
        };
        results.issues.push("firestoreService.addDocument retornou null");
      }
    } catch (error: any) {
      results.writeTests.service = { status: "failed", error: error.message };
      results.issues.push(`Falha no firestoreService: ${error.message}`);
    }

    // Teste 4: Leitura para verificar se dados foram salvos
    try {
      console.log("📖 4. Testando leitura de dados...");
      const db = await getFirebaseFirestoreAsync();
      const querySnapshot = await getDocs(collection(db!, "debug_tests"));

      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      results.readTests = {
        status: "success",
        count: docs.length,
        recentDocs: docs.slice(-3), // últimos 3 documentos
      };

      console.log(`✅ Leitura: ${docs.length} documentos encontrados`);
    } catch (error: any) {
      results.readTests = {
        status: "failed",
        error: error.message,
        code: error.code,
      };
      results.issues.push(`Falha na leitura: ${error.message}`);
    }
  }

  // Análise final
  console.log("📋 DIAGNÓSTICO COMPLETO:");
  console.log("Issues encontradas:", results.issues);
  console.log("Recomendações:", results.recommendations);

  // Determinar causa raiz
  if (results.issues.length === 0) {
    console.log("🎉 FIRESTORE ESTÁ FUNCIONANDO PERFEITAMENTE!");
  } else if (
    results.issues.some((issue) => issue.includes("não será inicializado"))
  ) {
    console.log("❌ PROBLEMA PRINCIPAL: Firestore não está sendo inicializado");
    console.log("💡 SOLUÇÃO: Configurar variáveis de ambiente ou fazer deploy");
  } else if (
    results.issues.some((issue) => issue.includes("permission-denied"))
  ) {
    console.log("❌ PROBLEMA PRINCIPAL: Regras de segurança muito restritivas");
    console.log("💡 SOLUÇÃO: Verificar firestore.rules");
  } else if (results.issues.some((issue) => issue.includes("unavailable"))) {
    console.log("❌ PROBLEMA PRINCIPAL: Firestore não habilitado no projeto");
    console.log("💡 SOLUÇÃO: Habilitar Firestore no Firebase Console");
  } else {
    console.log("❌ PROBLEMA PRINCIPAL: Erro de configuração");
    console.log("💡 SOLUÇÃO: Verificar configuração Firebase");
  }

  return results;
}

// Teste rápido para execução imediata
export async function quickFirestoreTest() {
  console.log("🚀 TESTE RÁPIDO FIRESTORE...");

  try {
    // Verificar se consegue inicializar
    const db = await getFirebaseFirestoreAsync();

    if (!db) {
      console.error("❌ FALHA: Firestore não inicializou");
      return false;
    }

    // Tentar escrever um documento simples
    const testDoc = {
      message: "Teste rápido",
      timestamp: new Date().toISOString(),
      testId: Date.now(),
    };

    const docRef = await addDoc(collection(db, "quick_test"), testDoc);
    console.log("✅ SUCESSO: Documento criado -", docRef.id);
    return true;
  } catch (error: any) {
    console.error("❌ FALHA:", error.message);
    if (error.code) {
      console.error("🔍 Código:", error.code);
    }
    return false;
  }
}
