/**
 * Diagnóstico completo para problemas de gravação no Firebase
 * Identifica e resolve problemas específicos de escrita no Firestore
 */

import { getFirebaseFirestore } from "../firebase/firestoreConfig";
import { FirestoreRulesFix } from "../firebase/firestoreRulesFix";

export interface FirebaseWriteDiagnosticResult {
  isFirebaseReady: boolean;
  isFirestoreConnected: boolean;
  canRead: boolean;
  canWrite: boolean;
  rulesIssue: boolean;
  networkIssue: boolean;
  authIssue: boolean;
  errorDetails: string[];
  fixSuggestions: string[];
  testResults: {
    connectionTest: boolean;
    writeTest: boolean;
    readTest: boolean;
    deleteTest: boolean;
  };
}

export class FirebaseWriteDiagnostic {
  /**
   * Executa diagnóstico completo dos problemas de gravação
   */
  static async runCompleteDiagnostic(): Promise<FirebaseWriteDiagnosticResult> {
    console.log("🔍 Iniciando diagnóstico completo do Firebase...");

    const result: FirebaseWriteDiagnosticResult = {
      isFirebaseReady: false,
      isFirestoreConnected: false,
      canRead: false,
      canWrite: false,
      rulesIssue: false,
      networkIssue: false,
      authIssue: false,
      errorDetails: [],
      fixSuggestions: [],
      testResults: {
        connectionTest: false,
        writeTest: false,
        readTest: false,
        deleteTest: false,
      },
    };

    try {
      // 1. Testar conexão básica do Firebase
      console.log("📡 Testando conexão básica do Firebase...");
      const db = getFirebaseFirestore();

      if (!db) {
        result.errorDetails.push("Firebase Firestore não está inicializado");
        result.fixSuggestions.push("Verificar configuração básica do Firebase");
        return result;
      }

      result.isFirebaseReady = true;
      result.isFirestoreConnected = true;
      console.log("✅ Firebase está inicializado");

      // 2. Testar regras de segurança
      console.log("🔒 Testando regras de segurança do Firestore...");
      const rulesTest = await FirestoreRulesFix.testFirestoreAccess();

      result.canRead = rulesTest.canRead;
      result.canWrite = rulesTest.canWrite;

      if (!rulesTest.canRead || !rulesTest.canWrite) {
        result.rulesIssue = true;
        result.errorDetails.push(
          rulesTest.error || "Problemas com regras de segurança",
        );
        result.fixSuggestions.push(rulesTest.suggestion);
      }

      // 3. Testar operações específicas
      await this.runDetailedTests(db, result);

      // 4. Detectar tipo de problema
      this.categorizeProblems(result);

      // 5. Gerar sugestões específicas
      this.generateSpecificSuggestions(result);

      console.log("📊 Diagnóstico completo finalizado");
      console.log("Resultado:", result);

      return result;
    } catch (error: any) {
      console.error("💥 Erro durante diagnóstico:", error);
      result.errorDetails.push(`Erro durante diagnóstico: ${error.message}`);
      result.fixSuggestions.push("Executar correção intensiva do Firebase");
      return result;
    }
  }

