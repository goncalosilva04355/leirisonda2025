import { saveUser, saveData, getData } from "./forceFirestore";

// Teste que FORÇA o Firestore a funcionar
setTimeout(async () => {
  try {
    console.log("🔥 TESTE FORÇA FIRESTORE: Iniciando...");

    // Aguardar inicialização
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Teste utilizador
    console.log("👤 Testando saveUser...");
    const userResult = await saveUser({
      uid: "force-test-user",
      email: "force@test.com",
      name: "Force Test",
      role: "admin",
    });

    if (userResult) {
      console.log("✅ saveUser: FUNCIONOU");
    } else {
      console.error("❌ saveUser: FALHOU");
    }

    // Teste dados
    console.log("💾 Testando saveData...");
    const dataId = await saveData("test", {
      message: "Força Firestore funcionando!",
      timestamp: new Date().toISOString(),
    });

    console.log("✅ saveData: FUNCIONOU, ID:", dataId);

    // Teste leitura
    console.log("📖 Testando getData...");
    const data = await getData("test");
    console.log("✅ getData: FUNCIONOU, dados:", data.length);

    if (data.length > 0) {
      console.log("🎉 FORÇA FIRESTORE: TODOS OS TESTES PASSARAM!");
      console.log("✅ Utilizadores: OK");
      console.log("✅ Dados: OK");
      console.log("✅ Leitura: OK");
    } else {
      console.warn("⚠️ Dados não foram encontrados");
    }
  } catch (error: any) {
    console.error("❌ FORÇA FIRESTORE: Teste falhou:", error.message);
    console.error(
      "🔍 Verifique se o Firestore está REALMENTE ativo no projeto Firebase",
    );
  }
}, 3000);

export default true;
