// Teste simples para verificar se o login funciona
import { robustAuthService } from "../services/robustAuthService";

export async function testLoginFunction(): Promise<void> {
  console.log("🧪 Testando função de login...");

  try {
    // Teste com credenciais válidas
    const result = await robustAuthService.login(
      "gongonsilva@gmail.com",
      "123",
      false,
    );

    if (result.success) {
      console.log("✅ Login teste bem-sucedido:", result.user?.email);

      // Limpar teste
      await robustAuthService.logout();
      console.log("🧹 Logout teste completado");

      console.log("🎉 TESTE DE LOGIN: PASSOU!");
    } else {
      console.error("❌ Login teste falhou:", result.error);
    }
  } catch (error) {
    console.error("❌ Erro no teste de login:", error);
  }
}

// Executar teste automaticamente
console.log("🚀 Iniciando teste automático de login...");
testLoginFunction();