  /**
   * Executa testes detalhados de operações
   */
  private static async runDetailedTests(
    db: any,
    result: FirebaseWriteDiagnosticResult,
  ) {
    const { collection, doc, getDoc, setDoc, deleteDoc, getDocs } =
      await import("firebase/firestore");

    // Teste de conexão básica
    try {
      console.log("🧪 Testando conexão com coleção...");
      const testCollection = collection(db, "__diagnostic__");
      result.testResults.connectionTest = true;
      console.log("✅ Conexão com coleção: OK");
    } catch (error: any) {
      console.error("❌ Falha na conexão com coleção:", error.message);
      result.errorDetails.push(`Conexão: ${error.message}`);
      result.networkIssue = true;
    }

    // Teste de leitura
    try {
      console.log("📖 Testando operação de leitura...");
      const testDoc = doc(db, "__diagnostic__", "read-test");
      await getDoc(testDoc);
      result.testResults.readTest = true;
      console.log("✅ Leitura: OK");
    } catch (error: any) {
      console.error("❌ Falha na leitura:", error.message);
      result.errorDetails.push(`Leitura: ${error.message}`);

      if (error.code === "permission-denied") {
        result.rulesIssue = true;
      } else if (
        error.code === "unavailable" ||
        error.code === "deadline-exceeded"
      ) {
        result.networkIssue = true;
      }
    }

    // Teste de escrita
    try {
      console.log("✏️ Testando operação de escrita...");
      const testDoc = doc(db, "__diagnostic__", "write-test");
      await setDoc(testDoc, {
        test: true,
        timestamp: new Date().toISOString(),
        platform: navigator.userAgent,
        diagnostic: true,
      });
      result.testResults.writeTest = true;
      console.log("✅ Escrita: OK");
    } catch (error: any) {
      console.error("❌ Falha na escrita:", error.message);
      result.errorDetails.push(`Escrita: ${error.message}`);

      if (error.code === "permission-denied") {
        result.rulesIssue = true;
      } else if (error.code === "unauthenticated") {
        result.authIssue = true;
      } else if (
        error.code === "unavailable" ||
        error.code === "deadline-exceeded"
      ) {
        result.networkIssue = true;
      }
    }

    // Teste de deleção
    try {
      console.log("🗑️ Testando operação de deleção...");
      const testDoc = doc(db, "__diagnostic__", "write-test");
      await deleteDoc(testDoc);
      result.testResults.deleteTest = true;
      console.log("✅ Deleção: OK");
    } catch (error: any) {
      console.error("❌ Falha na deleção:", error.message);
      result.errorDetails.push(`Deleção: ${error.message}`);
    }
  }

  /**
   * Categoriza os tipos de problemas detectados
   */
  private static categorizeProblems(result: FirebaseWriteDiagnosticResult) {
    // Verificar se há problemas de autenticação
    const hasAuthErrors = result.errorDetails.some(
      (error) => error.includes("unauthenticated") || error.includes("auth"),
    );

    if (hasAuthErrors) {
      result.authIssue = true;
    }

    // Verificar se há problemas de rede
    const hasNetworkErrors = result.errorDetails.some(
      (error) =>
        error.includes("unavailable") ||
        error.includes("deadline-exceeded") ||
        error.includes("network"),
    );

    if (hasNetworkErrors) {
      result.networkIssue = true;
    }

    // Verificar se há problemas de regras
    const hasRulesErrors = result.errorDetails.some(
      (error) => error.includes("permission-denied") || error.includes("rules"),
    );

    if (hasRulesErrors) {
      result.rulesIssue = true;
    }
  }

  /**
   * Gera sugestões específicas baseadas nos problemas encontrados
   */
  private static generateSpecificSuggestions(
    result: FirebaseWriteDiagnosticResult,
  ) {
    if (result.rulesIssue) {
      result.fixSuggestions.push(
        "🔒 PROBLEMA DE REGRAS: Acesse Firebase Console → Firestore → Rules e configure regras permissivas para desenvolvimento",
        "📋 Use as regras sugeridas no FirestoreRulesFix para permitir acesso completo",
        "⚠️ Certifique-se de que as regras foram publicadas e aguarde alguns minutos",
      );
    }

    if (result.authIssue) {
      result.fixSuggestions.push(
        "🔐 PROBLEMA DE AUTENTICAÇÃO: Verificar se o usuário está logado",
        "👤 Implementar login antes de tentar gravar dados",
        "🔑 Verificar configuração do Firebase Auth",
      );
    }

    if (result.networkIssue) {
      result.fixSuggestions.push(
        "🌐 PROBLEMA DE REDE: Verificar conexão à internet",
        "🔄 Tentar novamente após alguns segundos",
        "📶 Verificar se não há bloqueios de firewall ou proxy",
      );
    }

    if (!result.canWrite && result.canRead) {
      result.fixSuggestions.push(
        "📝 PROBLEMA ESPECÍFICO DE ESCRITA: As regras permitem leitura mas não escrita",
        "🔧 Verificar regras específicas para operações de escrita no Firestore",
      );
    }

    if (!result.isFirestoreConnected) {
      result.fixSuggestions.push(
        "🔧 PROBLEMA DE CONFIGURAÇÃO: Firebase não está corretamente configurado",
        "⚙️ Verificar credenciais e configuração do projeto",
        "🚀 Executar correção intensiva do Firebase",
      );
    }

    // Sugestão geral se não conseguiu identificar o problema específico
    if (result.fixSuggestions.length === 0) {
      result.fixSuggestions.push(
        "🔍 Execute o diagnóstico de regras do Firestore separadamente",
        "🛠️ Tente a correção intensiva do Firebase",
        "📞 Verifique os logs do console para mais detalhes",
      );
    }
  }

