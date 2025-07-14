import { getFirebaseFirestoreAsync } from "../firebase/firestoreConfig";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function testFirestoreWriteCapability() {
  console.log("🧪 Iniciando teste de capacidade de escrita Firestore...");

  try {
    // Obter instância do Firestore
    const db = await getFirebaseFirestoreAsync();

    if (!db) {
      console.error("❌ Firestore não disponível - verificar configuração");
      return {
        success: false,
        error: "Firestore não inicializado",
        details: "getFirebaseFirestoreAsync retornou null",
      };
    }

    console.log("✅ Firestore instância obtida com sucesso");

    // Teste 1: addDoc com ID automático
    console.log("🧪 Teste 1: addDoc...");
    const testData1 = {
      message: "Teste escrita automática",
      timestamp: serverTimestamp(),
      testType: "addDoc",
      browser: navigator.userAgent,
      url: window.location.href,
    };

    const docRef1 = await addDoc(collection(db, "test_writes"), testData1);
    console.log("✅ addDoc sucesso:", docRef1.id);

    // Teste 2: setDoc com ID específico
    console.log("🧪 Teste 2: setDoc...");
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const testData2 = {
      message: "Teste escrita com ID específico",
      timestamp: serverTimestamp(),
      testType: "setDoc",
      customId: testId,
      browser: navigator.userAgent,
      url: window.location.href,
    };

    await setDoc(doc(db, "test_writes", testId), testData2);
    console.log("✅ setDoc sucesso:", testId);

    // Teste 3: Documento real tipo obra
    console.log("🧪 Teste 3: documento obra...");
    const obraId = `obra_teste_${Date.now()}`;
    const obraData = {
      nome: "Obra Teste Firestore",
      endereco: "Rua Teste, 123",
      cliente: "Cliente Teste",
      status: "Em andamento",
      tipo: "Piscina",
      valor: 15000,
      dataInicio: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: "test_user",
    };

    await setDoc(doc(db, "obras", obraId), obraData);
    console.log("✅ Obra documento sucesso:", obraId);

    console.log("🎉 TODOS OS TESTES DE ESCRITA PASSARAM!");
    return {
      success: true,
      tests: [
        { type: "addDoc", id: docRef1.id, status: "success" },
        { type: "setDoc", id: testId, status: "success" },
        { type: "obra", id: obraId, status: "success" },
      ],
    };
  } catch (error: any) {
    console.error("❌ Erro no teste de escrita:", error);
    console.error("🔍 Código:", error.code);
    console.error("🔍 Mensagem:", error.message);
    console.error("🔍 Stack:", error.stack);

    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.stack,
    };
  }
}

export async function diagnoseFirestoreIssues() {
  console.log("🔍 Diagnóstico completo Firestore...");

  const issues = [];
  const checks = [];

  // Verificação 1: Variáveis de ambiente
  const hasForceFlag = import.meta.env.VITE_FORCE_FIREBASE === "true";
  const isNetlify =
    import.meta.env.NETLIFY === "true" ||
    import.meta.env.VITE_IS_NETLIFY === "true";

  checks.push({
    name: "VITE_FORCE_FIREBASE",
    status: hasForceFlag ? "OK" : "MISSING",
    value: import.meta.env.VITE_FORCE_FIREBASE,
  });

  checks.push({
    name: "Ambiente Netlify",
    status: isNetlify ? "OK" : "LOCAL",
    value: `NETLIFY=${import.meta.env.NETLIFY}, VITE_IS_NETLIFY=${import.meta.env.VITE_IS_NETLIFY}`,
  });

  if (!hasForceFlag && !isNetlify) {
    issues.push("Firestore não será inicializado - nem forçado nem no Netlify");
  }

  // Verificação 2: Inicialização Firestore
  try {
    const db = await getFirebaseFirestoreAsync();
    if (db) {
      checks.push({
        name: "Firestore Inicialização",
        status: "OK",
        value: "Inicializado com sucesso",
      });
    } else {
      checks.push({
        name: "Firestore Inicialização",
        status: "FAIL",
        value: "Retornou null",
      });
      issues.push("Firestore não conseguiu ser inicializado");
    }
  } catch (error: any) {
    checks.push({
      name: "Firestore Inicialização",
      status: "ERROR",
      value: error.message,
    });
    issues.push(`Erro na inicialização: ${error.message}`);
  }

  // Verificação 3: Teste de escrita
  try {
    const writeTest = await testFirestoreWriteCapability();
    if (writeTest.success) {
      checks.push({
        name: "Teste Escrita",
        status: "OK",
        value: "Todos os testes passaram",
      });
    } else {
      checks.push({
        name: "Teste Escrita",
        status: "FAIL",
        value: writeTest.error,
      });
      issues.push(`Escrita falhou: ${writeTest.error}`);
    }
  } catch (error: any) {
    checks.push({
      name: "Teste Escrita",
      status: "ERROR",
      value: error.message,
    });
    issues.push(`Erro no teste: ${error.message}`);
  }

  console.log("📋 Resultado do diagnóstico:");
  console.table(checks);

  if (issues.length > 0) {
    console.log("⚠️ Problemas encontrados:");
    issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
  } else {
    console.log("✅ Nenhum problema encontrado!");
  }

  return { checks, issues };
}
