import { saveUser, saveData, getData } from "./ultraSimpleFirestore";

// Teste que confirma que está funcionando
setTimeout(async () => {
  try {
    console.log("🧪 TESTE FINAL: Confirmando que funciona...");

    // Teste 1: Salvar usuário
    await saveUser({
      uid: "test-user",
      email: "teste@teste.com",
      name: "Teste",
      role: "admin",
    });

    // Teste 2: Salvar dados
    await saveData("test", {
      message: "Funciona!",
      timestamp: new Date().toISOString(),
    });

    // Teste 3: Obter dados
    const data = await getData("test");

    if (data.length > 0) {
      console.log("🎉 CONFIRMADO: FIRESTORE ESTÁ FUNCIONANDO PERFEITAMENTE!");
      console.log("✅ Utilizadores: OK");
      console.log("✅ Dados: OK");
      console.log("✅ Leitura: OK");

      // Disponibilizar globalmente
      (window as any).firestoreStatus = "WORKING";
      (window as any).firestoreTest = { saveUser, saveData, getData };
    } else {
      console.warn("⚠️ Teste retornou dados vazios");
    }
  } catch (error) {
    console.error("❌ Teste falhou:", error);
  }
}, 2000);

export default true;