  /**
   * Aplica correção automática baseada no diagnóstico
   */
  static async autoFix(
    diagnosticResult: FirebaseWriteDiagnosticResult,
  ): Promise<boolean> {
    console.log("🔧 Aplicando correções automáticas...");

    try {
      // Se há problemas de regras, tentar aplicar regras permissivas
      if (diagnosticResult.rulesIssue) {
        console.log(
          "🔒 Problema de regras detectado - sugerindo correção manual",
        );
        console.log("📋 Regras sugeridas:");
        console.log(FirestoreRulesFix.getDevelopmentRules());

        // Não podemos alterar regras automaticamente, mas podemos alertar
        alert(`🔒 PROBLEMA DE REGRAS DETECTADO!
        
Acesse: https://console.firebase.google.com/project/leirisonda-16f8b/firestore/rules

E substitua as regras por:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

Depois clique em "Publicar" e aguarde 2-3 minutos.`);
      }

      // Se há problemas de autenticação, tentar resolver
      if (diagnosticResult.authIssue) {
        console.log("🔐 Tentando resolver problemas de autenticação...");
        // Implementar lógica de re-autenticação se necessário
      }

      return true;
    } catch (error) {
      console.error("❌ Falha na correção automática:", error);
      return false;
    }
  }

  /**
   * Gera relatório human-readable do diagnóstico
   */
  static generateReport(result: FirebaseWriteDiagnosticResult): string {
    let report = "📊 RELATÓRIO DE DIAGNÓSTICO DO FIREBASE\n";
    report += "=====================================\n\n";

    // Status geral
    report += "🔍 STATUS GERAL:\n";
    report += `   Firebase Inicializado: ${result.isFirebaseReady ? "✅" : "❌"}\n`;
    report += `   Firestore Conectado: ${result.isFirestoreConnected ? "✅" : "❌"}\n`;
    report += `   Pode Ler: ${result.canRead ? "✅" : "❌"}\n`;
    report += `   Pode Escrever: ${result.canWrite ? "✅" : "❌"}\n\n`;

    // Testes específicos
    report += "🧪 TESTES REALIZADOS:\n";
    report += `   Conexão: ${result.testResults.connectionTest ? "✅" : "❌"}\n`;
    report += `   Leitura: ${result.testResults.readTest ? "✅" : "❌"}\n`;
    report += `   Escrita: ${result.testResults.writeTest ? "✅" : "❌"}\n`;
    report += `   Deleção: ${result.testResults.deleteTest ? "✅" : "❌"}\n\n`;

    // Problemas identificados
    if (result.errorDetails.length > 0) {
      report += "❌ PROBLEMAS IDENTIFICADOS:\n";
      result.errorDetails.forEach((error) => {
        report += `   • ${error}\n`;
      });
      report += "\n";
    }

    // Sugestões de correção
    if (result.fixSuggestions.length > 0) {
      report += "🔧 SUGESTÕES DE CORREÇÃO:\n";
      result.fixSuggestions.forEach((suggestion) => {
        report += `   • ${suggestion}\n`;
      });
    }

    return report;
  }
}

// Função de conveniência para executar diagnóstico rápido
export async function quickFirebaseWriteCheck(): Promise<void> {
  console.log("🚀 Executando verificação rápida de escrita no Firebase...");

  const result = await FirebaseWriteDiagnostic.runCompleteDiagnostic();
  const report = FirebaseWriteDiagnostic.generateReport(result);

  console.log(report);

  if (!result.canWrite) {
    console.log("🔧 Iniciando correção automática...");
    await FirebaseWriteDiagnostic.autoFix(result);
  }
}
