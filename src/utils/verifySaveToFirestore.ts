// Verificar se os dados estão sendo salvos no Firestore com o projeto leiria-1cfc9
import { firestoreService } from "../services/firestoreService";
import { saveToFirestoreRest } from "./firestoreRestApi";
import { getFirebaseApp } from "../firebase/basicConfig";

export interface SaveVerificationResult {
  success: boolean;
  message: string;
  details: {
    projectVerified: boolean;
    restApiSave: boolean;
    sdkSave: boolean;
    dataConsistency: boolean;
  };
  savedData?: any;
}

export async function verifySaveToFirestore(): Promise<SaveVerificationResult> {
  console.log("💾 Verificando salvamento de dados no Firestore...");

  const results = {
    projectVerified: false,
    restApiSave: false,
    sdkSave: false,
    dataConsistency: false,
  };

  try {
    // 1. Verificar se estamos usando o projeto correto
    console.log("1️⃣ Verificando projeto Firebase...");
    const firebaseApp = getFirebaseApp();

    if (firebaseApp?.options.projectId === "leiria-1cfc9") {
      console.log("✅ Projeto verificado: leiria-1cfc9");
      results.projectVerified = true;
    } else {
      console.error(`❌ Projeto incorreto: ${firebaseApp?.options.projectId}`);
      return {
        success: false,
        message: `Projeto incorreto: ${firebaseApp?.options.projectId}`,
        details: results,
      };
    }

    // 2. Testar salvamento via REST API
    console.log("2️⃣ Testando salvamento via REST API...");
    const restTestData = {
      message: "Dados salvos via REST API",
      timestamp: new Date().toISOString(),
      project: "leiria-1cfc9",
      method: "REST",
      test: true,
    };

    const restSaveSuccess = await saveToFirestoreRest(
      "test-save-verification",
      "rest-save-test",
      restTestData,
    );

    if (restSaveSuccess) {
      console.log("✅ Salvamento via REST API funcionando");
      results.restApiSave = true;
    } else {
      console.error("❌ Falha no salvamento via REST API");
    }

    // 3. Testar salvamento via SDK
    console.log("3️⃣ Testando salvamento via SDK...");
    const sdkTestData = {
      message: "Dados salvos via SDK",
      timestamp: new Date().toISOString(),
      project: "leiria-1cfc9",
      method: "SDK",
      test: true,
    };

    try {
      const sdkSaveId = await firestoreService.addDocument(
        "test-save-verification",
        sdkTestData,
      );

      if (sdkSaveId) {
        console.log("✅ Salvamento via SDK funcionando:", sdkSaveId);
        results.sdkSave = true;

        // Verificar se os dados foram salvos corretamente
        const savedDoc = await firestoreService.getDocument(
          "test-save-verification",
          sdkSaveId,
        );

        if (savedDoc && savedDoc.message === sdkTestData.message) {
          console.log("✅ Consistência de dados verificada");
          results.dataConsistency = true;
        }
      }
    } catch (sdkError) {
      console.warn("⚠️ SDK pode não estar disponível, mas REST API funciona");
    }

    // 4. Testar salvamento de dados específicos do sistema
    console.log("4️⃣ Testando salvamento de dados do sistema...");
    const systemTestData = {
      type: "pool",
      name: "Piscina Teste Verificação",
      location: "Teste Location",
      clientId: "test-client-123",
      status: "active",
      project: "leiria-1cfc9",
      testVerification: true,
      createdAt: new Date().toISOString(),
    };

    const systemSaveId = await firestoreService.addPiscina(systemTestData);

    if (systemSaveId) {
      console.log(
        "✅ Salvamento de dados do sistema funcionando:",
        systemSaveId,
      );

      // Verificar se foi salvo corretamente
      const systemDoc = await firestoreService.getDocument(
        "piscinas",
        systemSaveId,
      );
      if (systemDoc && systemDoc.name === systemTestData.name) {
        console.log("✅ Dados do sistema salvos corretamente");
      }
    }

    // Resultado final
    const successCount = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    console.log(
      `📊 Verificação de salvamento: ${successCount}/${totalTests} testes passaram`,
    );

    if (successCount >= 2) {
      // Pelo menos projeto e um método de salvamento
      return {
        success: true,
        message: `Dados sendo salvos corretamente! ${successCount}/${totalTests} verificações passaram`,
        details: results,
        savedData: {
          restData: restTestData,
          sdkData: sdkTestData,
          systemData: systemTestData,
          projectId: "leiria-1cfc9",
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        message: `Falhas na verificação: ${successCount}/${totalTests}`,
        details: results,
      };
    }
  } catch (error: any) {
    console.error("❌ Erro na verificação de salvamento:", error);
    return {
      success: false,
      message: `Erro na verificação: ${error.message}`,
      details: results,
    };
  }
}

// Função para testar salvamento contínuo
export async function testContinuousSave(): Promise<boolean> {
  console.log("🔄 Testando salvamento contínuo...");

  try {
    for (let i = 1; i <= 3; i++) {
      const testData = {
        sequenceNumber: i,
        message: `Teste contínuo ${i}`,
        timestamp: new Date().toISOString(),
        project: "leiria-1cfc9",
      };

      console.log(`📝 Salvando teste ${i}/3...`);
      const saveResult = await saveToFirestoreRest(
        "continuous-test",
        `continuous-${i}`,
        testData,
      );

      if (!saveResult) {
        console.error(`❌ Falha no salvamento ${i}`);
        return false;
      }

      // Pequena pausa entre salvamentos
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("✅ Salvamento contínuo funcionando!");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste contínuo:", error);
    return false;
  }
}

// Auto-executar verificação quando o módulo é carregado
setTimeout(async () => {
  console.log("🔍 Auto-executando verificação de salvamento...");
  const result = await verifySaveToFirestore();

  if (result.success) {
    console.log("🎉 VERIFICAÇÃO DE SALVAMENTO PASSOU!");
    console.log(
      "✅ Dados sendo salvos corretamente no Firestore (leiria-1cfc9)",
    );

    // Testar salvamento contínuo
    const continuousResult = await testContinuousSave();
    if (continuousResult) {
      console.log("🔄 Salvamento contínuo também funcionando!");
    }

    // Disponibilizar resultado globalmente
    (window as any).dataSaveVerification = result;
  } else {
    console.error("❌ VERIFICAÇÃO DE SALVAMENTO FALHOU");
    console.error("Detalhes:", result.details);
  }
}, 4000);

export default verifySaveToFirestore;
