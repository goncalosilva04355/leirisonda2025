/**
 * Script de teste para verificar se os utilizadores problemáticos foram removidos
 */

const PROBLEMATIC_EMAILS = [
  "yrzamr@gmail.com",
  "alexkamaryta@gmail.com",
  "davidcarreiraa92@gmail.com",
];

export const testCleanupSuccess = (): boolean => {
  console.log("🔍 Testando se a limpeza foi bem-sucedida...");

  let foundProblematicUsers = false;
  const foundEmails: string[] = [];

  // Verificar localStorage
  const userKeys = [
    "app-users",
    "mock-users",
    "users",
    "saved-users",
    "currentUser",
    "mock-current-user",
  ];

  for (const key of userKeys) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsedData = JSON.parse(data);

        if (Array.isArray(parsedData)) {
          // Array de utilizadores
          parsedData.forEach((user: any) => {
            const userEmail = user.email?.toLowerCase();
            if (
              userEmail &&
              PROBLEMATIC_EMAILS.some(
                (email) => email.toLowerCase() === userEmail,
              )
            ) {
              foundProblematicUsers = true;
              foundEmails.push(userEmail);
              console.log(
                `❌ Utilizador problemático ainda encontrado em ${key}: ${userEmail}`,
              );
            }
          });
        } else if (parsedData?.email) {
          // Utilizador único
          const userEmail = parsedData.email.toLowerCase();
          if (
            PROBLEMATIC_EMAILS.some(
              (email) => email.toLowerCase() === userEmail,
            )
          ) {
            foundProblematicUsers = true;
            foundEmails.push(userEmail);
            console.log(
              `❌ Utilizador problemático ainda encontrado em ${key}: ${userEmail}`,
            );
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao verificar ${key}:`, error);
    }
  }

  if (!foundProblematicUsers) {
    console.log("✅ TESTE PASSOU! Nenhum utilizador problemático encontrado.");
    return true;
  } else {
    console.log(
      `❌ TESTE FALHOU! Ainda existem ${foundEmails.length} utilizadores problemáticos:`,
      foundEmails,
    );
    return false;
  }
};

// Executar teste automaticamente após 3 segundos
setTimeout(() => {
  console.log("🧪 Executando teste de verificação da limpeza...");
  const success = testCleanupSuccess();

  if (!success) {
    console.log("🔧 Executando nova tentativa de limpeza...");
    import("./completeBadUserCleanup").then(({ executeCompleteCleanup }) => {
      executeCompleteCleanup();
    });
  }
}, 3000);

export default testCleanupSuccess;
