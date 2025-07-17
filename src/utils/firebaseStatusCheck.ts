/**
 * Quick Firebase status check with secure configuration
 */
import { getRestApiConfig } from "./firebaseConfigHelper";

export async function checkFirebaseStatus() {
  try {
    const config = getRestApiConfig();
    const apiKey = config.apiKey;

    // Teste simples - tentar fazer uma requisição mínima ao Firebase Auth
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: "test_token", // Token inválido propositadamente
        }),
      },
    );

    const data = await response.json();

    // Analisar tipo de erro
    if (data.error) {
      const errorMessage = data.error.message;

      if (errorMessage.includes("TOO_MANY_ATTEMPTS")) {
        return {
          status: "BLOCKED",
          message: "🚫 Firebase bloqueado - muitas tentativas",
          detail:
            "O Firebase está temporariamente bloqueado devido a muitas tentativas de login falhadas.",
          canRetry: false,
        };
      } else if (errorMessage.includes("INVALID_ID_TOKEN")) {
        return {
          status: "AVAILABLE",
          message: "✅ Firebase disponível",
          detail:
            "O Firebase está a responder normalmente (erro esperado com token inválido).",
          canRetry: true,
        };
      } else {
        return {
          status: "ERROR",
          message: "⚠️ Firebase com problemas",
          detail: `Erro: ${errorMessage}`,
          canRetry: false,
        };
      }
    }

    return {
      status: "AVAILABLE",
      message: "✅ Firebase disponível",
      detail: "O Firebase está a funcionar normalmente.",
      canRetry: true,
    };
  } catch (error: any) {
    return {
      status: "CONNECTION_ERROR",
      message: "❌ Erro de conexão",
      detail: `Não foi possível conectar ao Firebase: ${error.message}`,
      canRetry: false,
    };
  }
}

// Função para verificar quando o bloqueio pode ser removido
export function estimateUnblockTime() {
  const now = new Date();

  // Normalmente o Firebase desbloqueia em 15-60 minutos
  const minUnblock = new Date(now.getTime() + 15 * 60 * 1000); // +15 min
  const maxUnblock = new Date(now.getTime() + 60 * 60 * 1000); // +60 min

  return {
    min: minUnblock.toLocaleTimeString("pt-PT"),
    max: maxUnblock.toLocaleTimeString("pt-PT"),
  };
}
