// REMOVE SIDEBAR SECTIONS - Remove seções Administração e Diagnóstico do sidebar

console.log("🗑️ SIDEBAR: Removendo seções desnecessárias do sidebar...");

(function () {
  "use strict";

  // Função para remover seções específicas
  function removeSidebarSections() {
    let removedSections = 0;

    // Procurar por elementos que contenham "Diagnóstico" ou "Administração"
    const allElements = document.querySelectorAll("*");

    for (const element of allElements) {
      const textContent = element.textContent?.trim();

      if (textContent === "Diagnóstico" || textContent === "Administração") {
        // Encontrar o container pai que provavelmente contém toda a seção
        let sectionContainer = element;

        // Subir na hierarquia DOM para encontrar o container da seção
        for (let i = 0; i < 10; i++) {
          sectionContainer = sectionContainer.parentElement;
          if (!sectionContainer) break;

          // Se encontrarmos um container que parece ser uma seção completa
          if (
            sectionContainer.querySelector("button") ||
            sectionContainer.classList.contains("space-y-") ||
            sectionContainer.children.length > 2
          ) {
            console.log(`🗑️ SIDEBAR: Removendo seção "${textContent}"`);
            sectionContainer.style.display = "none";
            removedSections++;
            break;
          }
        }
      }
    }

    // Procurar especificamente por texto "Diagnóstico de Sincronização" e similares
    const diagnosticButtons = document.querySelectorAll("button");
    for (const button of diagnosticButtons) {
      const buttonText = button.textContent?.toLowerCase() || "";

      if (
        buttonText.includes("diagnóstico") ||
        buttonText.includes("diagnostic") ||
        buttonText.includes("sync") ||
        buttonText.includes("sincronização") ||
        buttonText.includes("administração") ||
        buttonText.includes("administration")
      ) {
        console.log(`🗑️ SIDEBAR: Removendo botão "${button.textContent}"`);
        button.style.display = "none";
        removedSections++;
      }
    }

    // Procurar por elementos com data-loc que referenciem essas páginas
    const dataLocElements = document.querySelectorAll(
      '[data-loc*="Diagnostic"], [data-loc*="Administration"]',
    );
    for (const element of dataLocElements) {
      console.log(
        `🗑️ SIDEBAR: Removendo elemento com data-loc "${element.getAttribute("data-loc")}"`,
      );
      element.style.display = "none";
      removedSections++;
    }

    // Procurar por links específicos
    const links = document.querySelectorAll(
      'a[href*="diagnostic"], a[href*="administration"], a[href*="sync"]',
    );
    for (const link of links) {
      console.log(`🗑️ SIDEBAR: Removendo link "${link.href}"`);
      link.style.display = "none";
      removedSections++;
    }

    return removedSections;
  }

  // Função para remover seções por seletor CSS mais específico
  function removeByCSS() {
    const selectorsToHide = [
      // Elementos que contenham texto específico
      '*:contains("Diagnóstico")',
      '*:contains("Administração")',
      // Elementos com classes específicas do sidebar
      '.space-y-2 > div:has(:contains("Diagnóstico"))',
      '.space-y-2 > div:has(:contains("Administração"))',
      // Buttons específicos
      'button:contains("Diagnóstico")',
      'button:contains("Administração")',
    ];

    let removed = 0;

    // Como :contains não é suportado nativamente, usar alternativa
    const allElements = document.querySelectorAll("*");
    for (const element of allElements) {
      const text = element.textContent?.toLowerCase() || "";

      if (
        (text.includes("diagnóstico") || text.includes("administração")) &&
        !text.includes("configurações")
      ) {
        // Se é um elemento pequeno (provavelmente só texto), esconder o pai
        if (
          element.children.length === 0 &&
          element.textContent?.trim().length < 50
        ) {
          let parent = element.parentElement;
          for (let i = 0; i < 5; i++) {
            if (!parent) break;

            if (parent.tagName === "DIV" && parent.children.length > 1) {
              console.log(
                `🗑️ SIDEBAR: Removendo container pai de "${element.textContent}"`,
              );
              parent.style.display = "none";
              removed++;
              break;
            }
            parent = parent.parentElement;
          }
        } else {
          console.log(
            `🗑️ SIDEBAR: Removendo elemento "${element.textContent?.substring(0, 50)}..."`,
          );
          element.style.display = "none";
          removed++;
        }
      }
    }

    return removed;
  }

  // Função mais agressiva - remover por posição no sidebar
  function removeByPosition() {
    // Procurar pelo sidebar
    const sidebarElements = document.querySelectorAll('[data-loc*="Sidebar"]');

    for (const sidebar of sidebarElements) {
      // Procurar por seções que contenham os termos problemáticos
      const sections = sidebar.querySelectorAll("div");

      for (const section of sections) {
        const sectionText = section.textContent?.toLowerCase() || "";

        if (
          (sectionText.includes("diagnóstico") &&
            !sectionText.includes("configurações")) ||
          (sectionText.includes("administração") &&
            !sectionText.includes("configurações"))
        ) {
          console.log(`🗑️ SIDEBAR: Removendo seção completa`);
          section.style.display = "none";
        }
      }
    }
  }

  // Remover estilos inline que possam restaurar visibilidade
  function ensureHidden() {
    const hiddenElements = document.querySelectorAll(
      '[style*="display: none"]',
    );
    for (const element of hiddenElements) {
      const text = element.textContent?.toLowerCase() || "";
      if (text.includes("diagnóstico") || text.includes("administração")) {
        element.style.display = "none !important";
        element.style.visibility = "hidden";
        element.style.opacity = "0";
        element.style.height = "0";
        element.style.overflow = "hidden";
      }
    }
  }

  // Executar remoção
  function executeRemoval() {
    try {
      const removed1 = removeSidebarSections();
      const removed2 = removeByCSS();
      removeByPosition();
      ensureHidden();

      const totalRemoved = removed1 + removed2;

      if (totalRemoved > 0) {
        console.log(
          `✅ SIDEBAR: ${totalRemoved} elementos removidos com sucesso`,
        );
      } else {
        console.log(`⚠️ SIDEBAR: Nenhum elemento encontrado para remover`);
      }
    } catch (error) {
      console.error("❌ SIDEBAR: Erro ao remover seções:", error);
    }
  }

  // Executar múltiplas vezes para garantir remoção
  function scheduleRemoval() {
    // Executar imediatamente
    executeRemoval();

    // Executar após 2 segundos
    setTimeout(executeRemoval, 2000);

    // Executar após 5 segundos
    setTimeout(executeRemoval, 5000);

    // Monitor contínuo por 30 segundos
    const monitor = setInterval(() => {
      executeRemoval();
    }, 3000);

    setTimeout(() => {
      clearInterval(monitor);
      console.log("🗑️ SIDEBAR: Monitor de remoção finalizado");
    }, 30000);
  }

  // Aguardar DOM estar pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRemoval);
  } else {
    // Aguardar um pouco para a aplicação carregar
    setTimeout(scheduleRemoval, 1000);
  }

  console.log("🗑️ SIDEBAR: Sistema de remoção iniciado");
})();
