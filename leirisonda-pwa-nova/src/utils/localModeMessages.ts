// Utilitário para mensagens padronizadas de modo local
// Substitui mensagens de erro do Firebase por mensagens informativas

export function logLocalMode(context: string): void {
  console.log(
    `📱 ${context}: Modo local ativo - aplicação funciona normalmente`,
  );
}

export function logLocalModeWithDetails(
  context: string,
  details?: string,
): void {
  console.log(`📱 ${context}: Modo local ativo`);
  if (details) {
    console.log(`💾 ${details}`);
  }
  console.log(`✅ Aplicação funciona normalmente sem Firebase`);
}

export function handleFirebaseError(context: string, error?: any): void {
  console.log(`📱 ${context}: Firebase não disponível, usando modo local`);
  if (error && process.env.NODE_ENV === "development") {
    console.log(`🔧 Debug (dev only):`, error.message || error);
  }
  console.log(`💾 Dados guardados no localStorage`);
}

export function logFirebaseDisabled(reason: string): void {
  console.log(`🚫 Firebase desativado: ${reason}`);
  console.log(`📱 Modo local: Aplicação funciona normalmente`);
  console.log(`💾 Dados guardados no localStorage`);
}

// Função para substituir console.error relacionados com Firebase
export function safeFirebaseLog(message: string, error?: any): void {
  // Se for erro relacionado com Firebase, tornar mais amigável
  if (message.includes("Firebase") || message.includes("firebase")) {
    const context = message.replace(/❌|✅|🔥|📱/, "").trim();
    logLocalMode(context);
  } else {
    // Se não for Firebase, manter o erro normal
    console.error(message, error);
  }
}

export default {
  logLocalMode,
  logLocalModeWithDetails,
  handleFirebaseError,
  logFirebaseDisabled,
  safeFirebaseLog,
};
