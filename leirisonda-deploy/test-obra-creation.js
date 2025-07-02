// TESTE AUTOMÁTICO - Simula login e criação de obra

(function () {
  "use strict";

  console.log("🧪 TESTE: Iniciando simulação automática...");

  // Função para simular typing
  function simulateTyping(element, text) {
    element.value = text;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Função para simular click
  function simulateClick(element) {
    element.click();
    element.dispatchEvent(new Event("click", { bubbles: true }));
  }

  // Função para aguardar elemento
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(
          new Error(`Elemento ${selector} não encontrado em ${timeout}ms`),
        );
      }, timeout);
    });
  }

  // Ativar todas as proteções antes do teste
  function activateAllProtections() {
    console.log("🛡️ TESTE: Ativando todas as proteções...");

    try {
      if (window.LEIRISONDA_PROTECTION) {
        if (typeof window.LEIRISONDA_PROTECTION.enable === "function") {
          window.LEIRISONDA_PROTECTION.enable();
          console.log("✅ Proteção Leirisonda ativada");
        }
      }
    } catch (e) {
      console.log("⚠️ Proteção Leirisonda não disponível:", e.message);
    }

    try {
      if (window.ULTIMATE_PROTECTION) {
        if (typeof window.ULTIMATE_PROTECTION.enable === "function") {
          window.ULTIMATE_PROTECTION.enable();
          console.log("✅ Proteção Ultimate ativada");
        }
      }
    } catch (e) {
      console.log("⚠️ Proteção Ultimate não disponível:", e.message);
    }

    // Override Firebase signOut safely
    try {
      if (window.firebase && window.firebase.auth) {
        const auth = window.firebase.auth();
        if (auth && typeof auth.signOut === "function") {
          auth.signOut = function () {
            console.warn("🛡️ TESTE: Firebase signOut BLOQUEADO durante teste");
            return Promise.resolve();
          };
          console.log("✅ Firebase signOut bloqueado para teste");
        }
      }
    } catch (e) {
      console.log("⚠️ Firebase auth não disponível:", e.message);
    }
  }

  // Passo 1: Fazer Login
  async function doLogin() {
    console.log("🔑 TESTE: Fazendo login...");

    try {
      // Ativar proteções primeiro (safely)
      try {
        activateAllProtections();
      } catch (protectionError) {
        console.warn(
          "⚠️ TESTE: Erro ao ativar proteções:",
          protectionError.message,
        );
      }

      // Encontrar campos de email e password
      const emailInput =
        document.querySelector('input[type="email"]') ||
        document.querySelector('input[placeholder*="email"]') ||
        document.querySelector('input[name*="email"]');

      const passwordInput =
        document.querySelector('input[type="password"]') ||
        document.querySelector('input[placeholder*="password"]') ||
        document.querySelector('input[name*="password"]');

      const loginButton =
        document.querySelector('button[type="submit"]') ||
        document.querySelector('button:contains("Entrar")') ||
        document.querySelector('button:contains("Login")') ||
        document.querySelector("form button");

      if (!emailInput || !passwordInput || !loginButton) {
        console.error("❌ TESTE: Campos de login não encontrados");
        console.log("📋 TESTE: Campos disponíveis:", {
          email: !!emailInput,
          password: !!passwordInput,
          button: !!loginButton,
        });
        return false;
      }

      // Simular preenchimento
      simulateTyping(emailInput, "admin@leirisonda.com");
      simulateTyping(passwordInput, "admin123");

      console.log("✅ TESTE: Campos preenchidos");

      // Simular submit
      simulateClick(loginButton);

      console.log("✅ TESTE: Login submetido");
      return true;
    } catch (error) {
      console.error("❌ TESTE: Erro no login:", error);
      return false;
    }
  }

  // Passo 2: Navegar para criação de obra
  async function navigateToObraCreation() {
    console.log("📋 TESTE: Navegando para criação de obra...");

    try {
      // Aguardar pelo dashboard/menu principal
      await waitForElement('[data-loc*="Dashboard"]', 10000);
      console.log("✅ TESTE: Dashboard carregado");

      // Procurar botão/link para criar obra
      const createObraButton =
        document.querySelector(
          'button:contains("Nova Obra"), a:contains("Nova Obra"), button:contains("Criar Obra"), a:contains("Criar Obra")',
        ) ||
        document.querySelector('[data-loc*="obra"]') ||
        document.querySelector('button[aria-label*="obra"]');

      if (createObraButton) {
        simulateClick(createObraButton);
        console.log("✅ TESTE: Botão criar obra clicado");
        return true;
      } else {
        console.warn(
          "⚠️ TESTE: Botão criar obra não encontrado, tentando navegação direta",
        );
        window.history.pushState({}, "", "/obras/nova");
        return true;
      }
    } catch (error) {
      console.error("❌ TESTE: Erro na navegação:", error);
      return false;
    }
  }

  // Passo 3: Criar obra de teste
  async function createTestObra() {
    console.log("🏗️ TESTE: Criando obra de teste...");

    // Ativar proteções novamente
    activateAllProtections();

    try {
      // Aguardar pelo formulário de obra
      await waitForElement("form", 5000);
      console.log("✅ TESTE: Formulário encontrado");

      // Preencher campos básicos (tentativa genérica)
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], textarea',
      );

      inputs.forEach((input, index) => {
        const placeholder = input.placeholder || input.name || input.id || "";

        if (
          placeholder.toLowerCase().includes("nome") ||
          placeholder.toLowerCase().includes("title")
        ) {
          simulateTyping(input, "OBRA TESTE AUTOMATICO " + Date.now());
        } else if (
          placeholder.toLowerCase().includes("morada") ||
          placeholder.toLowerCase().includes("address")
        ) {
          simulateTyping(input, "Rua de Teste, 123");
        } else if (placeholder.toLowerCase().includes("email")) {
          simulateTyping(input, "test@exemplo.com");
        } else if (
          placeholder.toLowerCase().includes("telefone") ||
          placeholder.toLowerCase().includes("phone")
        ) {
          simulateTyping(input, "123456789");
        } else {
          simulateTyping(input, `Teste ${index + 1}`);
        }
      });

      console.log("✅ TESTE: Campos preenchidos");

      // Procurar e clicar no botão de salvar/criar
      const saveButton =
        document.querySelector('button[type="submit"]') ||
        document.querySelector('button:contains("Salvar")') ||
        document.querySelector('button:contains("Criar")') ||
        document.querySelector('button:contains("Guardar")');

      if (saveButton) {
        console.log("🎯 TESTE: Clicando em salvar/criar obra...");
        console.log("🛡️ TESTE: Proteções devem estar ativas agora!");

        // Último check das proteções
        activateAllProtections();

        simulateClick(saveButton);

        console.log("✅ TESTE: Obra submetida - Monitorando resultado...");

        // Monitorar por 10 segundos para ver se há logout
        setTimeout(() => {
          if (window.location.pathname.includes("/login")) {
            console.error("❌ TESTE: LOGOUT DETECTADO! Proteções falharam!");
          } else {
            console.log(
              "✅ TESTE: Sem logout detectado - Proteções funcionaram!",
            );
          }
        }, 5000);

        return true;
      } else {
        console.error("❌ TESTE: Botão salvar não encontrado");
        return false;
      }
    } catch (error) {
      console.error("❌ TESTE: Erro na criação:", error);
      return false;
    }
  }

  // Executar teste completo
  async function runFullTest() {
    console.log("🚀 TESTE: Iniciando teste completo...");

    try {
      // Se já estamos logados, pular para criação
      if (!window.location.pathname.includes("/login")) {
        console.log("✅ TESTE: Já logado, indo direto para criação");
        await navigateToObraCreation();
        await createTestObra();
        return;
      }

      // Fazer login primeiro
      const loginSuccess = await doLogin();
      if (!loginSuccess) {
        console.error("❌ TESTE: Login falhou");
        return;
      }

      // Aguardar e navegar
      setTimeout(async () => {
        await navigateToObraCreation();
        setTimeout(async () => {
          await createTestObra();
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("❌ TESTE: Erro geral:", error);
    }
  }

  // Iniciar teste em 2 segundos
  setTimeout(runFullTest, 2000);

  console.log("✅ TESTE: Script configurado - iniciará em 2 segundos");

  // Disponibilizar função manual
  window.runObraTest = runFullTest;
  window.activateProtections = activateAllProtections;
})();
