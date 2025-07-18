// Teste específico para directAuthService
import { directAuthService } from "../services/directAuthService";

export async function testDirectAuth(): Promise<void> {
  console.log("🔬 Testando DirectAuthService...");

  // Mostrar emails autorizados
  const authorizedEmails = directAuthService.getAuthorizedEmails();
  console.log("📋 Emails autorizados:", authorizedEmails);

  // Testar ambos emails com diferentes passwords
  const testCases = [
    { email: "gongonsilva@gmail.com", password: "123" },
    { email: "gongonsilva@gmail.com", password: "123456" },
    { email: "gongonsilva@gmail.com", password: "19867gsf" },
    { email: "goncalosfonseca@gmail.com", password: "123" },
    { email: "goncalosfonseca@gmail.com", password: "123456" },
    { email: "goncalosfonseca@gmail.com", password: "19867gsf" },
    { email: "teste@teste.com", password: "123" }, // Deve falhar
  ];

  for (const testCase of testCases) {
    try {
      console.log(`🧪 Testando: ${testCase.email} / ${testCase.password}`);
      const result = await directAuthService.login(
        testCase.email,
        testCase.password,
        false,
      );

      if (result.success) {
        console.log(`✅ SUCESSO: ${testCase.email}`);
        await directAuthService.logout();
      } else {
        console.log(`❌ FALHOU: ${testCase.email} - ${result.error}`);
      }
    } catch (error) {
      console.log(`💥 ERRO: ${testCase.email} - ${error}`);
    }
  }

  console.log("🏁 Teste DirectAuth completado!");
}

// Executar automaticamente
console.log("🚀 Iniciando teste DirectAuth...");
testDirectAuth();
