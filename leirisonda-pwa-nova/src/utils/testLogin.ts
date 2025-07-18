// Teste simples para verificar se o login funciona
import { robustAuthService } from "../services/robustAuthService";

export async function testLoginFunction(): Promise<void> {
  console.log("🧪 Testando função de login...");

  const emailsToTest = ["gongonsilva@gmail.com", "goncalosfonseca@gmail.com"];
  const passwordsToTest = ["123", "123456", "19867gsf"];

  for (const email of emailsToTest) {
    for (const password of passwordsToTest) {
      try {
        console.log(`🔍 Testando ${email} com password ${password}...`);
        const result = await robustAuthService.login(email, password, false);

        if (result.success) {
          console.log(`✅ Login OK: ${email} com ${password}`);
          await robustAuthService.logout();
        } else {
          console.log(
            `❌ Login falhou: ${email} com ${password} - ${result.error}`,
          );
        }
      } catch (error) {
        console.log(`❌ Erro: ${email} com ${password} - ${error}`);
      }
    }
  }

  console.log("🎉 TESTE DE LOGIN COMPLETO!");
}

// Executar teste automaticamente
console.log("🚀 Iniciando teste automático de login...");
testLoginFunction();
