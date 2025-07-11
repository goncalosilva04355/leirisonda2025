// Diagnóstico completo para problemas de inserção de dados
export class DataInputDiagnostic {
  static async runCompleteDiagnostic(): Promise<void> {
    console.log("🔍 === DIAGNÓSTICO DE INSERÇÃO DE DADOS ===");

    // 1. Verificar estado do Firebase
    await this.checkFirebaseStatus();

    // 2. Testar inputs HTML
    this.checkHTMLInputs();

    // 3. Verificar localStorage
    this.checkLocalStorage();

    // 4. Testar autenticação
    await this.testAuthentication();

    // 5. Verificar formulários
    this.checkFormHandling();

    // 6. Sugerir soluções
    this.suggestSolutions();
  }

  private static async checkFirebaseStatus(): Promise<void> {
    console.log("🔥 Verificando Firebase...");

    try {
      const { firebaseService } = await import("../firebase/robustConfig");
      const isInit = await firebaseService.initialize();
      console.log("✅ Firebase inicializado:", isInit);

      const auth = await firebaseService.getAuth();
      console.log("🔐 Firebase Auth disponível:", !!auth);

      const firestore = await firebaseService.getFirestore();
      console.log("📊 Firestore disponível:", !!firestore);
    } catch (error) {
      console.error("❌ Erro no Firebase:", error);
      console.log("💡 Será usado modo local");
    }
  }

  private static checkHTMLInputs(): void {
    console.log("📝 Verificando inputs HTML...");

    // Verificar se inputs estão funcionando
    const inputs = document.querySelectorAll("input");
    console.log("📊 Total de inputs encontrados:", inputs.length);

    inputs.forEach((input, index) => {
      console.log(`Input ${index}:`, {
        type: input.type,
        disabled: input.disabled,
        readonly: input.readOnly,
        value: input.value?.substring(0, 10) + "...",
        placeholder: input.placeholder,
      });
    });

    // Testar se um input aceita valor
    if (inputs.length > 0) {
      const testInput = inputs[0] as HTMLInputElement;
      const originalValue = testInput.value;
      testInput.value = "teste";
      const canSetValue = testInput.value === "teste";
      testInput.value = originalValue;
      console.log("✅ Inputs podem receber valores:", canSetValue);
    }
  }

  private static checkLocalStorage(): void {
    console.log("💾 Verificando localStorage...");

    try {
      // Testar se localStorage funciona
      localStorage.setItem("test", "ok");
      const test = localStorage.getItem("test");
      localStorage.removeItem("test");
      console.log("✅ localStorage funcional:", test === "ok");

      // Verificar dados existentes
      const users = localStorage.getItem("app-users");
      const works = localStorage.getItem("works");

      console.log(
        "📊 Utilizadores no localStorage:",
        users ? JSON.parse(users).length : 0,
      );
      console.log(
        "📊 Obras no localStorage:",
        works ? JSON.parse(works).length : 0,
      );
    } catch (error) {
      console.error("❌ Erro no localStorage:", error);
    }
  }

  private static async testAuthentication(): Promise<void> {
    console.log("🔐 Testando autenticação...");

    try {
      const { robustLoginService } = await import(
        "../services/robustLoginService"
      );

      // Testar login local
      const testResult = await authService.login("teste@teste.com", "123");
      console.log("✅ Autenticação local funciona:", testResult.success);

      if (testResult.success) {
        await authService.logout();
        console.log("✅ Logout funciona");
      }
    } catch (error) {
      console.error("❌ Erro na autenticação:", error);
    }
  }

  private static checkFormHandling(): void {
    console.log("📋 Verificando formulários...");

    const forms = document.querySelectorAll("form");
    console.log("📊 Total de formulários:", forms.length);

    forms.forEach((form, index) => {
      console.log(`Formulário ${index}:`, {
        method: form.method,
        action: form.action,
        hasOnSubmit: !!form.onsubmit,
        disabled: form.hasAttribute("disabled"),
      });
    });

    // Verificar event listeners
    const buttons = document.querySelectorAll('button[type="submit"]');
    console.log("📊 Botões submit encontrados:", buttons.length);
  }

  private static suggestSolutions(): void {
    console.log("💡 === SOLUÇÕES SUGERIDAS ===");

    console.log(`
    🔧 Soluções possíveis:
    
    1. TESTE BÁSICO DE LOGIN:
       - Email: teste@teste.com
       - Password: 123
    
    2. VERIFICAR CONSOLE:
       - Abrir F12 -> Console
       - Procurar erros em vermelho
    
    3. LIMPAR CACHE:
       - F12 -> Application -> Storage -> Clear storage
    
    4. TESTAR MODO INCOGNITO:
       - Ctrl+Shift+N (Chrome)
       - Testar sem cache/cookies
    
    5. VERIFICAR INTERNET:
       - Firebase precisa de conectividade
       - Modo local funciona offline
    
    6. RECARREGAR PÁGINA:
       - F5 ou Ctrl+F5 (hard reload)
    `);
  }
}

// Auto-executar diagnóstico quando importado
if (typeof window !== "undefined") {
  console.log("🚀 Iniciando diagnóstico automático...");
  setTimeout(() => {
    DataInputDiagnostic.runCompleteDiagnostic();
  }, 2000);
}

export default DataInputDiagnostic;
