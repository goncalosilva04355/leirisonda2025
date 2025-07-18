// Utilitário para melhorar performance durante desenvolvimento
// Desativa polling e intervals que causam refreshes no Builder.io

// Função para criar interval que só funciona em produção
export function createProductionInterval(
  callback: () => void,
  delay: number,
): NodeJS.Timeout | null {
  if (import.meta.env.DEV) {
    console.log(
      `🚫 Interval desativado em desenvolvimento (delay: ${delay}ms)`,
    );
    return null;
  }

  return setInterval(callback, delay);
}

// Função para criar timeout que só funciona em produção
export function createProductionTimeout(
  callback: () => void,
  delay: number,
): NodeJS.Timeout | null {
  if (import.meta.env.DEV) {
    console.log(`🚫 Timeout desativado em desenvolvimento (delay: ${delay}ms)`);
    return null;
  }

  return setTimeout(callback, delay);
}

// Função para limpar interval de forma segura
export function safeClearInterval(interval: NodeJS.Timeout | null): void {
  if (interval) {
    clearInterval(interval);
  }
}

// Wrapper para useEffect que só executa em produção
export function useProductionEffect(
  effect: () => void | (() => void),
  deps?: React.DependencyList,
): void {
  // Esta função não deve ser usada em produção - apenas em desenvolvimento para debug
  if (import.meta.env.DEV) {
    console.log("🚫 useEffect produção desativado em desenvolvimento");
    return;
  }

  // Em produção, executar normalmente (mas React não está disponível aqui)
  // Esta função precisa ser refatorada para ser usada corretamente
  console.warn("⚠️ devUseEffect: função precisa ser refatorada");
}

// Log de performance melhorada
if (import.meta.env.DEV) {
  console.log("🚀 Performance modo desenvolvimento ativo:");
  console.log("   ❌ Polling desativado");
  console.log("   ❌ Intervals desativados");
  console.log("   ❌ Auto-refresh desativado");
  console.log("   ✅ Builder.io estabilizado");
}
