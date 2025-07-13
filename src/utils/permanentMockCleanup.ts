// Limpeza permanente de todos os dados mock e de teste
export class PermanentMockCleanup {
  static cleanAllMockData(): void {
    console.log("🧹 Iniciando limpeza permanente de dados mock e teste...");

    // Lista de todas as chaves mock/teste conhecidas
    const mockKeys = [
      "mock-users",
      "mock-current-user",
      "test-data",
      "sample-data",
      "demo-data",
      "example-data",
      "fake-data",
      "temp-users",
      "test-users",
      "sample-users",
      "demo-users",
      "test-works",
      "sample-works",
      "demo-works",
      "test-pools",
      "sample-pools",
      "demo-pools",
      "test-maintenance",
      "sample-maintenance",
      "demo-maintenance",
      "test-clients",
      "sample-clients",
      "demo-clients",
    ];

    let clearedCount = 0;

    // Remover todas as chaves mock
    mockKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        clearedCount++;
        console.log(`🗑️ Removido: ${key}`);
      }
    });

    // Procurar e remover outras chaves que possam conter "mock", "test", "demo", "sample"
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("mock") ||
        lowerKey.includes("test") ||
        lowerKey.includes("demo") ||
        lowerKey.includes("sample") ||
        lowerKey.includes("example") ||
        lowerKey.includes("fake") ||
        lowerKey.includes("temp")
      ) {
        // Exceções - não remover estas chaves importantes
        const exceptions = [
          "currentUser",
          "isAuthenticated",
          "savedLoginCredentials",
        ];
        if (!exceptions.includes(key)) {
          localStorage.removeItem(key);
          clearedCount++;
          console.log(`🗑️ Removido (pattern match): ${key}`);
        }
      }
    });

    console.log(`✅ Limpeza completa: ${clearedCount} chaves removidas`);
    console.log("🔒 Sistema agora contém apenas dados de produção");
  }

  // Função para verificar se existem dados mock
  static hasMockData(): boolean {
    const allKeys = Object.keys(localStorage);
    return allKeys.some((key) => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes("mock") ||
        lowerKey.includes("test") ||
        lowerKey.includes("demo") ||
        lowerKey.includes("sample")
      );
    });
  }

  // Função para listar dados mock existentes
  static listMockData(): string[] {
    const allKeys = Object.keys(localStorage);
    return allKeys.filter((key) => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes("mock") ||
        lowerKey.includes("test") ||
        lowerKey.includes("demo") ||
        lowerKey.includes("sample")
      );
    });
  }
}

// Executar limpeza automaticamente
console.log("🧹 Executando limpeza automática de dados mock...");
PermanentMockCleanup.cleanAllMockData();

// Verificação automática desabilitada para evitar refresh constante do Builder.io
// setInterval(() => {
//   if (PermanentMockCleanup.hasMockData()) {
//     console.log("⚠️ Dados mock detectados, limpando automaticamente...");
//     PermanentMockCleanup.cleanAllMockData();
//   }
// }, 30000);

console.log(
  "🔒 Mock cleanup: Verificação automática desabilitada para estabilidade",
);
