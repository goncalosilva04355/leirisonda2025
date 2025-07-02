// TEST UNDEFINED FIX - Testar se campos undefined são removidos

console.log("🧪 UNDEFINED TEST: Carregando teste de campos undefined...");

(function () {
  "use strict";

  function createTestButton() {
    // Remove existing button
    const existing = document.getElementById("undefined-test-btn");
    if (existing) existing.remove();

    const button = document.createElement("button");
    button.id = "undefined-test-btn";
    button.innerHTML = "🧪 Test Undefined";
    button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 120px;
      height: 40px;
      border-radius: 5px;
      border: none;
      background: #EF4444;
      color: white;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 9998;
    `;

    button.onclick = testUndefinedRemoval;
    button.title = "Testar remoção de campos undefined";

    document.body.appendChild(button);
  }

  function testUndefinedRemoval() {
    console.log("🧪 UNDEFINED TEST: Iniciando teste...");

    // Criar dados de teste com campos undefined
    const testData = {
      id: "test_undefined_" + Date.now(),
      workSheetNumber: "TEST-123",
      clientName: "Cliente Teste",
      exitTime: undefined, // Campo problemático
      entryTime: new Date(),
      observations: "Teste de campos undefined",
      undefinedField: undefined,
      nullField: null,
      emptyString: "",
      validField: "valor válido",
      nestedObject: {
        validNested: "ok",
        undefinedNested: undefined,
        exitTime: undefined,
      },
      arrayWithUndefined: [
        { value: "ok" },
        { value: undefined },
        undefined,
        "string válida",
      ],
    };

    console.log("🧪 UNDEFINED TEST: Dados originais:", testData);

    // Testar se setDoc limpa os dados
    if (window.setDoc) {
      console.log("🧪 UNDEFINED TEST: Testando setDoc...");

      const mockDocRef = { path: "test/document" };

      try {
        // Isto deve disparar nossos interceptores
        window.setDoc(mockDocRef, testData);
        console.log("✅ UNDEFINED TEST: setDoc executado sem erro");
      } catch (error) {
        console.error("❌ UNDEFINED TEST: Erro em setDoc:", error);

        if (error.message.includes("undefined")) {
          alert(
            "❌ ERRO: Campos undefined ainda não foram removidos! Verificar scripts de limpeza.",
          );
        }
      }
    } else {
      console.warn("🧪 UNDEFINED TEST: setDoc não encontrado");
    }

    // Testar limpeza manual
    if (window.removeUndefinedFields) {
      console.log("🧪 UNDEFINED TEST: Testando limpeza manual...");
      const cleanedData = window.removeUndefinedFields(testData);
      console.log("🧪 UNDEFINED TEST: Dados limpos:", cleanedData);

      if (
        cleanedData.exitTime === undefined ||
        cleanedData.undefinedField !== undefined
      ) {
        alert("❌ ERRO: Limpeza manual falhou!");
      } else {
        alert("✅ SUCESSO: Campos undefined removidos corretamente!");
      }
    }

    // Simular criação de obra problemática
    console.log(
      "🧪 UNDEFINED TEST: Simulando criação de obra com exitTime undefined...",
    );

    const problematicWork = {
      id: "work_" + Date.now(),
      workSheetNumber: "OB-" + Math.floor(Math.random() * 1000),
      clientName: "Cliente com Exit Time Undefined",
      exitTime: undefined, // Este campo está causando o erro
      entryTime: new Date().toISOString(),
      assignedUsers: ["user_test"],
      observations: "Obra de teste com exitTime undefined",
    };

    // Tentar salvar no localStorage para disparar interceptores
    localStorage.setItem(
      "test_problematic_work",
      JSON.stringify(problematicWork),
    );

    console.log("🧪 UNDEFINED TEST: Teste completo");
  }

  // Expor função de limpeza global para teste
  window.testUndefinedRemoval = testUndefinedRemoval;

  // Criar botão após um delay
  setTimeout(createTestButton, 3000);

  console.log("🧪 UNDEFINED TEST: Teste carregado (botão aparecerá em 3s)");
})();
